
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, CloudRain, Sun, Cloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WeatherDrivingTips = () => {
  const { toast } = useToast();
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          toast({
            title: "Location access granted",
            description: "We'll provide weather-specific driving tips for your area.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission(false);
          toast({
            title: "Location access denied",
            description: "We'll show general weather driving tips.",
            variant: "destructive",
          });
        }
      );
    } else {
      setLocationPermission(false);
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (locationPermission === null) {
      requestLocationPermission();
    }
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-titeh-primary">Weather-Adaptive Driving Tips</h1>
        <p className="text-gray-600">Get driving recommendations based on current weather conditions</p>
        
        {!locationPermission && locationPermission !== null && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Location access required</h3>
                  <p className="text-sm text-amber-700 mb-3">
                    To provide weather-specific driving tips for your area, we need your location.
                  </p>
                  <Button onClick={requestLocationPermission} className="bg-amber-600 hover:bg-amber-700">
                    Allow Location Access
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Weather-Adaptive Driving Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-6">
              This feature will provide tips based on real-time weather in Hanamkonda, such as 
              reducing speed during rain or being cautious during heavy fog. These tips are 
              updated hourly based on current weather conditions.
            </p>
            <div className="text-center py-8">
              <CloudRain className="h-12 w-12 mx-auto text-titeh-primary mb-3" />
              <p className="text-lg font-medium mb-2">Coming Soon</p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                We're integrating with weather services to bring you real-time, 
                weather-specific driving recommendations. Check back soon!
              </p>
              <Button className="mt-4 bg-titeh-primary">
                <Cloud className="mr-2 h-4 w-4" />
                Get Notified When Available
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WeatherDrivingTips;
