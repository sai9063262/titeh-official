
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle, AlertCircle, Info, MapPinned, Search, ThermometerSnowflake, ThermometerSun, CloudRain, Shield, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Simulated accident data 
const blackSpots = [
  { 
    id: 1, 
    name: "Hitech City Flyover", 
    coordinates: "17.4472, 78.3762", 
    incidents: 23,
    severity: "high",
    type: "collision",
    description: "Multiple vehicle collisions reported during peak traffic hours. Narrow lanes and sharp turns contribute to incidents."
  },
  { 
    id: 2, 
    name: "Mehdipatnam Junction", 
    coordinates: "17.3939, 78.4388", 
    incidents: 18,
    severity: "high",
    type: "traffic",
    description: "Heavy congestion area with poor traffic management. Multiple minor accidents reported due to illegal crossings."
  },
  { 
    id: 3, 
    name: "Secunderabad Station Road", 
    coordinates: "17.4345, 78.5022", 
    incidents: 15,
    severity: "medium",
    type: "pedestrian",
    description: "Pedestrian-related incidents due to lack of proper crossings and heavy vehicle movement."
  },
  { 
    id: 4, 
    name: "Gachibowli-Kothaguda Junction", 
    coordinates: "17.4584, 78.3618", 
    incidents: 12,
    severity: "medium",
    type: "collision", 
    description: "Frequent collisions due to signal jumping and lane cutting. Most incidents during evening rush hour."
  },
  { 
    id: 5, 
    name: "Punjagutta Flyover", 
    coordinates: "17.4259, 78.4499", 
    incidents: 9,
    severity: "medium",
    type: "traffic", 
    description: "Traffic congestion leading to rear-end collisions. Poor road markings contribute to the problem."
  },
  { 
    id: 6, 
    name: "Habsiguda X Roads", 
    coordinates: "17.4186, 78.5427", 
    incidents: 8,
    severity: "low",
    type: "pedestrian", 
    description: "Pedestrian injuries reported due to insufficient crossing time at signals."
  },
  { 
    id: 7, 
    name: "Madhapur-Jubilee Hills Road", 
    coordinates: "17.4378, 78.4000", 
    incidents: 14,
    severity: "high",
    type: "collision", 
    description: "Multiple accident zone due to narrow roads and heavy traffic flow. Construction activities worsen visibility."
  },
  { 
    id: 8, 
    name: "Ameerpet Metro Station Area", 
    coordinates: "17.4374, 78.4482", 
    incidents: 11,
    severity: "medium",
    type: "pedestrian", 
    description: "Pedestrian incidents near metro station exits due to improper crossings and vendor encroachments."
  }
];

// Simulation weather alerts
const weatherAlerts = [
  {
    id: 1,
    area: "Hitech City, Madhapur",
    condition: "Heavy Rain",
    severity: "high",
    message: "Heavy rainfall expected to cause waterlogging and reduced visibility. Avoid if possible.",
    time: "Updated 45 minutes ago",
    icon: CloudRain
  },
  {
    id: 2,
    area: "Secunderabad, Paradise",
    condition: "Extreme Heat",
    severity: "medium",
    message: "High temperatures may cause road surface issues. Keep hydrated while driving.",
    time: "Updated 2 hours ago",
    icon: ThermometerSun
  },
  {
    id: 3,
    area: "Outer Ring Road, Gachibowli",
    condition: "Fog / Low Visibility",
    severity: "high",
    message: "Heavy fog reducing visibility below 100m. Use fog lights and reduce speed.",
    time: "Updated 30 minutes ago",
    icon: ThermometerSnowflake
  }
];

