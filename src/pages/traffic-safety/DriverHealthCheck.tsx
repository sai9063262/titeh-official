
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, HeartPulse, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DriverHealthCheck = () => {
  const { toast } = useToast();
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          toast({
            title: "Location access granted",
            description: "We'll customize health recommendations for drivers in your area.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission(false);
          toast({
            title: "Location access denied",
            description: "We'll show general driver health information.",
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
        <h1 className="text-2xl font-bold text-titeh-primary">Driver Health Check</h1>
        <p className="text-gray-600">Assess your fitness to drive with personalized health recommendations</p>
        
        {!locationPermission && locationPermission !== null && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Location access recommended</h3>
                  <p className="text-sm text-amber-700 mb-3">
                    To customize health recommendations for your area, we recommend allowing location access.
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
            <CardTitle>Driver Health Check</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-6">
              This feature will offer a real-time health assessment based on Warangal health data, 
              updated daily with personalized recommendations to ensure you're fit to drive.
            </p>
            <div className="text-center py-8">
              <HeartPulse className="h-12 w-12 mx-auto text-titeh-primary mb-3" />
              <p className="text-lg font-medium mb-2">Coming Soon</p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                We're working with health professionals to develop a driver fitness assessment tool. 
                Check back soon for this important safety feature.
              </p>
              <Button className="mt-4 bg-titeh-primary">
                <Activity className="mr-2 h-4 w-4" />
                Get Notified When Available
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DriverHealthCheck;
