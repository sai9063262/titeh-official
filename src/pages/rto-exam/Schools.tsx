
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, MapPin, Phone, Star, Clock, School, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Import sample data from the utility
import { drivingSchools } from "@/utils/ExamData";

const Schools = () => {
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const [locationPermission, setLocationPermission] = useState<string>("prompt");
  const { toast } = useToast();
  const [filteredSchools, setFilteredSchools] = useState(drivingSchools);
  
  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setLocationPermission(status.state);
        
        if (status.state === 'granted') {
          requestLocation();
        }
      } catch (error) {
        console.error("Error checking permission:", error);
      }
    };
    
    checkLocationPermission();
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
          toast({
            title: "Found nearby driving schools",
            description: "Showing driving schools in Warangal area.",
          });
          // We're already filtering for Warangal schools in our data,
          // but you would use the position coordinates to filter in a real app
          setFilteredSchools(drivingSchools.filter(school => 
            school.address.toLowerCase().includes('warangal')
          ));
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location access error",
            description: "Showing all available driving schools.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleLocationRequest = () => {
    requestLocation();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Driving Schools</h1>
        </div>

        {locationPermission !== "granted" && (
          <Card className="p-4 mb-6 border-blue-200 bg-blue-50">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="font-medium mb-1">Location Access</h3>
                <p className="text-sm text-gray-600 mb-2">Enable location access to see nearby driving schools in Warangal.</p>
                <Button 
                  onClick={handleLocationRequest}
                  size="sm"
                  className="bg-titeh-primary hover:bg-blue-600"
                >
                  Show Nearby Schools
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-6">
          {filteredSchools.map((school) => (
            <Card key={school.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{school.name}</h2>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{school.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{school.rating}</span>
                    <span className="text-gray-500 text-sm">/5</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-medium mb-2">Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {school.services?.map((service, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Fees</h3>
                    <div className="space-y-1 text-sm">
                      <p>Two-wheeler: {school.fees?.twoWheeler}</p>
                      <p>Four-wheeler: {school.fees?.fourWheeler}</p>
                      {school.fees?.commercial && (
                        <p>Commercial: {school.fees.commercial}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-titeh-primary mr-1" />
                    <span>{school.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-titeh-primary mr-1" />
                    <span>{school.timings}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Button className="bg-titeh-primary hover:bg-blue-600">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  {school.website && (
                    <Button variant="outline">
                      <Info className="h-4 w-4 mr-1" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mt-6">
          <div className="flex items-start">
            <School className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Why Choose a Certified Driving School?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Learning to drive with a certified instructor ensures you develop safe driving habits and increases your chances of passing the RTO driving test. All schools listed here are RTO-approved.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-2">
                <li>Professional instruction on road safety</li>
                <li>Structured curriculum approved by RTO</li>
                <li>Practice on diverse road conditions</li>
                <li>Documentation assistance for license application</li>
                <li>Modern training vehicles with safety features</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Schools;