const BlackSpotMap = () => {
  const { toast } = useToast();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState("map");
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<typeof blackSpots[0] | null>(null);
  
  const checkLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          setLocationPermission(true);
          loadMap();
        } else if (result.state === "prompt") {
          requestLocation();
        } else {
          setLocationPermission(false);
          toast({
            title: "Location Access Denied",
            description: "Please enable location permissions to view the map accurately",
            variant: "destructive",
          });
        }
      });
    } else {
      toast({
        title: "Location Not Supported",
        description: "Your device doesn't support geolocation",
        variant: "destructive",
      });
    }
  };
  
  const requestLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Requesting Location",
        description: "Please allow access to your location",
      });
      
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermission(true);
          loadMap();
          toast({
            title: "Location Access Granted",
            description: "Map will now show your current location",
          });
        },
        () => {
          setLocationPermission(false);
          toast({
            title: "Location Access Denied",
            description: "Map functionality will be limited",
            variant: "destructive",
          });
        }
      );
    }
  };
  
  const loadMap = () => {
    // Simulate map loading
    setTimeout(() => {
      setMapLoaded(true);
    }, 1500);
  };
  
  const openSpotDetails = (spot: typeof blackSpots[0]) => {
    setSelectedSpot(spot);
    setIsDetailOpen(true);
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold text-titeh-primary mb-2">Black Spot Map</h1>
        <p className="text-gray-500 mb-6">Identify and monitor high-risk traffic areas</p>
        
        <div className="mb-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="weather">Weather Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Traffic Black Spot Map</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={locationPermission === null ? checkLocationPermission : requestLocation}
                      className="flex items-center gap-1"
                    >
                      <MapPin className="h-4 w-4" />
                      {locationPermission === true ? 'Refresh Location' : 'Get My Location'}
                    </Button>
                  </div>
                  <CardDescription>
                    Areas with high frequency of traffic accidents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                    {/* Map placeholder - in a real application, this would be an interactive map */}
                    <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=17.4356,78.3832&zoom=12&size=600x400&maptype=roadmap&style=feature:road|color:0x333333&style=feature:landscape|color:0xf5f5f5&style=feature:poi|visibility:off&key=YOUR_API_KEY')] bg-cover">
                      {/* Black spot markers */}
                      {blackSpots.map((spot, index) => (
                        <div 
                          key={spot.id}
                          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                          style={{ 
                            top: `${20 + (index * 40) % 350}px`, 
                            left: `${50 + (index * 70) % 520}px`
                          }}
                          onClick={() => openSpotDetails(spot)}
                        >
                          <div className={`
                            p-1 rounded-full animate-pulse
                            ${spot.severity === 'high' ? 'bg-red-500' : 
                              spot.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}
                          `}>
                            <div className="bg-white rounded-full p-1">
                              <AlertTriangle className={`
                                h-4 w-4
                                ${spot.severity === 'high' ? 'text-red-500' : 
                                  spot.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'}
                              `} />
                            </div>
                          </div>
                          <div className={`
                            absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap
                            ${spot.severity === 'high' ? 'bg-red-500' : 
                              spot.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}
                          `}>
                            {spot.incidents} incidents
                          </div>
                        </div>
                      ))}
                      
                      {/* Current location marker - would only show if location permission is granted */}
                      {locationPermission && (
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                          <div className="p-1 rounded-full animate-pulse bg-blue-500">
                            <div className="bg-white rounded-full p-1">
                              <MapPin className="h-4 w-4 text-blue-500" />
                            </div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 rounded bg-blue-500 text-white text-xs font-medium whitespace-nowrap">
                            Your Location
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Map controls overlay */}
                    <div className="absolute top-3 right-3 bg-white rounded-md shadow-md p-2 space-y-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MapPinned className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Map legend */}
                    <div className="absolute bottom-3 left-3 bg-white rounded-md shadow-md p-3">
                      <h4 className="text-sm font-medium mb-2">Legend</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <span className="text-xs">High Risk (15+ incidents)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                          <span className="text-xs">Medium Risk (8-14 incidents)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <span className="text-xs">Low Risk (1-7 incidents)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-xs">Your Location</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status overlay */}
                    {!locationPermission && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-lg max-w-md text-center">
                          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold mb-1">Location Access Required</h3>
                          <p className="text-gray-600 mb-4">
                            To show your position on the map and provide accurate safety alerts,
                            we need access to your location.
                          </p>
                          <Button onClick={requestLocation} className="bg-titeh-primary">
                            Enable Location
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Nearby Black Spots</CardTitle>
                  <CardDescription>
                    High-risk areas within 5km of your route
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {locationPermission ? (
                    <div className="space-y-3">
                      {blackSpots.slice(0, 3).map((spot) => (
                        <div key={spot.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                          <div className={`
                            p-2 rounded-full
                            ${spot.severity === 'high' ? 'bg-red-100' : 
                              spot.severity === 'medium' ? 'bg-orange-100' : 'bg-yellow-100'}
                          `}>
                            <AlertTriangle className={`
                              h-5 w-5
                              ${spot.severity === 'high' ? 'text-red-600' : 
                                spot.severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'}
                            `} />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{spot.name}</h3>
                              <Badge className={`ml-2 
                                ${spot.severity === 'high' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                                  spot.severity === 'medium' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' : 
                                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}
                              `}>
                                {spot.incidents} incidents
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{spot.description}</p>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-titeh-primary text-xs"
                              onClick={() => openSpotDetails(spot)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Enable location access to view nearby black spots</p>
                      <Button 
                        variant="outline" 
                        className="mt-3" 
                        onClick={requestLocation}
                      >
                        Enable Location
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="list">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Black Spot Database</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Filter
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Sort
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Comprehensive list of all identified black spots
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blackSpots.map((spot) => (
                      <Card key={spot.id} className="overflow-hidden">
                        <div className={`h-1 w-full 
                          ${spot.severity === 'high' ? 'bg-red-500' : 
                            spot.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}
                        `}></div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{spot.name}</h3>
                            <Badge className={`
                              ${spot.severity === 'high' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                                spot.severity === 'medium' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' : 
                                'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}
                            `}>
                              {spot.incidents} incidents
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Coordinates:</span>
                              <p>{spot.coordinates}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <p className="capitalize">{spot.type}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{spot.description}</p>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-titeh-primary"
                            onClick={() => openSpotDetails(spot)}
                          >
                            View Detailed Analysis
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="weather">
              <Card>
                <CardHeader>
                  <CardTitle>Weather & Road Conditions</CardTitle>
                  <CardDescription>
                    Current weather alerts that may affect driving conditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weatherAlerts.map((alert) => (
                      <Card key={alert.id} className="overflow-hidden">
                        <div className={`h-1 w-full 
                          ${alert.severity === 'high' ? 'bg-red-500' : 
                            alert.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}
                        `}></div>
                        <div className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`
                              p-3 rounded-full
                              ${alert.severity === 'high' ? 'bg-red-100' : 
                                alert.severity === 'medium' ? 'bg-orange-100' : 'bg-yellow-100'}
                            `}>
                              <alert.icon className={`
                                h-6 w-6
                                ${alert.severity === 'high' ? 'text-red-600' : 
                                  alert.severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'}
                              `} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium">{alert.condition}</h3>
                                <Badge className={`
                                  ${alert.severity === 'high' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                                    alert.severity === 'medium' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' : 
                                    'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}
                                `}>
                                  {alert.severity === 'high' ? 'High Risk' : 
                                    alert.severity === 'medium' ? 'Medium Risk' : 'Low Risk'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{alert.area}</p>
                              <p className="text-sm mt-2">{alert.message}</p>
                              <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-blue-800">Real-time Updates</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Weather conditions are updated every 15 minutes. Location-based weather alerts are available when you enable location access.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Safety Tips */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-titeh-primary" />
              Safety Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Approach with Caution</h3>
                    <p className="text-sm text-gray-600">Reduce speed when approaching marked black spots. Be extra vigilant for unexpected traffic behavior.</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <CloudRain className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Weather Adjustments</h3>
                    <p className="text-sm text-gray-600">During rain or fog, increase following distance and reduce speed further in black spot areas.</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <MapPinned className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Plan Alternative Routes</h3>
                    <p className="text-sm text-gray-600">Consider using alternative routes to avoid high-risk areas, especially during peak traffic hours.</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-titeh-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Stay Informed</h3>
                    <p className="text-sm text-gray-600">Check this map before travel to be aware of black spots along your planned route.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Black spot detail dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Black Spot Details</DialogTitle>
              <DialogDescription>
                Detailed analysis and safety recommendations
              </DialogDescription>
            </DialogHeader>
            
            {selectedSpot && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{selectedSpot.name}</h2>
                  <Badge className={`
                    ${selectedSpot.severity === 'high' ? 'bg-red-100 text-red-800' : 
                      selectedSpot.severity === 'medium' ? 'bg-orange-100 text-orange-800' : 
                      'bg-yellow-100 text-yellow-800'}
                  `}>
                    {selectedSpot.severity === 'high' ? 'High Risk' : 
                      selectedSpot.severity === 'medium' ? 'Medium Risk' : 'Low Risk'}
                  </Badge>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Coordinates</span>
                      <span>{selectedSpot.coordinates}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Total Incidents</span>
                      <span>{selectedSpot.incidents}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Incident Type</span>
                      <span className="capitalize">{selectedSpot.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Last Updated</span>
                      <span>April 10, 2025</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-700">{selectedSpot.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Incident Breakdown</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-1/3 text-sm">Major Accidents</div>
                        <div className="w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 rounded-full" 
                            style={{ width: `${Math.floor(selectedSpot.incidents * 0.3)}0%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/3 text-sm">Minor Incidents</div>
                        <div className="w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full" 
                            style={{ width: `${Math.floor(selectedSpot.incidents * 0.5)}0%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/3 text-sm">Near Misses</div>
                        <div className="w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${Math.floor(selectedSpot.incidents * 0.2)}0%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Safety Recommendations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Reduce speed to 30km/h when passing through this area</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Maintain extra distance from vehicles ahead</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Be cautious of pedestrians crossing at unmarked points</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
              <Button className="bg-titeh-primary">
                Get Directions
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default BlackSpotMap;
