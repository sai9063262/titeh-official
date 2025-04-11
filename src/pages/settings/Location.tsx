
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, MapPin, Locate, Globe } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Location = () => {
  const [locationMode, setLocationMode] = useState<"gps" | "manual">("gps");
  const { toast } = useToast();
  
  const changeLocationMode = (mode: "gps" | "manual") => {
    setLocationMode(mode);
    toast({
      title: "Location Mode Updated",
      description: `Location mode set to ${mode === "gps" ? "GPS" : "Manual"}`,
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
          <h1 className="text-2xl font-bold text-titeh-primary">Location Settings</h1>
        </div>
        
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Location Mode</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              variant={locationMode === "gps" ? "default" : "outline"} 
              className={locationMode === "gps" ? "bg-titeh-primary hover:bg-blue-600" : ""}
              onClick={() => changeLocationMode("gps")}
            >
              <Locate className="mr-2 h-4 w-4" />
              GPS Location
            </Button>
            
            <Button 
              variant={locationMode === "manual" ? "default" : "outline"}
              className={locationMode === "manual" ? "bg-titeh-primary hover:bg-blue-600" : ""}
              onClick={() => changeLocationMode("manual")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Manual Location
            </Button>
          </div>
          
          {locationMode === "gps" ? (
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="flex items-center mb-3">
                <Locate className="text-titeh-primary mr-2" />
                <h3 className="font-medium">GPS Mode</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">When GPS mode is enabled, the app will automatically detect your current location for services like nearby RTO offices, traffic reports, and other location-based features.</p>
              <div className="flex justify-end">
                <Button size="sm" variant="outline">
                  Test GPS
                </Button>
              </div>
            </div>
          ) : (
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="flex items-center mb-3">
                <MapPin className="text-titeh-primary mr-2" />
                <h3 className="font-medium">Manual Mode</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">In manual mode, you can specify your preferred location for all app services. This is useful when you want to check services in a different area.</p>
              <div className="flex flex-col space-y-2">
                <Button size="sm">
                  Set Default Location
                </Button>
              </div>
            </div>
          )}
        </Card>
        
        <Card className="p-6 mb-6">
          <div className="flex items-center mb-3">
            <Globe className="text-titeh-primary mr-2" />
            <h2 className="text-lg font-semibold">Default District</h2>
          </div>
          
          <p className="text-gray-600 mb-4">Select your default district for local RTO services, traffic updates, and more.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Adilabad"].map((district) => (
              <Button 
                key={district}
                variant="outline"
                className="justify-start"
                onClick={() => toast({
                  title: "District Updated",
                  description: `Default district set to ${district}`,
                })}
              >
                {district}
              </Button>
            ))}
          </div>
        </Card>
        
        <Card className="p-4 bg-blue-50">
          <h2 className="font-semibold mb-2">Location Permission</h2>
          <p className="text-sm text-gray-600">Location data is only used when the app is in use and is never shared with third parties without your explicit consent.</p>
        </Card>
      </div>
    </Layout>
  );
};

export default Location;
