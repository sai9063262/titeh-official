
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Fuel, Phone, Clock, Info, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FuelStation {
  id: string;
  name: string;
  distance: number;
  address: string;
  latitude: number;
  longitude: number;
  fuelTypes: string[];
  currentPrices: {
    petrol: number;
    diesel: number;
    cng?: number;
    premium?: number;
  };
  openingHours: string;
  contactNumber?: string;
  amenities: string[];
  rating: number;
}

const FuelStation = () => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyStations, setNearbyStations] = useState<FuelStation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [radius, setRadius] = useState<string>("5");
  const [fuelType, setFuelType] = useState<string>("all");
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
          fetchNearbyFuelStations(latitude, longitude);
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
  
  const fetchNearbyFuelStations = (latitude: number, longitude: number) => {
    // In a real app, this would be an API call to a service like Mapbox or Google Places
    setTimeout(() => {
      // Mock data for demonstration
      const mockStations: FuelStation[] = [
        {
          id: "fs1",
          name: "Indian Oil Pump",
          distance: 1.2,
          address: "Hanamkonda Main Road, Near Bus Station, Warangal",
          latitude: latitude + 0.01,
          longitude: longitude - 0.01,
          fuelTypes: ["Petrol", "Diesel", "CNG"],
          currentPrices: {
            petrol: 101.94,
            diesel: 88.76,
            cng: 83.15
          },
          openingHours: "24 hours",
          contactNumber: "040-23456789",
          amenities: ["ATM", "Store", "Air Filling"],
          rating: 4.2
        },
        {
          id: "fs2",
          name: "HP Petrol Pump",
          distance: 2.5,
          address: "Kazipet Road, Warangal",
          latitude: latitude - 0.015,
          longitude: longitude + 0.018,
          fuelTypes: ["Petrol", "Diesel", "Premium Petrol"],
          currentPrices: {
            petrol: 101.89,
            diesel: 88.69,
            premium: 107.25
          },
          openingHours: "6:00 AM - 10:00 PM",
          contactNumber: "040-23498765",
          amenities: ["Store", "Car Wash", "Restrooms"],
          rating: 3.9
        },
        {
          id: "fs3",
          name: "Bharat Petroleum",
          distance: 3.1,
          address: "NH 163, Warangal",
          latitude: latitude + 0.02,
          longitude: longitude + 0.02,
          fuelTypes: ["Petrol", "Diesel", "Premium Diesel"],
          currentPrices: {
            petrol: 101.92,
            diesel: 88.72,
            premium: 95.40
          },
          openingHours: "24 hours",
          contactNumber: "040-23452345",
          amenities: ["Food Court", "ATM", "EV Charging"],
          rating: 4.5
        }
      ];
      
      // Filter by radius and fuel type if needed
      const radiusValue = parseFloat(radius);
      const filteredStations = mockStations.filter(station => {
        const withinRadius = station.distance <= radiusValue;
        const hasFuelType = fuelType === "all" || 
                           (fuelType === "cng" && station.fuelTypes.includes("CNG")) ||
                           (fuelType === "premium" && (station.fuelTypes.includes("Premium Petrol") || station.fuelTypes.includes("Premium Diesel")));
        
        return withinRadius && hasFuelType;
      });
      
      setNearbyStations(filteredStations);
      setLoading(false);
      
      if (filteredStations.length > 0) {
        toast({
          title: "Fuel Stations Found",
          description: `Found ${filteredStations.length} fuel stations near you.`,
        });
      } else {
        toast({
          title: "No Stations Found",
          description: "No fuel stations found matching your criteria.",
        });
      }
    }, 1500);
  };
  
  const getDirections = (station: FuelStation) => {
    if (!userLocation) return;
    
    // Open in Google Maps
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${station.latitude},${station.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Nearby Fuel Stations</h1>
        
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
                  Find Fuel Stations Near Me
                </CardTitle>
                <CardDescription>
                  Locate nearby fuel stations based on your current location
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
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select value={fuelType} onValueChange={setFuelType}>
                      <SelectTrigger id="fuelType">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                        <SelectItem value="premium">Premium Fuels</SelectItem>
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
                          Find Nearby Stations
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {userLocation && nearbyStations.length > 0 ? (
              <div className="space-y-4">
                {nearbyStations.map((station) => (
                  <Card key={station.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="md:col-span-2 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{station.name}</h3>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {station.address}
                              </p>
                              <p className="text-sm text-titeh-primary mt-1">
                                <b>{station.distance}</b> km away
                              </p>
                            </div>
                            <div className="bg-titeh-primary text-white text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center">
                              {station.rating}
                            </div>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="flex items-center text-sm">
                              <Fuel className="h-4 w-4 mr-1 text-titeh-primary" />
                              <span>Petrol: ₹{station.currentPrices.petrol}/L</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Fuel className="h-4 w-4 mr-1 text-titeh-primary" />
                              <span>Diesel: ₹{station.currentPrices.diesel}/L</span>
                            </div>
                            {station.currentPrices.cng && (
                              <div className="flex items-center text-sm">
                                <Fuel className="h-4 w-4 mr-1 text-titeh-primary" />
                                <span>CNG: ₹{station.currentPrices.cng}/kg</span>
                              </div>
                            )}
                            {station.currentPrices.premium && (
                              <div className="flex items-center text-sm">
                                <Fuel className="h-4 w-4 mr-1 text-titeh-primary" />
                                <span>Premium: ₹{station.currentPrices.premium}/L</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{station.openingHours}</span>
                            </div>
                            {station.contactNumber && (
                              <div className="flex items-center text-sm">
                                <Phone className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{station.contactNumber}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm font-medium">Amenities:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {station.amenities.map((amenity, index) => (
                                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-100 p-6 flex flex-col justify-between">
                          <div className="text-center mb-4">
                            <div className="text-2xl font-bold text-titeh-primary">
                              {station.distance} km
                            </div>
                            <p className="text-sm text-gray-500">from your location</p>
                          </div>
                          
                          <Button 
                            onClick={() => getDirections(station)} 
                            className="bg-titeh-primary w-full mb-2"
                          >
                            <Navigation className="mr-2 h-4 w-4" />
                            Get Directions
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              window.open(`tel:${station.contactNumber}`, '_self');
                            }}
                            disabled={!station.contactNumber}
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Call Station
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userLocation && nearbyStations.length === 0 ? (
              <Card className="p-6 text-center">
                <Info className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium">No Fuel Stations Found</h3>
                <p className="text-gray-500">Try increasing the search radius or changing the fuel type.</p>
              </Card>
            ) : null}
            
            <div className="text-xs text-gray-500 mt-6">
              <p>
                Note: Fuel prices are indicative and may vary. Please confirm prices at the station.
                <br />
                This feature uses location services to find nearby fuel stations.
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FuelStation;
