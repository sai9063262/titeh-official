
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  MapPin, 
  Navigation, 
  Compass, 
  Phone, 
  Clock, 
  Info, 
  ArrowRight,
  LocateFixed,
  AlertCircle,
  Car
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EvacuationRoute {
  id: string;
  name: string;
  city: string;
  startPoint: string;
  endPoint: string;
  estimatedTime: string;
  distance: string;
  directions: string[];
  emergencyContacts: { name: string; phone: string }[];
  lastUpdated: string;
  riskLevel: "low" | "medium" | "high";
  isActive: boolean;
}

const EmergencyEvacuation = () => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const [locationPermission, setLocationPermission] = useState<string>("prompt");
  const [selectedCity, setSelectedCity] = useState<string>("hyderabad");
  const [isLoading, setIsLoading] = useState(false);
  const [currentDisaster, setCurrentDisaster] = useState<string | null>("None currently active");
  
  // Sample evacuation routes data
  const evacuationRoutes: EvacuationRoute[] = [
    {
      id: "hyd-route-1",
      name: "Hyderabad Central Evacuation Route",
      city: "hyderabad",
      startPoint: "Secunderabad Railway Station",
      endPoint: "Shamshabad International Airport",
      estimatedTime: "45 minutes",
      distance: "32 km",
      directions: [
        "Start heading south on S.D. Road towards Paradise Circle",
        "Take Begumpet flyover and continue straight",
        "Take right onto Punjagutta main road",
        "Continue straight towards Mehdipatnam",
        "Take the PV Narasimha Rao Expressway",
        "Follow signs to Shamshabad Airport"
      ],
      emergencyContacts: [
        { name: "Hyderabad Traffic Police", phone: "040-27852482" },
        { name: "Emergency Response", phone: "108" }
      ],
      lastUpdated: "2025-04-10",
      riskLevel: "low",
      isActive: true
    },
    {
      id: "hyd-route-2",
      name: "Hyderabad Eastern Corridor",
      city: "hyderabad",
      startPoint: "Hitech City",
      endPoint: "Outer Ring Road Exit",
      estimatedTime: "35 minutes",
      distance: "25 km",
      directions: [
        "Head east on Hitech City Main Road",
        "Take the Mindspace Junction flyover",
        "Continue towards Gachibowli",
        "Take the right onto Outer Ring Road",
        "Continue north on ORR for 15 km",
        "Exit at Ghatkesar exit point"
      ],
      emergencyContacts: [
        { name: "Cyberabad Traffic Police", phone: "040-23111111" },
        { name: "Disaster Management", phone: "1077" }
      ],
      lastUpdated: "2025-04-02",
      riskLevel: "medium",
      isActive: true
    },
    {
      id: "war-route-1",
      name: "Warangal Central Evacuation Route",
      city: "warangal",
      startPoint: "Warangal Bus Station",
      endPoint: "NH-163 Highway Checkpoint",
      estimatedTime: "30 minutes",
      distance: "18 km",
      directions: [
        "Head west from Warangal Bus Station",
        "Take the Hanamkonda Main Road",
        "Continue straight towards Kazipet Junction",
        "Take right onto NH-163",
        "Continue for 8 km until checkpoint"
      ],
      emergencyContacts: [
        { name: "Warangal Traffic Police", phone: "0870-2466651" },
        { name: "Emergency Services", phone: "108" }
      ],
      lastUpdated: "2025-03-22",
      riskLevel: "low",
      isActive: true
    },
    {
      id: "war-route-2",
      name: "Warangal Southern Escape Route",
      city: "warangal",
      startPoint: "Warangal Fort",
      endPoint: "Ethurnagaram Forest Border",
      estimatedTime: "50 minutes",
      distance: "35 km",
      directions: [
        "Start at Warangal Fort main entrance",
        "Head south on Fort Road",
        "Take the bypass towards Hunter Road",
        "Continue on Southern Ring Road",
        "Take NH-365 towards Ethurnagaram",
        "Follow signs to forest checkpoint"
      ],
      emergencyContacts: [
        { name: "Forest Department", phone: "0870-2570678" },
        { name: "District Emergency Control", phone: "1077" }
      ],
      lastUpdated: "2025-04-05",
      riskLevel: "medium",
      isActive: true
    },
    {
      id: "khm-route-1",
      name: "Khammam Emergency Route",
      city: "khammam",
      startPoint: "Khammam Bus Stand",
      endPoint: "Andhra Pradesh Border",
      estimatedTime: "40 minutes",
      distance: "28 km",
      directions: [
        "Start at Khammam Bus Stand",
        "Take Khammam Main Road heading east",
        "Continue through Bypass Road",
        "Take NH-365 towards Vijayawada",
        "Continue until Andhra Pradesh border checkpoint"
      ],
      emergencyContacts: [
        { name: "Khammam Traffic Police", phone: "08742-258800" },
        { name: "Emergency Control Room", phone: "1077" }
      ],
      lastUpdated: "2025-03-15",
      riskLevel: "high",
      isActive: true
    }
  ];
  
  // Request location permission
  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setLocationPermission(status.state);
        
        status.onchange = () => {
          setLocationPermission(status.state);
        };
        
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
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
          
          // Use location to determine closest city (simplified)
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Simplified logic to determine city
          // In a real app, you would use reverse geocoding or a more sophisticated method
          if (lat > 16.9 && lat < 17.6 && lon > 78.2 && lon < 78.6) {
            setSelectedCity("hyderabad");
          } else if (lat > 17.9 && lat < 18.1 && lon > 79.5 && lon < 79.7) {
            setSelectedCity("warangal");
          } else if (lat > 17.2 && lat < 17.3 && lon > 80.1 && lon < 80.2) {
            setSelectedCity("khammam");
          }
          
          toast({
            title: "Location detected",
            description: "Showing evacuation routes near you.",
          });
          
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location error",
            description: "Unable to determine your location. Showing default evacuation routes.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      );
    }
  };
  
  const handleLocationRequest = () => {
    if (locationPermission === "prompt") {
      requestLocation();
    } else if (locationPermission === "denied") {
      toast({
        title: "Location access required",
        description: "Please enable location access in your browser settings for optimal evacuation guidance.",
        variant: "destructive",
      });
    }
  };
  
  const filteredRoutes = evacuationRoutes.filter(route => 
    route.city === selectedCity && route.isActive
  );
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-titeh-primary">Emergency Evacuation Routes</h1>
          
          <Button 
            variant={userLocation ? "default" : "outline"} 
            onClick={handleLocationRequest}
            disabled={isLoading || locationPermission === "granted"}
            className={userLocation ? "bg-titeh-primary" : ""}
          >
            {isLoading ? (
              <>
                <LocateFixed className="mr-2 h-4 w-4 animate-pulse" />
                Locating...
              </>
            ) : (
              <>
                <LocateFixed className="mr-2 h-4 w-4" />
                {userLocation ? "Location Active" : "Use My Location"}
              </>
            )}
          </Button>
        </div>
        
        {locationPermission === "prompt" && !userLocation && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Location Access</h3>
                  <p className="text-sm text-gray-600">
                    Enable location access to see evacuation routes nearest to you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-medium">Current Disaster Status</h3>
                <p className="text-sm text-gray-600">
                  {currentDisaster === "None currently active" 
                    ? "No active disasters or emergencies at this time. These routes are for preparedness only." 
                    : `Active emergency: ${currentDisaster}`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue={selectedCity} onValueChange={setSelectedCity}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="hyderabad">Hyderabad</TabsTrigger>
            <TabsTrigger value="warangal">Warangal</TabsTrigger>
            <TabsTrigger value="khammam">Khammam</TabsTrigger>
          </TabsList>
          
          {["hyderabad", "warangal", "khammam"].map((city) => (
            <TabsContent key={city} value={city} className="mt-0">
              <div className="space-y-4">
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map((route) => (
                    <Card key={route.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="flex items-center text-lg">
                            <Navigation className="mr-2 h-4 w-4 text-titeh-primary" />
                            {route.name}
                          </CardTitle>
                          <div className={`px-2 py-1 rounded text-xs font-medium 
                            ${route.riskLevel === 'low' ? 'bg-green-100 text-green-800' : 
                              route.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' : 
                              'bg-red-100 text-red-800'}`
                          }>
                            {route.riskLevel === 'low' ? 'Low Risk' : 
                             route.riskLevel === 'medium' ? 'Medium Risk' : 
                             'High Risk'}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="flex items-center mb-2">
                              <MapPin className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-sm font-medium">Start: {route.startPoint}</span>
                            </div>
                            <div className="flex items-center mb-2">
                              <MapPin className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-sm font-medium">End: {route.endPoint}</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center mb-2">
                              <Clock className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-sm">Estimated Time: {route.estimatedTime}</span>
                            </div>
                            <div className="flex items-center mb-2">
                              <Car className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-sm">Distance: {route.distance}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-sm mb-2">Step-by-Step Directions:</h4>
                          <ol className="space-y-1 pl-5 list-decimal text-sm">
                            {route.directions.map((direction, index) => (
                              <li key={index}>{direction}</li>
                            ))}
                          </ol>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-sm mb-2">Emergency Contacts:</h4>
                          <div className="space-y-1">
                            {route.emergencyContacts.map((contact, index) => (
                              <div key={index} className="flex items-center">
                                <Phone className="h-3 w-3 text-titeh-primary mr-1" />
                                <span className="text-sm">{contact.name}: </span>
                                <a 
                                  href={`tel:${contact.phone}`} 
                                  className="text-sm text-titeh-primary ml-1"
                                >
                                  {contact.phone}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 flex justify-between items-center">
                          <span>Last updated: {route.lastUpdated}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-titeh-primary"
                          >
                            <Compass className="h-3 w-3 mr-1" />
                            Navigate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="py-8">
                    <CardContent className="flex flex-col items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                      <p className="text-center">No active evacuation routes found for {city}.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5 text-titeh-primary" />
              Emergency Evacuation Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <p>
                Emergency evacuation routes are pre-defined paths designed to efficiently move people
                away from disasters or hazards. Follow these guidelines during an evacuation:
              </p>
              
              <ul className="space-y-2">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-titeh-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Stay calm and follow instructions</strong> from authorities and emergency personnel.
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-titeh-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Have an emergency kit</strong> ready with essentials like water, food, medications, 
                    and important documents.
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-titeh-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Know multiple routes</strong> - your primary evacuation route may be inaccessible.
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-titeh-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Help others</strong> who may need assistance, such as elderly, children, or disabled individuals.
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-titeh-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Keep your gas tank at least half full</strong> at all times during emergency situations.
                  </span>
                </li>
              </ul>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  Important Notice
                </h4>
                <p className="mt-2 text-red-700">
                  These evacuation routes are subject to change during actual emergencies based on 
                  the nature and location of the disaster. Always follow real-time instructions from 
                  emergency services and authorities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EmergencyEvacuation;
