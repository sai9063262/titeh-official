
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, RefreshCw, Clock, CheckCircle, Database, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const DataSync = () => {
  const [syncMode, setSyncMode] = useState("automatic");
  const [syncInterval, setSyncInterval] = useState("15min");
  const [lastSync, setLastSync] = useState("Never");
  const { toast } = useToast();
  
  const handleManualSync = () => {
    toast({
      title: "Sync Started",
      description: "Syncing your data with the server...",
      variant: "default",
    });
    
    // Simulate sync process
    setTimeout(() => {
      setLastSync(new Date().toLocaleString());
      toast({
        title: "Sync Complete",
        description: "Your data has been successfully synchronized",
        variant: "default",
      });
    }, 2000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/settings" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Data Sync</h1>
        </div>
        
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-semibold">Sync Mode</h2>
            <div className="flex items-center space-x-2">
              <div className={`text-xs px-2 py-1 rounded-full ${lastSync === "Never" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                {lastSync === "Never" ? "Never synced" : `Last: ${lastSync}`}
              </div>
            </div>
          </div>
          
          <RadioGroup 
            value={syncMode} 
            onValueChange={(value) => {
              setSyncMode(value);
              toast({
                title: "Sync Mode Updated",
                description: `Sync mode set to ${value}`,
                variant: "default",
              });
            }}
            className="mb-6"
          >
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="automatic" id="automatic" />
              <Label htmlFor="automatic" className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 text-titeh-primary" />
                Automatic Sync
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <Label htmlFor="manual" className="flex items-center">
                <Database className="h-4 w-4 mr-2 text-titeh-primary" />
                Manual Sync
              </Label>
            </div>
          </RadioGroup>
          
          {syncMode === "automatic" && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Sync Interval</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant={syncInterval === "5min" ? "default" : "outline"}
                  className={syncInterval === "5min" ? "bg-titeh-primary hover:bg-blue-600" : ""}
                  onClick={() => {
                    setSyncInterval("5min");
                    toast({
                      title: "Interval Updated",
                      description: "Data will sync every 5 minutes",
                    });
                  }}
                >
                  5 Minutes
                </Button>
                <Button 
                  variant={syncInterval === "15min" ? "default" : "outline"}
                  className={syncInterval === "15min" ? "bg-titeh-primary hover:bg-blue-600" : ""}
                  onClick={() => {
                    setSyncInterval("15min");
                    toast({
                      title: "Interval Updated",
                      description: "Data will sync every 15 minutes",
                    });
                  }}
                >
                  15 Minutes
                </Button>
                <Button 
                  variant={syncInterval === "30min" ? "default" : "outline"}
                  className={syncInterval === "30min" ? "bg-titeh-primary hover:bg-blue-600" : ""}
                  onClick={() => {
                    setSyncInterval("30min");
                    toast({
                      title: "Interval Updated",
                      description: "Data will sync every 30 minutes",
                    });
                  }}
                >
                  30 Minutes
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              onClick={handleManualSync}
              className="bg-titeh-primary hover:bg-blue-600"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Now
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <div className="flex items-center mb-4">
            <Shield className="text-titeh-primary mr-2" />
            <h2 className="text-lg font-semibold">Sync Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="wifi-only">Sync on Wi-Fi only</Label>
              <Switch 
                id="wifi-only" 
                onCheckedChange={(checked) => {
                  toast({
                    title: "Wi-Fi Sync Setting",
                    description: `Sync on Wi-Fi only: ${checked ? "On" : "Off"}`,
                  });
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="background-sync">Background sync</Label>
              <Switch 
                id="background-sync"
                defaultChecked
                onCheckedChange={(checked) => {
                  toast({
                    title: "Background Sync Setting",
                    description: `Background sync: ${checked ? "On" : "Off"}`,
                  });
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="charging-only">Sync only when charging</Label>
              <Switch 
                id="charging-only"
                onCheckedChange={(checked) => {
                  toast({
                    title: "Charging Sync Setting",
                    description: `Sync only when charging: ${checked ? "On" : "Off"}`,
                  });
                }}
              />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-blue-50">
          <h2 className="font-semibold mb-2">Data Usage</h2>
          <p className="text-sm text-gray-600">Syncing ensures your vehicle information, license details, and preferences are up to date across devices. A typical sync uses approximately 50-100 KB of data.</p>
        </Card>
      </div>
    </Layout>
  );
};

export default DataSync;
