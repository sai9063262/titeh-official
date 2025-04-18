
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  AlertTriangle, 
  MapPin, 
  BarChart, 
  RefreshCw, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  Filter,
  ChevronRight,
  ChevronLeft,
  Trash,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TELANGANA_DISTRICTS } from "@/types/safety";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AlertData {
  id: string;
  type: "accident" | "congestion" | "roadwork" | "weather" | "emergency" | "police";
  title: string;
  description: string;
  location: string;
  district: string;
  timestamp: string;
  status: "active" | "resolved" | "pending";
  severity: "low" | "medium" | "high" | "critical";
  source: "system" | "user" | "police" | "traffic-dept";
  coordinates: {
    lat: number;
    lng: number;
  };
}

const TSafeMonitoring = () => {
  const { toast } = useToast();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Generate sample alert data
  useEffect(() => {
    const alertTypes = ["accident", "congestion", "roadwork", "weather", "emergency", "police"];
    const severities = ["low", "medium", "high", "critical"];
    const statuses = ["active", "resolved", "pending"];
    const sources = ["system", "user", "police", "traffic-dept"];
    
    const sampleAlerts: AlertData[] = [];
    
    // Generate 50 random alerts across districts
    for (let i = 0; i < 50; i++) {
      const district = TELANGANA_DISTRICTS[Math.floor(Math.random() * TELANGANA_DISTRICTS.length)];
      const type = alertTypes[Math.floor(Math.random() * alertTypes.length)] as "accident" | "congestion" | "roadwork" | "weather" | "emergency" | "police";
      const severity = severities[Math.floor(Math.random() * severities.length)] as "low" | "medium" | "high" | "critical";
      const status = statuses[Math.floor(Math.random() * statuses.length)] as "active" | "resolved" | "pending";
      const source = sources[Math.floor(Math.random() * sources.length)] as "system" | "user" | "police" | "traffic-dept";
      
      // Create a random date within the last 7 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 7));
      
      let title = "";
      let description = "";
      
      switch (type) {
        case "accident":
          title = "Traffic Accident";
          description = `${severity === "critical" ? "Major" : severity === "high" ? "Serious" : "Minor"} accident reported near ${district} area`;
          break;
        case "congestion":
          title = "Heavy Traffic Congestion";
          description = `Traffic congestion reported on main roads in ${district}`;
          break;
        case "roadwork":
          title = "Road Maintenance";
          description = `Roadwork in progress on highway section near ${district}`;
          break;
        case "weather":
          title = "Weather Alert";
          description = `${severity === "critical" ? "Severe" : severity === "high" ? "Heavy" : "Light"} rain affecting visibility in ${district}`;
          break;
        case "emergency":
          title = "Emergency Situation";
          description = `Emergency services responding to incident in ${district}`;
          break;
        case "police":
          title = "Police Activity";
          description = `Traffic being diverted due to police activity in ${district}`;
          break;
      }
      
      sampleAlerts.push({
        id: `alert-${i + 1}`,
        type,
        title,
        description,
        location: `${district} Main Road, Junction ${Math.floor(Math.random() * 20) + 1}`,
        district,
        timestamp: date.toISOString(),
        status,
        severity,
        source,
        coordinates: {
          lat: 17.4 + (Math.random() * 2 - 1),
          lng: 78.5 + (Math.random() * 2 - 1)
        }
      });
    }
    
    // Sort by timestamp (newest first)
    sampleAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setAlerts(sampleAlerts);
    setIsLoading(false);
  }, []);
  
  // Apply filters
  useEffect(() => {
    let result = [...alerts];
    
    // Filter by district
    if (selectedDistrict !== "all") {
      result = result.filter(alert => alert.district === selectedDistrict);
    }
    
    // Filter by severity
    if (selectedSeverity !== "all") {
      result = result.filter(alert => alert.severity === selectedSeverity);
    }
    
    // Filter by status
    if (selectedStatus !== "all") {
      result = result.filter(alert => alert.status === selectedStatus);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        alert => alert.title.toLowerCase().includes(query) || 
                alert.description.toLowerCase().includes(query) || 
                alert.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredAlerts(result);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [alerts, selectedDistrict, selectedSeverity, selectedStatus, searchQuery]);
  
  const pageSize = 8;
  const totalPages = Math.ceil(filteredAlerts.length / pageSize);
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  
  const handleAlertDetail = (alert: AlertData) => {
    setSelectedAlert(alert);
    setIsDetailModalOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: "resolved" } : alert
    ));
    
    toast({
      title: "Alert Resolved",
      description: "The alert has been marked as resolved.",
    });
  };
  
  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    
    toast({
      title: "Alert Deleted",
      description: "The alert has been deleted from the system.",
    });
    
    setIsDetailModalOpen(false);
  };
  
  const getSeverityBadge = (severity: "low" | "medium" | "high" | "critical") => {
    switch (severity) {
      case "low":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Low</span>;
      case "medium":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>;
      case "high":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">High</span>;
      case "critical":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Critical</span>;
    }
  };
  
  const getStatusBadge = (status: "active" | "resolved" | "pending") => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Active</span>;
      case "resolved":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Resolved</span>;
      case "pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
    }
  };
  
  const getTypeBadge = (type: "accident" | "congestion" | "roadwork" | "weather" | "emergency" | "police") => {
    switch (type) {
      case "accident":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Accident</span>;
      case "congestion":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Congestion</span>;
      case "roadwork":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Roadwork</span>;
      case "weather":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Weather</span>;
      case "emergency":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Emergency</span>;
      case "police":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Police</span>;
    }
  };
  
  const getAlertTypeIcon = (type: "accident" | "congestion" | "roadwork" | "weather" | "emergency" | "police") => {
    switch (type) {
      case "accident":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case "congestion":
        return <AlertCircle className="h-6 w-6 text-orange-500" />;
      case "roadwork":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "weather":
        return <AlertTriangle className="h-6 w-6 text-blue-500" />;
      case "emergency":
        return <AlertTriangle className="h-6 w-6 text-purple-500" />;
      case "police":
        return <AlertTriangle className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const getSeverityColor = (severity: "low" | "medium" | "high" | "critical") => {
    switch (severity) {
      case "low":
        return "border-blue-200 bg-blue-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "high":
        return "border-orange-200 bg-orange-50";
      case "critical":
        return "border-red-200 bg-red-50";
    }
  };
  
  const refreshAlerts = () => {
    setIsLoading(true);
    
    // Simulate refresh by adding 1-3 new alerts
    setTimeout(() => {
      const alertTypes = ["accident", "congestion", "roadwork", "weather", "emergency", "police"];
      const severities = ["low", "medium", "high", "critical"];
      const statuses = ["active", "pending"];
      const sources = ["system", "user", "police", "traffic-dept"];
      
      const newAlerts: AlertData[] = [];
      const numNewAlerts = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numNewAlerts; i++) {
        const district = TELANGANA_DISTRICTS[Math.floor(Math.random() * TELANGANA_DISTRICTS.length)];
        const type = alertTypes[Math.floor(Math.random() * alertTypes.length)] as "accident" | "congestion" | "roadwork" | "weather" | "emergency" | "police";
        const severity = severities[Math.floor(Math.random() * severities.length)] as "low" | "medium" | "high" | "critical";
        const status = statuses[Math.floor(Math.random() * statuses.length)] as "active" | "pending";
        const source = sources[Math.floor(Math.random() * sources.length)] as "system" | "user" | "police" | "traffic-dept";
        
        // Create current timestamp
        const date = new Date();
        
        let title = "";
        let description = "";
        
        switch (type) {
          case "accident":
            title = "New Traffic Accident";
            description = `${severity === "critical" ? "Major" : severity === "high" ? "Serious" : "Minor"} accident just reported near ${district} area`;
            break;
          case "congestion":
            title = "Heavy Traffic Alert";
            description = `New traffic congestion reported on main roads in ${district}`;
            break;
          case "roadwork":
            title = "New Road Maintenance";
            description = `Roadwork has started on highway section near ${district}`;
            break;
          case "weather":
            title = "Weather Warning";
            description = `${severity === "critical" ? "Severe" : severity === "high" ? "Heavy" : "Light"} rain affecting visibility in ${district}`;
            break;
          case "emergency":
            title = "New Emergency Alert";
            description = `Emergency services responding to new incident in ${district}`;
            break;
          case "police":
            title = "Police Activity Alert";
            description = `Traffic being diverted due to police activity in ${district}`;
            break;
        }
        
        newAlerts.push({
          id: `alert-new-${Date.now()}-${i}`,
          type,
          title,
          description,
          location: `${district} Main Road, Junction ${Math.floor(Math.random() * 20) + 1}`,
          district,
          timestamp: date.toISOString(),
          status,
          severity,
          source,
          coordinates: {
            lat: 17.4 + (Math.random() * 2 - 1),
            lng: 78.5 + (Math.random() * 2 - 1)
          }
        });
      }
      
      // Add new alerts to the top of the list
      setAlerts(prev => [...newAlerts, ...prev]);
      setIsLoading(false);
      
      if (newAlerts.length > 0) {
        toast({
          title: `${newAlerts.length} New Alert${newAlerts.length > 1 ? 's' : ''}`,
          description: "Refresh completed with new alerts."
        });
      } else {
        toast({
          title: "Refresh Complete",
          description: "No new alerts at this time."
        });
      }
    }, 1500);
  };

  useEffect(() => {
    let interval: number | null = null;
    
    if (autoRefresh) {
      interval = window.setInterval(() => {
        refreshAlerts();
      }, 60000); // Refresh every minute
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-titeh-primary">T-Safe Monitoring</h1>
            <p className="text-gray-500">Real-time traffic alerts and emergency monitoring</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label htmlFor="auto-refresh" className="text-sm">
                {autoRefresh ? <PlayCircle className="h-4 w-4 inline mr-1" /> : <PauseCircle className="h-4 w-4 inline mr-1" />}
                Auto-refresh
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
              <Label htmlFor="notifications" className="text-sm">
                {notificationsEnabled ? <Eye className="h-4 w-4 inline mr-1" /> : <EyeOff className="h-4 w-4 inline mr-1" />}
                Notifications
              </Label>
            </div>
            
            <Button
              variant="outline"
              className="gap-2"
              onClick={refreshAlerts}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-titeh-primary" />
                  Traffic Alerts
                </CardTitle>
                <CardDescription>
                  View and manage real-time traffic alerts across Telangana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                      <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="Search alerts..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="District" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Districts</SelectItem>
                          {TELANGANA_DISTRICTS.map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severities</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-titeh-primary"></div>
                      </div>
                    ) : paginatedAlerts.length === 0 ? (
                      <div className="flex items-center justify-center h-64 text-gray-500">
                        <div className="text-center">
                          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                          <p>No alerts found matching your criteria</p>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {paginatedAlerts.map((alert) => (
                          <div 
                            key={alert.id} 
                            className={`p-4 hover:bg-gray-50 cursor-pointer ${getSeverityColor(alert.severity)} border-l-4 border-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : alert.severity === 'medium' ? 'yellow' : 'blue'}-500`}
                            onClick={() => handleAlertDetail(alert)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                {getAlertTypeIcon(alert.type)}
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between">
                                  <h3 className="font-medium">{alert.title}</h3>
                                  <div className="flex gap-1">
                                    {getSeverityBadge(alert.severity)}
                                    {getStatusBadge(alert.status)}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                                <div className="flex justify-between mt-2">
                                  <p className="text-xs text-gray-500 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {alert.location}
                                  </p>
                                  <p className="text-xs text-gray-500 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatDate(alert.timestamp)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {!isLoading && totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <p className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Alert Statistics</CardTitle>
                <CardDescription>Overview of current traffic alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary">
                  <TabsList className="mb-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="bydistrict">By District</TabsTrigger>
                    <TabsTrigger value="bytype">By Type</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-500">Active Alerts</p>
                        <p className="text-2xl font-semibold">{alerts.filter(a => a.status === "active").length}</p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-500">Pending Alerts</p>
                        <p className="text-2xl font-semibold">{alerts.filter(a => a.status === "pending").length}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-500">Resolved Alerts</p>
                        <p className="text-2xl font-semibold">{alerts.filter(a => a.status === "resolved").length}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-500">Total Alerts</p>
                        <p className="text-2xl font-semibold">{alerts.length}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Critical Alerts Summary</h3>
                        <p className="text-sm text-gray-600">
                          There are currently {alerts.filter(a => a.severity === "critical" && a.status !== "resolved").length} unresolved critical alerts.
                        </p>
                        {alerts.filter(a => a.severity === "critical" && a.status !== "resolved").length > 0 && (
                          <Button variant="outline" size="sm" className="mt-2" onClick={() => setSelectedSeverity("critical")}>
                            View Critical Alerts
                          </Button>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="bydistrict">
                    <div className="space-y-3">
                      {TELANGANA_DISTRICTS.filter(district => 
                        alerts.some(alert => alert.district === district)
                      ).map(district => {
                        const districtAlerts = alerts.filter(alert => alert.district === district);
                        const activeCount = districtAlerts.filter(a => a.status === "active").length;
                        const totalCount = districtAlerts.length;
                        const percentage = Math.round((activeCount / totalCount) * 100) || 0;
                        
                        return (
                          <div key={district} className="p-3 border rounded-lg">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{district}</h3>
                              <p className="text-sm">{activeCount} active / {totalCount} total</p>
                            </div>
                            <div className="mt-2 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-titeh-primary rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                  <TabsContent value="bytype">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 border rounded-lg bg-red-50">
                        <p className="text-sm text-red-500">Accidents</p>
                        <p className="text-2xl font-semibold">{alerts.filter(a => a.type === "accident").length}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-orange-50">
                        <p className="text-sm text-orange-500">Congestion</p>
                        <p className="text-2xl font-semibold">{alerts.filter(a => a.type === "congestion").length}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-yellow-50">
                        <p className="text-sm text-yellow-500">Roadwork</p>
                        <p className="text-2xl font-semibold">{alerts.filter(a => a.type === "roadwork").length}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-blue-50">
                        <p className="text-sm text-blue-500">Weather</p>
                        <p className="text-2xl font-semibold">{alerts.filter(a => a.type === "weather").length}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-purple-50">
                        <p className="text-sm text-purple-500">Emergency</p>
                        <p className="text-2xl font-semibold">{alerts.filter(a => a.type === "emergency").length}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-500">Police</p>
                        <p className="text-2xl font-semibold">{alerts.filter(a => a.type === "police").length}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alert Distribution</CardTitle>
                <CardDescription>Geographic distribution of alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive map will be available in the next update</p>
                  </div>
                </div>
                
                <h3 className="font-medium mb-2">Top Alert Locations</h3>
                <div className="space-y-2">
                  {TELANGANA_DISTRICTS.slice(0, 5).map(district => {
                    const count = alerts.filter(a => a.district === district).length;
                    return (
                      <div key={district} className="flex justify-between items-center p-2 border-b">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-titeh-primary" />
                          <span>{district}</span>
                        </div>
                        <span className="text-sm font-medium">{count} alerts</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alert Management</CardTitle>
                <CardDescription>Quick actions and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-blue-500" />
                      <span className="font-medium">Alert Notifications</span>
                    </div>
                    <Switch
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-purple-500" />
                      <span className="font-medium">Critical Alert Sounds</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <RefreshCw className="h-5 w-5 mr-2 text-green-500" />
                      <span className="font-medium">Auto-refresh Alerts</span>
                    </div>
                    <Switch
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-medium text-yellow-800 flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Alert Response Guidelines
                  </h3>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>Verify all alerts before taking action</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>Prioritize critical and high severity alerts</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>Mark alerts as resolved when addressed</span>
                    </li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-titeh-primary"
                  onClick={() => toast({
                    title: "Report Filed",
                    description: "Your traffic alert report has been submitted successfully",
                  })}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report New Traffic Alert
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Alert Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAlert && getAlertTypeIcon(selectedAlert.type)}
              {selectedAlert?.title}
            </DialogTitle>
            <DialogDescription>
              Alert ID: {selectedAlert?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAlert && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {getTypeBadge(selectedAlert.type)}
                {getSeverityBadge(selectedAlert.severity)}
                {getStatusBadge(selectedAlert.status)}
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p>{selectedAlert.description}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{selectedAlert.location}</p>
                  <p className="text-sm">{selectedAlert.district}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Reported</p>
                  <p>{formatDate(selectedAlert.timestamp)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Source</p>
                  <p className="capitalize">{selectedAlert.source.replace('-', ' ')}</p>
                </div>
              </div>
              
              <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-1" />
                  <p>Location map</p>
                </div>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                {selectedAlert.status !== "resolved" && (
                  <Button 
                    variant="outline" 
                    className="flex-1 sm:flex-initial"
                    onClick={() => handleResolveAlert(selectedAlert.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark Resolved
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="flex-1 sm:flex-initial text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteAlert(selectedAlert.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Alert
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TSafeMonitoring;
