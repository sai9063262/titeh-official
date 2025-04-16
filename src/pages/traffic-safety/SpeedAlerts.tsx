
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Gauge, MapPin, AlertTriangle, Bell, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface SpeedLimit {
  id: string;
  area: string;
  maxSpeed: number;
  description: string;
  roadType: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const speedLimits: SpeedLimit[] = [
  {
    id: "sl-001",
    area: "Hyderabad City Roads",
    maxSpeed: 40,
    description: "General city roads within Hyderabad municipal limits",
    roadType: "City Road",
    coordinates: {
      lat: 17.385044,
      lng: 78.486671
    }
  },
  {
    id: "sl-002",
    area: "Outer Ring Road",
    maxSpeed: 100,
    description: "Hyderabad's 158 km orbital highway",
    roadType: "Highway",
    coordinates: {
      lat: 17.420000,
      lng: 78.380000
    }
  },
  {
    id: "sl-003",
    area: "School Zones",
    maxSpeed: 20,
    description: "Areas within 100m of any educational institution",
    roadType: "Special Zone",
    coordinates: {
      lat: 17.415044,
      lng: 78.496671
    }
  },
  {
    id: "sl-004",
    area: "PV Narasimha Rao Expressway",
    maxSpeed: 80,
    description: "Elevated expressway from Mehdipatnam to Aramgarh",
    roadType: "Expressway",
    coordinates: {
      lat: 17.375044,
      lng: 78.456671
    }
  },
  {
    id: "sl-005",
    area: "Residential Areas",
    maxSpeed: 30,
    description: "All residential colony internal roads",
    roadType: "Residential",
    coordinates: {
      lat: 17.445044,
      lng: 78.426671
    }
  },
  {
    id: "sl-006",
    area: "NH-65 (Hyderabad-Vijayawada)",
    maxSpeed: 100,
    description: "National Highway section within Telangana",
    roadType: "Highway",
    coordinates: {
      lat: 17.395044,
      lng: 78.646671
    }
  },
  {
    id: "sl-007",
    area: "Tank Bund Road",
    maxSpeed: 40,
    description: "Scenic road alongside Hussain Sagar",
    roadType: "City Road",
    coordinates: {
      lat: 17.425044,
      lng: 78.476671
    }
  },
  {
    id: "sl-008",
    area: "Hospital Zones",
    maxSpeed: 20,
    description: "Areas within 100m of any hospital or healthcare facility",
    roadType: "Special Zone",
    coordinates: {
      lat: 17.405044,
      lng: 78.486671
    }
  }
];

const SpeedAlerts = () => {
  const { toast } = useToast();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState(true);
  const [selectedTab, setSelectedTab] = useState("settings");
  const [alertThreshold, setAlertThreshold] = useState(5);
  const [selectedLimit, setSelectedLimit] = useState<SpeedLimit | null>(null);
  
  const handleToggleAlerts = (checked: boolean) => {
    setAlertsEnabled(checked);
    toast({
      title: checked ? "Speed Alerts Enabled" : "Speed Alerts Disabled",
      description: checked ? "You will now receive speed limit notifications" : "You will no longer receive speed limit notifications",
      variant: checked ? "default" : "destructive",
    });
  };
  
  const handleToggleVoiceAlerts = (checked: boolean) => {
    setVoiceAlertsEnabled(checked);
    toast({
      description: checked ? "Voice alerts enabled" : "Voice alerts disabled",
      variant: "default",
    });
  };
  
  const viewLimitDetails = (limit: SpeedLimit) => {
    setSelectedLimit(limit);
    setSelectedTab("limits");
  };
  
  const closeDetails = () => {
    setSelectedLimit(null);
  };
  
  const getRoadTypeColor = (roadType: string) => {
    switch (roadType) {
      case "Highway":
        return "bg-blue-100 text-blue-800";
      case "City Road":
        return "bg-green-100 text-green-800";
      case "Expressway":
        return "bg-purple-100 text-purple-800";
      case "Residential":
        return "bg-yellow-100 text-yellow-800";
      case "Special Zone":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/traffic-safety" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Speed Alerts</h1>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Alert Settings</TabsTrigger>
            <TabsTrigger value="limits">Speed Limits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Alert Configuration</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Enable Speed Alerts</div>
                    <div className="text-sm text-gray-500">Receive notifications when exceeding speed limits</div>
                  </div>
                  <Switch checked={alertsEnabled} onCheckedChange={handleToggleAlerts} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Voice Alerts</div>
                    <div className="text-sm text-gray-500">Get spoken alerts when exceeding limits</div>
                  </div>
                  <Switch checked={voiceAlertsEnabled} onCheckedChange={handleToggleVoiceAlerts} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Alert Threshold</span>
                    <span className="text-titeh-primary">{alertThreshold} km/h over limit</span>
                  </div>
                  <Slider 
                    value={[alertThreshold]} 
                    min={0} 
                    max={20} 
                    step={1} 
                    onValueChange={(value) => setAlertThreshold(value[0])}
                    disabled={!alertsEnabled}
                  />
                  <p className="text-sm text-gray-500">
                    Alert when exceeding the speed limit by {alertThreshold} km/h or more
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Alert Schedule</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Day Time Alerts (6 AM - 10 PM)</div>
                    <div className="text-sm text-gray-500">Regular alert volume during day time</div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Night Time Alerts (10 PM - 6 AM)</div>
                    <div className="text-sm text-gray-500">Quieter alerts during night hours</div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-blue-50">
              <div className="flex items-start">
                <AlertCircle className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">How Speed Alerts Work</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Speed alerts use your device's GPS and official speed limit data to notify you when exceeding limits.
                    Keep in mind that GPS accuracy may vary, and alerts are provided as guidance only. The driver is
                    always responsible for maintaining legal and safe speeds.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="limits" className="space-y-4 mt-4">
            {selectedLimit ? (
              <Card className="p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedLimit.area}</h2>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getRoadTypeColor(selectedLimit.roadType)}`}>
                      {selectedLimit.roadType}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={closeDetails}>
                    Go Back
                  </Button>
                </div>
                
                <div className="mt-4 p-6 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-titeh-primary">{selectedLimit.maxSpeed}</div>
                    <div className="text-gray-500">km/h</div>
                  </div>
                </div>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-titeh-primary mr-3 mt-1" />
                    <div>
                      <p className="font-medium">Description</p>
                      <p className="text-sm text-gray-600">{selectedLimit.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-titeh-primary mr-3 mt-1" />
                    <div>
                      <p className="font-medium">Penalties</p>
                      <p className="text-sm text-gray-600">
                        Exceeding by 1-10 km/h: ₹1,000<br />
                        Exceeding by 11-20 km/h: ₹2,000<br />
                        Exceeding by >20 km/h: ₹3,000 and potential license suspension
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button size="sm" onClick={() => window.open(`https://maps.google.com/?q=${selectedLimit.coordinates.lat},${selectedLimit.coordinates.lng}`, '_blank')}>
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {speedLimits.map((limit) => (
                  <Card key={limit.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{limit.area}</h3>
                      </div>
                      <div className="bg-red-100 px-3 py-2 rounded-md text-xl font-bold text-red-800">
                        {limit.maxSpeed}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoadTypeColor(limit.roadType)}`}>
                        {limit.roadType}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-sm text-gray-600 truncate max-w-[70%]">
                        {limit.description}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewLimitDetails(limit)}
                      >
                        Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            <Card className="p-4 bg-yellow-50">
              <div className="flex items-start">
                <AlertTriangle className="text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Speed Limit Guidelines</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Always adhere to posted speed limits on the road, which may differ from the general limits shown here.
                    Speed limits may be temporarily reduced in construction zones, during bad weather, or for special events.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SpeedAlerts;
