
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, Send, Shield, Calendar, RefreshCw, Plus, Trash2, CheckCircle2, 
  AlertTriangle, Clock, Users, History
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SystemAlert {
  id: string;
  title: string;
  message: string;
  alert_type: "info" | "warning" | "critical" | "success";
  target_audience: "all" | "drivers" | "admin" | "specific";
  send_date: string | null;
  is_sent: boolean;
  created_at: string;
}

const AlertManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState<Omit<SystemAlert, "id" | "created_at">>({
    title: "",
    message: "",
    alert_type: "info",
    target_audience: "all",
    send_date: null,
    is_sent: false
  });

  useEffect(() => {
    // Simulate fetching alerts from database
    fetchAlerts();
    
    // Setup real-time listener for alert updates
    const channel = supabase
      .channel('alert_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'system_alerts' 
      }, (payload) => {
        // In a real implementation, you would refresh alerts from the database
        console.log('Alerts changed:', payload);
        fetchAlerts();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchAlerts = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('system_alerts')
      //   .select('*')
      //   .order('created_at', { ascending: false });
      
      // Simulated data
      const data: SystemAlert[] = [
        {
          id: "1",
          title: "System Maintenance Alert",
          message: "The app will be undergoing scheduled maintenance on Saturday from 2:00 AM to 5:00 AM. Some features may be unavailable during this time.",
          alert_type: "info",
          target_audience: "all",
          send_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          is_sent: false,
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          title: "License Expiration Reminder",
          message: "Your driving license will expire in 30 days. Please visit your nearest RTO office to renew it.",
          alert_type: "warning",
          target_audience: "drivers",
          send_date: null,
          is_sent: true,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "3",
          title: "New Traffic Regulations",
          message: "Important: New traffic regulations are in effect starting today. Please review the updated rules in the app.",
          alert_type: "critical",
          target_audience: "all",
          send_date: null,
          is_sent: true,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast({
        title: "Error",
        description: "Failed to load alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = () => {
    setNewAlert({
      title: "",
      message: "",
      alert_type: "info",
      target_audience: "all",
      send_date: null,
      is_sent: false
    });
    setShowForm(true);
  };

  const handleSendAlert = async () => {
    setLoading(true);
    
    try {
      if (!newAlert.title || !newAlert.message) {
        toast({
          title: "Missing Information",
          description: "Please provide a title and message for the alert",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // In a real app, this would save to Supabase
      // const { data, error } = await supabase
      //   .from('system_alerts')
      //   .insert({
      //     title: newAlert.title,
      //     message: newAlert.message,
      //     alert_type: newAlert.alert_type,
      //     target_audience: newAlert.target_audience,
      //     send_date: newAlert.send_date,
      //     is_sent: !newAlert.send_date // If no send date, send immediately
      //   });
      
      // Simulate creation
      const newId = Date.now().toString();
      const now = new Date().toISOString();
      const isSentImmediately = !newAlert.send_date;
      
      setAlerts([
        {
          ...newAlert,
          id: newId,
          is_sent: isSentImmediately,
          created_at: now
        },
        ...alerts
      ]);
      
      setShowForm(false);
      setNewAlert({
        title: "",
        message: "",
        alert_type: "info",
        target_audience: "all",
        send_date: null,
        is_sent: false
      });
      
      toast({
        title: isSentImmediately ? "Alert Sent" : "Alert Scheduled",
        description: isSentImmediately 
          ? "The alert has been sent to users" 
          : "The alert has been scheduled for delivery",
      });
    } catch (error) {
      console.error("Error creating alert:", error);
      toast({
        title: "Error",
        description: "Failed to send or schedule alert",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    if (confirm("Are you sure you want to delete this alert?")) {
      try {
        // In a real app, this would delete from Supabase
        // const { error } = await supabase
        //   .from('system_alerts')
        //   .delete()
        //   .eq('id', id);
        
        // Simulate deletion
        setAlerts(alerts.filter(alert => alert.id !== id));
        
        toast({
          title: "Alert Deleted",
          description: "The alert has been deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting alert:", error);
        toast({
          title: "Error",
          description: "Failed to delete alert",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Immediate";
    return new Date(dateString).toLocaleString();
  };

  const getAlertTypeStyle = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-amber-100 text-amber-800";
      case "critical":
        return "bg-red-100 text-red-800";
      case "success":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-titeh-primary">Alert Management</h1>
          
          <div className="flex items-center space-x-4">
            {!showForm && (
              <Button onClick={handleCreateAlert}>
                <Plus className="mr-2 h-4 w-4" />
                Create Alert
              </Button>
            )}
            
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-titeh-primary mr-2" />
              <span>System Alerts</span>
            </div>
          </div>
        </div>
        
        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>Create Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Alert Title</Label>
                  <Input 
                    id="title"
                    value={newAlert.title}
                    onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                    placeholder="Enter alert title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Alert Message</Label>
                  <Textarea
                    id="message"
                    value={newAlert.message}
                    onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                    rows={4}
                    placeholder="Enter alert message"
                  />
                </div>
                
                <div>
                  <Label>Alert Type</Label>
                  <RadioGroup 
                    value={newAlert.alert_type} 
                    onValueChange={(value: "info" | "warning" | "critical" | "success") => 
                      setNewAlert({...newAlert, alert_type: value})
                    }
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="info" id="alert-info" />
                      <Label htmlFor="alert-info" className="text-blue-600">Information</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="warning" id="alert-warning" />
                      <Label htmlFor="alert-warning" className="text-amber-600">Warning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="critical" id="alert-critical" />
                      <Label htmlFor="alert-critical" className="text-red-600">Critical</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="success" id="alert-success" />
                      <Label htmlFor="alert-success" className="text-green-600">Success</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="target">Target Audience</Label>
                  <Select 
                    value={newAlert.target_audience} 
                    onValueChange={(value: "all" | "drivers" | "admin" | "specific") => 
                      setNewAlert({...newAlert, target_audience: value})
                    }
                  >
                    <SelectTrigger id="target">
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="drivers">Drivers Only</SelectItem>
                      <SelectItem value="admin">Administrators</SelectItem>
                      <SelectItem value="specific">Specific Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="send_date">Schedule Delivery (Optional)</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input 
                      id="send_date"
                      type="datetime-local"
                      value={newAlert.send_date ? new Date(newAlert.send_date).toISOString().slice(0, 16) : ""}
                      onChange={(e) => setNewAlert({
                        ...newAlert, 
                        send_date: e.target.value ? new Date(e.target.value).toISOString() : null
                      })}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => setNewAlert({...newAlert, send_date: null})}
                    >
                      Send Immediately
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    onClick={handleSendAlert}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : newAlert.send_date ? (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Alert
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Alert
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-titeh-primary" />
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No alerts yet</p>
                  <p className="text-sm mt-1">Create your first alert</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Send Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">{alert.title}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${getAlertTypeStyle(alert.alert_type)}`}>
                            {alert.alert_type.charAt(0).toUpperCase() + alert.alert_type.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">
                              {alert.target_audience === "all" ? "All Users" : 
                               alert.target_audience === "drivers" ? "Drivers Only" :
                               alert.target_audience === "admin" ? "Administrators" : 
                               "Specific Users"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            alert.is_sent
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {alert.is_sent ? "Sent" : "Scheduled"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            {formatDate(alert.send_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => handleDeleteAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Alert Tips</h3>
                      <ul className="text-sm text-gray-600 mt-1 space-y-1">
                        <li>Use critical alerts sparingly for urgent issues only</li>
                        <li>Schedule non-urgent alerts during off-peak hours</li>
                        <li>Target your audience to avoid alert fatigue</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Delivery Notice</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Immediate alerts will be delivered to users within 60 seconds.
                        Scheduled alerts may have a delay of up to 5 minutes from the set time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AlertManagement;
