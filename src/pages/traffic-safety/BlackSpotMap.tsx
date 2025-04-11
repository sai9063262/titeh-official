
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Map, MapPin, Info, ArrowLeft, Loader2, AlertCircle, Filter, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BlackSpot {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  incidents: number;
  severity: "high" | "medium" | "low";
  description: string;
  recommendations: string;
  lastUpdated: string;
}

const BlackSpotMap = () => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("map");
  const [selectedSpot, setSelectedSpot] = useState<BlackSpot | null>(null);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  
  // Sample black spot data
  const blackSpots: BlackSpot[] = [
    {
      id: 1,
      name: "Mehdipatnam Junction",
      location: { lat: 17.393, lng: 78.449 },
      incidents: 47,
      severity: "high",
      description: "High traffic junction with frequent accidents due to signal violations and speeding.",
      recommendations: "Speed bumps installed, traffic police deployed during peak hours. Avoid during rush hours.",
      lastUpdated: "2025-03-23"
    },
    {
      id: 2,
      name: "Panjagutta Flyover",
      location: { lat: 17.426, lng: 78.453 },
      incidents: 31,
      severity: "medium",
      description: "Accidents occur due to merging traffic and speeding vehicles coming down the flyover.",
      recommendations: "Caution signs installed, speed limit enforced. Maintain safe distance when descending.",
      lastUpdated: "2025-04-01"
    },
    {
      id: 3,
      name: "LB Nagar Junction",
      location: { lat: 17.350, lng: 78.547 },
      incidents: 52,
      severity: "high",
      description: "High volume of pedestrians crossing alongside heavy vehicle traffic causing frequent collisions.",
      recommendations: "Pedestrian overpass constructed, designated crossing times. Use the overpass when crossing.",
      lastUpdated: "2025-03-28"
    },
    {
      id: 4,
      name: "Madhapur IT Corridor",
      location: { lat: 17.447, lng: 78.382 },
      incidents: 29,
      severity: "medium",
      description: "Congested during office hours with many side-entry points causing accidents.",
      recommendations: "Entry/exit consolidation planned, traffic management. Follow lane discipline strictly.",
      lastUpdated: "2025-04-05"
    },
    {
      id: 5,
      name: "Aramghar Junction",
      location: { lat: 17.329, lng: 78.495 },
      incidents: 38,
      severity: "high",
      description: "Multiple roads converging with poor signage and lighting causing nighttime accidents.",
      recommendations: "New lighting installed, junction redesign in progress. Avoid at night when possible.",
      lastUpdated: "2025-03-30"
    },
    {
      id: 6,
      name: "Uppal X Roads",
      location: { lat: 17.398, lng: 78.559 },
      incidents: 22,
      severity: "low",
      description: "Poor lane markings and signal timing causing confusion and minor collisions.",
      recommendations: "Road markings refreshed, signal timing adjusted. Follow traffic police directions.",
      lastUpdated: "2025-04-08"
    }
  ];
  
  // Filter black spots based on severity
  const filteredSpots = filter === "all" ? blackSpots : blackSpots.filter(spot => spot.severity === filter);

  // Request location access
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            setLocationGranted(true);
            
            toast({
              title: "Location Access Granted",
              description: "Using your location to show nearby black spots",
            });
            
            // Simulate loading the map
            setTimeout(() => {
              setIsLoading(false);
            }, 1500);
          },
          (error) => {
            console.error("Error getting location:", error);
            toast({
              title: "Location Access Denied",
              description: "Please enable location to see nearby black spots",
              variant: "destructive",
            });
            setLocationGranted(false);
            setIsLoading(false);
          }
        );
      } else {
        toast({
          title: "Location Not Supported",
          description: "Your device doesn't support location services",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    getLocation();
  }, [toast]);
  
  // Function to open external map with coordinates
  const openSpotOnMap = (spot: BlackSpot) => {
    const mapUrl = `https://www.google.com/maps?q=${spot.location.lat},${spot.location.lng}`;
    window.open(mapUrl, '_blank');
    
    toast({
      title: "Opening External Map",
      description: `Navigating to ${spot.name}`,
    });
  };
  
  // Function to show spot details
  const showSpotDetails = (spot: BlackSpot) => {
    setSelectedSpot(spot);
    setActiveTab("details");
  };
  
  // Severity badge component
  const SeverityBadge = ({ severity }: { severity: "high" | "medium" | "low" }) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-orange-100 text-orange-800",
      low: "bg-yellow-100 text-yellow-800"
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[severity]}`}>
        {severity === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
        {severity.charAt(0).toUpperCase() + severity.slice(1)} Risk
      </span>
    );
  };

  return (
    <Layout>
      <div className="relative">
        <div className="flex items-center mb-4">
          <Link to="/traffic-safety" className="mr-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-titeh-primary">Black Spot Map</h1>
            <p className="text-gray-500">View and avoid accident-prone areas in the city</p>
          </div>
        </div>

        {/* Location Permission Banner */}
        {!locationGranted && !isLoading && (
          <div className="mb-4 p-3 rounded-lg flex items-center gap-3 bg-yellow-50 border border-yellow-200">
            <div className="p-2 rounded-full bg-yellow-100">
              <MapPin className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">Location Access Required</h3>
              <p className="text-xs text-gray-600">
                Enable location services to see nearby black spots
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (navigator.geolocation) {
                  setIsLoading(true);
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                      });
                      setLocationGranted(true);
                      setIsLoading(false);
                      toast({
                        title: "Location Access Granted",
                        description: "Using your location to show nearby black spots",
                      });
                    },
                    (error) => {
                      setIsLoading(false);
                      toast({
                        title: "Location Access Denied",
                        description: "Please enable location in your browser settings",
                        variant: "destructive",
                      });
                    }
                  );
                }
              }}
              className="ml-auto"
            >
              Enable Location
            </Button>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter by Severity: {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("all")}>All Spots</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("high")}>High Risk</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("medium")}>Medium Risk</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("low")}>Low Risk</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <span className="text-sm text-gray-500">
            Showing {filteredSpots.length} accident-prone areas
          </span>
        </div>
        
        <Tabs 
          defaultValue="map" 
          className="mb-6"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2" disabled={!selectedSpot}>
              <Info className="h-4 w-4" />
              Spot Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="map">
            {isLoading ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <Loader2 className="h-12 w-12 text-titeh-primary animate-spin mb-4" />
                  <p className="text-gray-600">Loading black spot map...</p>
                  <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the data</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Interactive Map</span>
                      {locationGranted && (
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          Center on My Location
                        </Button>
                      )}
                    </CardTitle>
                    <CardDescription>
                      This map shows all reported accident-prone areas in Hyderabad
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative bg-gray-100 h-96 flex items-center justify-center overflow-hidden">
                      {/* Interactive map placeholder - would be Google Maps or similar in real implementation */}
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=Hyderabad,India&zoom=11&size=800x400&key=YOUR_API_KEY")' }}>
                        {/* Map overlay */}
                      </div>
                      
                      {/* Placeholder for map - real implementation would integrate Google Maps or similar */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 flex flex-col items-center justify-center text-white text-center p-8">
                        <Map className="h-12 w-12 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Black Spot Map View</h3>
                        <p>In a real implementation, this would display an interactive map with all the black spots marked.</p>
                        <p className="mt-2 text-sm opacity-80">Click on any spot in the list below to see it on an external map.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="md:col-span-2">
                  <h3 className="font-medium text-lg mb-3">Accident-Prone Areas</h3>
                  <div className="space-y-3">
                    {filteredSpots.length === 0 ? (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">No black spots match your current filter</p>
                          <Button variant="outline" size="sm" className="mt-3" onClick={() => setFilter("all")}>
                            Show All Spots
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredSpots.map((spot) => (
                        <Card key={spot.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row">
                              <div className="flex-1 p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-medium">{spot.name}</h3>
                                  <SeverityBadge severity={spot.severity} />
                                </div>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{spot.description}</p>
                                <div className="flex items-center justify-between mt-3">
                                  <div className="text-xs text-red-600 font-medium">
                                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                                    {spot.incidents} incidents reported
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Updated: {new Date(spot.lastUpdated).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-row sm:flex-col border-t sm:border-t-0 sm:border-l border-gray-100">
                                <Button 
                                  variant="ghost" 
                                  className="flex-1 rounded-none py-3 h-auto"
                                  onClick={() => showSpotDetails(spot)}
                                >
                                  <Info className="h-4 w-4 mr-2" />
                                  Details
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  className="flex-1 rounded-none py-3 h-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => openSpotOnMap(spot)}
                                >
                                  <Map className="h-4 w-4 mr-2" />
                                  Navigate
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details">
            {selectedSpot && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedSpot.name}</CardTitle>
                      <CardDescription className="mt-1">Detailed information about this black spot</CardDescription>
                    </div>
                    <SeverityBadge severity={selectedSpot.severity} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-100 h-48 relative rounded-md overflow-hidden">
                    {/* Image placeholder - real implementation would show actual location image */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 flex items-center justify-center">
                      <Button 
                        onClick={() => openSpotOnMap(selectedSpot)}
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        <Map className="h-4 w-4 mr-2" />
                        View on Map
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <p className="text-sm font-medium text-gray-500">Total Incidents</p>
                      <p className="text-2xl font-bold text-red-600">{selectedSpot.incidents}</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <p className="text-sm font-medium text-gray-500">Risk Level</p>
                      <p className={`text-2xl font-bold ${
                        selectedSpot.severity === "high" ? "text-red-600" : 
                        selectedSpot.severity === "medium" ? "text-orange-600" : "text-yellow-600"
                      }`}>
                        {selectedSpot.severity.charAt(0).toUpperCase() + selectedSpot.severity.slice(1)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1">{selectedSpot.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Safety Recommendations</h3>
                      <div className="mt-1 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">{selectedSpot.recommendations}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Nearby Emergency Services</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Police Station</span>
                          <span className="text-blue-600">0.8 km away</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Hospital</span>
                          <span className="text-blue-600">1.2 km away</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Fire Station</span>
                          <span className="text-blue-600">2.5 km away</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setActiveTab("map")} className="flex-1">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Map
                    </Button>
                    <Button className="flex-1 bg-titeh-primary" onClick={() => openSpotOnMap(selectedSpot)}>
                      <Map className="h-4 w-4 mr-2" />
                      Navigate to Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Understanding Black Spots</CardTitle>
            <CardDescription>
              What makes a location dangerous and how to stay safe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">What is a Black Spot?</h3>
                  <p className="text-sm text-gray-600">
                    A black spot is a location on the road network that has a high concentration of traffic accidents.
                    These areas are identified based on accident data collected over time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Info className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">How to Use This Information</h3>
                  <p className="text-sm text-gray-600">
                    Be extra cautious when approaching these areas. Follow recommended speed limits,
                    maintain safe distance, and be alert for potential hazards.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Contributing to Safety</h3>
                  <p className="text-sm text-gray-600">
                    You can help make these areas safer by reporting incidents, following traffic rules,
                    and sharing this information with other drivers.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BlackSpotMap;
