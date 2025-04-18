
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, ShieldCheck, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SafetyPledge = () => {
  const { toast } = useToast();
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          toast({
            title: "Location access granted",
            description: "Your safety pledge will be region-specific.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission(false);
          toast({
            title: "Location access denied",
            description: "We'll show a general safety pledge.",
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
        <h1 className="text-2xl font-bold text-titeh-primary">Safety Pledge Campaign</h1>
        <p className="text-gray-600">Commit to safer driving practices and join the community of responsible drivers</p>
        
        {!locationPermission && locationPermission !== null && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Location access recommended</h3>
                  <p className="text-sm text-amber-700 mb-3">
                    To make your safety pledge region-specific, we recommend allowing location access.
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
            <CardTitle>Safety Pledge Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-6">
              This feature will enable real-time safety pledge submissions from Warangal drivers, 
              updated daily with digital badges to recognize your commitment to road safety.
            </p>
            <div className="text-center py-8">
              <ShieldCheck className="h-12 w-12 mx-auto text-titeh-primary mb-3" />
              <p className="text-lg font-medium mb-2">Coming Soon</p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                We're creating an interactive safety pledge system with community recognition features. 
                Check back soon to make your commitment to safer roads.
              </p>
              <Button className="mt-4 bg-titeh-primary">
                <Award className="mr-2 h-4 w-4" />
                Get Notified When Available
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SafetyPledge;
