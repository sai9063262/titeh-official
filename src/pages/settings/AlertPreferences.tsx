
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Bell, Clock, Car, Shield, FileText, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AlertPreferences = () => {
  const [notifications, setNotifications] = useState({
    puc: true,
    license: true,
    challan: true,
    roadSafety: false,
    service: true,
    traffic: false
  });
  
  const [frequency, setFrequency] = useState("daily");
  const { toast } = useToast();
  
  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Notification Preference Updated",
      description: `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${!notifications[key] ? 'enabled' : 'disabled'}`,
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/settings" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Alert Preferences</h1>
        </div>
        
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-titeh-primary" />
                <Label htmlFor="puc">PUC Expiry Reminders</Label>
              </div>
              <Switch 
                id="puc" 
                checked={notifications.puc} 
                onCheckedChange={() => toggleNotification('puc')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-titeh-primary" />
                <Label htmlFor="license">License Expiry Alerts</Label>
              </div>
              <Switch 
                id="license" 
                checked={notifications.license} 
                onCheckedChange={() => toggleNotification('license')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-titeh-primary" />
                <Label htmlFor="challan">Challan Payment Reminders</Label>
              </div>
              <Switch 
                id="challan" 
                checked={notifications.challan} 
                onCheckedChange={() => toggleNotification('challan')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-titeh-primary" />
                <Label htmlFor="roadSafety">Road Safety Alerts</Label>
              </div>
              <Switch 
                id="roadSafety" 
                checked={notifications.roadSafety} 
                onCheckedChange={() => toggleNotification('roadSafety')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-titeh-primary" />
                <Label htmlFor="service">Vehicle Service Reminders</Label>
              </div>
              <Switch 
                id="service" 
                checked={notifications.service} 
                onCheckedChange={() => toggleNotification('service')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-titeh-primary" />
                <Label htmlFor="traffic">Traffic Updates</Label>
              </div>
              <Switch 
                id="traffic" 
                checked={notifications.traffic} 
                onCheckedChange={() => toggleNotification('traffic')} 
              />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Alert Frequency</h2>
          
          <RadioGroup 
            value={frequency} 
            onValueChange={(value) => {
              setFrequency(value);
              toast({
                title: "Alert Frequency Updated",
                description: `Alerts will now be sent ${value}`,
                variant: "default",
              });
            }}
          >
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="realtime" id="realtime" />
              <Label htmlFor="realtime">Real-time (Immediate alerts)</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Daily (Digest at 9:00 AM)</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Weekly (Monday at 9:00 AM)</Label>
            </div>
          </RadioGroup>
        </Card>
        
        <Card className="p-4 bg-blue-50">
          <h2 className="font-semibold mb-2">About Alerts</h2>
          <p className="text-sm text-gray-600">You will receive alerts via the app notification. Important alerts like license expiry will also be sent to your registered email address if provided.</p>
        </Card>
      </div>
    </Layout>
  );
};

export default AlertPreferences;
