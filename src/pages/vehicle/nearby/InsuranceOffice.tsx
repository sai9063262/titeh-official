
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, FileText, Phone, Clock, Info, FileCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InsuranceOffice {
  id: string;
  name: string;
  distance: number;
  address: string;
  latitude: number;
  longitude: number;
  insuranceTypes: string[];
  openingHours: string;
  contactNumber?: string;
  website?: string;
  services: string[];
  rating: number;
}

const InsuranceOffice = () => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyOffices, setNearbyOffices] = useState<InsuranceOffice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [radius, setRadius] = useState<string>("5");
  const [insuranceType, setInsuranceType] = useState<string>("all");
  const [mapApiKey, setMapApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);

  useEffect(() => {
    // Check if we have a stored API key
    const storedKey = localStorage.getItem("mapbox_api_key");
    if (storedKey) {
      setMapApiKey(storedKey);
      setShowApiKeyInput(false);
    }
  }, []);

  const handleApiKeySubmit = () => {
    if (mapApiKey.trim()) {
      localStorage.setItem("mapbox_api_key", mapApiKey);
      setShowApiKeyInput(false);
      toast({
        title: "API Key Saved",
        description: "Your Mapbox API key has been saved for this session.",
      });
    } else {
      toast({
        title: "API Key Required",
        description: "Please enter a valid Mapbox API key to use location services.",
        variant: "destructive",
      });
    }
  };
  
  const getCurrentLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyInsuranceOffices(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location Error",
            description: "Could not access your location. Please check your device settings.",
            variant: "destructive",
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  const fetchNearbyInsuranceOffices = (latitude: number, longitude: number) => {
    // In a real app, this would be an API call to a service like Mapbox or Google Places
    setTimeout(() => {
      // Mock data for demonstration
      const mockOffices: InsuranceOffice[] = [
        {
          id: "ins1",
          name: "ICICI Lombard",
          distance: 1.8,
          address: "Warangal Main Road, Hanamkonda",
          latitude: latitude + 0.01,
          longitude: longitude - 0.01,
          insuranceTypes: ["Car", "Bike", "Health", "Travel"],
          openingHours: "10:00 AM - 6:00 PM (Mon-Sat)",
          contactNumber: "040-23456789",
          website: "https://www.icicilombard.com",
          services: ["Claim Processing", "Policy Renewal", "New Policy Issuance"],
          rating: 4.2
        },
        {
          id: "ins2",
          name: "Bajaj Allianz",
          distance: 2.3,
          address: "Station Road, Warangal",
          latitude: latitude - 0.015,
          longitude: longitude + 0.018,
          insuranceTypes: ["Car", "Bike", "Commercial Vehicles"],
          openingHours: "9:30 AM - 5:30 PM (Mon-Sat)",
          contactNumber: "040-23498765",
          website: "https://www.bajajallianz.com",
          services: ["Claim Processing", "Policy Renewal", "Vehicle Inspection"],
          rating: 3.9
        },
        {
          id: "ins3",
          name: "LIC Branch Office",
          distance: 3.5,
          address: "Collector Office Road, Warangal",
          latitude: latitude + 0.02,
          longitude: longitude + 0.02,
          insuranceTypes: ["Life Insurance", "Term Insurance", "Pension Plans"],
          openingHours: "10:00 AM - 5:00 PM (Mon-Fri)",
          contactNumber: "040-23452345",
          website: "https://www.licindia.in",
          services: ["Life Insurance", "Premium Payment", "Claim Processing"],
          rating: 4.5
        }
      ];
      
      // Filter by radius and insurance type if needed
      const radiusValue = parseFloat(radius);
      const filteredOffices = mockOffices.filter(office => {
        const withinRadius = office.distance <= radiusValue;
        const hasInsuranceType = insuranceType === "all" || 
                                office.insuranceTypes.some(type => 
                                  type.toLowerCase().includes(insuranceType.toLowerCase()));
        
        return withinRadius && hasInsuranceType;
      });
      
      setNearbyOffices(filteredOffices);
      setLoading(false);
      
      if (filteredOffices.length > 0) {
        toast({
          title: "Insurance Offices Found",
          description: `Found ${filteredOffices.length} insurance offices near you.`,
        });
      } else {
        toast({
          title: "No Offices Found",
          description: "No insurance offices found matching your criteria.",
        });
      }
    }, 1500);
  };
  
  const getDirections = (office: InsuranceOffice) => {
    if (!userLocation) return;
    
    // Open in Google Maps
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${office.latitude},${office.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Nearby Insurance Offices</h1>
        
        {showApiKeyInput ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Enter Mapbox API Key</CardTitle>
              <CardDescription>
                To use location services, you need to provide a Mapbox API key.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mapApiKey">Mapbox API Key</Label>
                  <Input
                    id="mapApiKey"
                    value={mapApiKey}
                    onChange={(e) => setMapApiKey(e.target.value)}
                    placeholder="Enter your Mapbox API key"
                  />
                  <p className="text-xs text-gray-500">
                    You can get an API key from{" "}
                    <a 
                      href="https://account.mapbox.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-titeh-primary hover:underline"
                    >
                      Mapbox
                    </a>
                  </p>
                </div>
                <Button onClick={handleApiKeySubmit} className="bg-titeh-primary">
                  Save API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-titeh-primary" />
                  Find Insurance Offices Near Me
                </CardTitle>
                <CardDescription>
                  Locate nearby insurance offices based on your current location
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="radius">Search Radius (km)</Label>
                    <Select value={radius} onValueChange={setRadius}>
                      <SelectTrigger id="radius">
                        <SelectValue placeholder="Select radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 km</SelectItem>
                        <SelectItem value="5">5 km</SelectItem>
                        <SelectItem value="10">10 km</SelectItem>
                        <SelectItem value="20">20 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="insuranceType">Insurance Type</Label>
                    <Select value={insuranceType} onValueChange={setInsuranceType}>
                      <SelectTrigger id="insuranceType">
                        <SelectValue placeholder="Select insurance type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="car">Car Insurance</SelectItem>
                        <SelectItem value="bike">Bike Insurance</SelectItem>
                        <SelectItem value="health">Health Insurance</SelectItem>
                        <SelectItem value="life">Life Insurance</SelectItem>
                        <SelectItem value="commercial">Commercial Vehicle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={getCurrentLocation} 
                      className="bg-titeh-primary w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Navigation className="mr-2 h-4 w-4" />
                          Find Nearby Offices
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {userLocation && nearbyOffices.length > 0 ? (
              <div className="space-y-4">
                {nearbyOffices.map((office) => (
                  <Card key={office.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="md:col-span-2 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{office.name}</h3>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {office.address}
                              </p>
                              <p className="text-sm text-titeh-primary mt-1">
                                <b>{office.distance}</b> km away
                              </p>
                            </div>
                            <div className="bg-titeh-primary text-white text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center">
                              {office.rating}
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm font-medium">Insurance Types:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {office.insuranceTypes.map((type, index) => (
                                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{office.openingHours}</span>
                            </div>
                            {office.contactNumber && (
                              <div className="flex items-center text-sm">
                                <Phone className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{office.contactNumber}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm font-medium">Services:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {office.services.map((service, index) => (
                                <span key={index} className="text-xs bg-blue-50 text-titeh-primary px-2 py-1 rounded">
                                  <FileCheck className="h-3 w-3 inline-block mr-1" />
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-100 p-6 flex flex-col justify-between">
                          <div className="text-center mb-4">
                            <div className="text-2xl font-bold text-titeh-primary">
                              {office.distance} km
                            </div>
                            <p className="text-sm text-gray-500">from your location</p>
                          </div>
                          
                          <Button 
                            onClick={() => getDirections(office)} 
                            className="bg-titeh-primary w-full mb-2"
                          >
                            <Navigation className="mr-2 h-4 w-4" />
                            Get Directions
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full mb-2"
                            onClick={() => {
                              window.open(`tel:${office.contactNumber}`, '_self');
                            }}
                            disabled={!office.contactNumber}
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Call Office
                          </Button>
                          
                          {office.website && (
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                window.open(office.website, '_blank');
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Visit Website
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userLocation && nearbyOffices.length === 0 ? (
              <Card className="p-6 text-center">
                <Info className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium">No Insurance Offices Found</h3>
                <p className="text-gray-500">Try increasing the search radius or changing the insurance type.</p>
              </Card>
            ) : null}
            
            <div className="text-xs text-gray-500 mt-6">
              <p>
                Note: Office hours may vary on holidays. It is recommended to call before visiting.
                <br />
                This feature uses location services to find nearby insurance offices.
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default InsuranceOffice;
