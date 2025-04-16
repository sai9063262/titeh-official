
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Bell, Car, Map, Settings, Bell as BellIcon } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const SpeedAlerts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("settings");
  const [speedLimit, setSpeedLimit] = useState(60);
  const [schoolZoneLimit, setSchoolZoneLimit] = useState(30);
  const [residentialLimit, setResidentialLimit] = useState(40);
  const [geofenceRadius, setGeofenceRadius] = useState(500);
  
  // Toggle states
  const [isVoiceAlertEnabled, setIsVoiceAlertEnabled] = useState(true);
  const [isVisualAlertEnabled, setIsVisualAlertEnabled] = useState(true);
  const [isSchoolZoneAlertEnabled, setIsSchoolZoneAlertEnabled] = useState(true);
  const [isResidentialAlertEnabled, setIsResidentialAlertEnabled] = useState(true);
  const [isGeofenceAlertEnabled, setIsGeofenceAlertEnabled] = useState(true);

  // Simulated alerts
  const speedAlerts = [
    {
      id: 1,
      date: "2025-04-16T09:23:00",
      location: "NH 44, Hyderabad",
      speed: 78,
      limit: 60,
      type: "Highway"
    },
    {
      id: 2,
      date: "2025-04-16T08:15:00",
      location: "Banjara Hills Road No. 12",
      speed: 55,
      limit: 40,
      type: "Residential"
    },
    {
      id: 3,
      date: "2025-04-15T14:30:00",
      location: "Near Delhi Public School",
      speed: 45,
      limit: 30,
      type: "School Zone"
    }
  ];
  
  // Geo-fences
  const geofences = [
    {
      id: 1,
      name: "Home",
      location: "Jubilee Hills",
      radius: 500,
      limit: 40
    },
    {
      id: 2,
      name: "Office",
      location: "Hi-Tech City",
      radius: 300,
      limit: 30
    },
    {
      id: 3,
      name: "Parents' Home",
      location: "Kukatpally",
      radius: 500,
      limit: 40
    }
  ];

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your speed alert settings have been updated",
    });
  };

  const handleAddGeofence = () => {
    toast({
      title: "Location Service Required",
      description: "Please select a location on the map to add a geofence",
    });
  };

  const handleClearAlerts = () => {
    toast({
      title: "Alerts Cleared",
      description: "All speed alert history has been cleared",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getAlertColor = (speed: number, limit: number) => {
    const difference = speed - limit;
    if (difference >= 20) return "bg-red-500";
    if (difference >= 10) return "bg-amber-500";
    return "bg-blue-500";
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-titeh-primary">Speed Alerts</h1>
          <Badge className="text-xs py-1 bg-blue-100 text-blue-800 hover:bg-blue-100">
            <BellIcon className="h-3 w-3 mr-1" />
            Real-time Alerts
          </Badge>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="history">
              <Bell className="h-4 w-4 mr-2" />
              Alert History
            </TabsTrigger>
            <TabsTrigger value="geofence">
              <Map className="h-4 w-4 mr-2" />
              Geo-fences
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Voice Alerts</h3>
                      <p className="text-sm text-gray-500">Get voice notifications when exceeding speed limits</p>
                    </div>
                    <Switch
                      checked={isVoiceAlertEnabled}
                      onCheckedChange={setIsVoiceAlertEnabled}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Visual Alerts</h3>
                      <p className="text-sm text-gray-500">Display on-screen alerts when exceeding speed limits</p>
                    </div>
                    <Switch
                      checked={isVisualAlertEnabled}
                      onCheckedChange={setIsVisualAlertEnabled}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="speedLimit">Default Speed Limit (km/h)</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="speedLimit"
                        type="number" 
                        value={speedLimit} 
                        onChange={(e) => setSpeedLimit(parseInt(e.target.value))}
                        min={20}
                        max={120}
                      />
                      <span className="text-sm text-gray-500">km/h</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Special Zone Alerts</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">School Zone Alerts</h3>
                      <p className="text-sm text-gray-500">Get alerts in school zones</p>
                    </div>
                    <Switch
                      checked={isSchoolZoneAlertEnabled}
                      onCheckedChange={setIsSchoolZoneAlertEnabled}
                    />
                  </div>
                  
                  <div className="pl-6 space-y-2">
                    <Label htmlFor="schoolSpeedLimit">School Zone Speed Limit (km/h)</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="schoolSpeedLimit"
                        type="number" 
                        value={schoolZoneLimit} 
                        onChange={(e) => setSchoolZoneLimit(parseInt(e.target.value))}
                        disabled={!isSchoolZoneAlertEnabled}
                        min={10}
                        max={50}
                      />
                      <span className="text-sm text-gray-500">km/h</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Residential Area Alerts</h3>
                      <p className="text-sm text-gray-500">Get alerts in residential areas</p>
                    </div>
                    <Switch
                      checked={isResidentialAlertEnabled}
                      onCheckedChange={setIsResidentialAlertEnabled}
                    />
                  </div>
                  
                  <div className="pl-6 space-y-2">
                    <Label htmlFor="residentialSpeedLimit">Residential Speed Limit (km/h)</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="residentialSpeedLimit"
                        type="number" 
                        value={residentialLimit} 
                        onChange={(e) => setResidentialLimit(parseInt(e.target.value))}
                        disabled={!isResidentialAlertEnabled}
                        min={20}
                        max={60}
                      />
                      <span className="text-sm text-gray-500">km/h</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    className="bg-titeh-primary hover:bg-blue-700"
                    onClick={handleSaveSettings}
                  >
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Speed Alerts</h3>
                  <Button variant="outline" size="sm" onClick={handleClearAlerts}>
                    Clear All
                  </Button>
                </div>
                
                {speedAlerts.length > 0 ? (
                  <div className="space-y-4">
                    {speedAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 border-b pb-3">
                        <div className={`p-1.5 rounded-full mt-0.5 ${getAlertColor(alert.speed, alert.limit)}`}>
                          <Car className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{alert.location}</h4>
                            <Badge variant="outline" className="ml-2">
                              {alert.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDateTime(alert.date)}
                          </div>
                          <div className="mt-1 flex items-center">
                            <span className="text-lg font-semibold">{alert.speed} km/h</span>
                            <span className="text-sm text-gray-500 ml-1">
                              (Limit: {alert.limit} km/h)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-lg font-medium">No Alerts</h3>
                    <p className="text-sm text-gray-500">You haven't received any speed alerts yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="geofence">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Custom Geo-fence Zones</h3>
                    <p className="text-sm text-gray-500">Create custom speed limit zones</p>
                  </div>
                  <Switch
                    checked={isGeofenceAlertEnabled}
                    onCheckedChange={setIsGeofenceAlertEnabled}
                  />
                </div>
                
                <div className="space-y-2 mb-6">
                  <Label htmlFor="geofenceRadius">Default Geo-fence Radius (meters)</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="geofenceRadius"
                      type="number" 
                      value={geofenceRadius} 
                      onChange={(e) => setGeofenceRadius(parseInt(e.target.value))}
                      disabled={!isGeofenceAlertEnabled}
                      min={100}
                      max={2000}
                    />
                    <span className="text-sm text-gray-500">meters</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-titeh-primary hover:bg-blue-700 mb-4"
                  disabled={!isGeofenceAlertEnabled}
                  onClick={handleAddGeofence}
                >
                  Add New Geo-fence
                </Button>
                
                {isGeofenceAlertEnabled && geofences.length > 0 ? (
                  <div className="space-y-3 mt-4">
                    {geofences.map((fence) => (
                      <div key={fence.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{fence.name}</h4>
                          <p className="text-sm text-gray-500">{fence.location}</p>
                          <div className="flex text-xs text-gray-500 mt-1 space-x-2">
                            <span>{fence.radius}m radius</span>
                            <span>•</span>
                            <span>{fence.limit} km/h limit</span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-red-500 h-auto py-1">
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : !isGeofenceAlertEnabled ? (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Enable geo-fence alerts to manage zones</p>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <Map className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <h3 className="font-medium">No Geo-fences</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Add custom speed limit zones for specific areas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SpeedAlerts;
