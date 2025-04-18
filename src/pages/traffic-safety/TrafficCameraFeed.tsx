
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  AlertTriangle,
  MapPin,
  Play,
  Pause,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Clock,
  Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TELANGANA_DISTRICTS } from "@/types/safety";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CameraLocation {
  id: string;
  name: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  status: "online" | "offline" | "maintenance";
  type: "traffic" | "speed" | "anpr" | "red-light";
  last_maintenance: string;
}

const TrafficCameraFeed = () => {
  const { toast } = useToast();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Hyderabad");
  const [selectedCamera, setSelectedCamera] = useState<CameraLocation | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cameraLocations, setCameraLocations] = useState<CameraLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCameraType, setSelectedCameraType] = useState<string>("all");

  // Generate sample camera locations for all Telangana districts
  useEffect(() => {
    const generateCameraLocations = () => {
      const cameraTypes = ["traffic", "speed", "anpr", "red-light"];
      const statusTypes = ["online", "offline", "maintenance"];
      
      const locations: CameraLocation[] = [];
      
      TELANGANA_DISTRICTS.forEach(district => {
        // Generate 3-7 cameras per district
        const numCameras = Math.floor(Math.random() * 5) + 3;
        
        for (let i = 0; i < numCameras; i++) {
          const id = `cam-${district.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`;
          const type = cameraTypes[Math.floor(Math.random() * cameraTypes.length)] as "traffic" | "speed" | "anpr" | "red-light";
          const status = statusTypes[Math.floor(Math.random() * statusTypes.length)] as "online" | "offline" | "maintenance";
          
          // Generate fake coordinates near the district (just for demo)
          const baseLat = 17.4 + (Math.random() * 2 - 1);
          const baseLng = 78.5 + (Math.random() * 2 - 1);
          
          locations.push({
            id,
            name: `${district} ${type.toUpperCase()} Camera ${i + 1}`,
            district,
            city: district,
            lat: baseLat,
            lng: baseLng,
            status,
            type,
            last_maintenance: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          });
        }
      });
      
      return locations;
    };
    
    setTimeout(() => {
      setCameraLocations(generateCameraLocations());
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredCameras = cameraLocations.filter(camera => {
    const matchesDistrict = selectedDistrict === "all" || camera.district === selectedDistrict;
    const matchesSearch = camera.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         camera.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedCameraType === "all" || camera.type === selectedCameraType;
    
    return matchesDistrict && matchesSearch && matchesType;
  });

  const pageSize = 8;
  const totalPages = Math.ceil(filteredCameras.length / pageSize);
  const paginatedCameras = filteredCameras.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCameraSelect = (camera: CameraLocation) => {
    setSelectedCamera(camera);
    
    if (camera.status === "offline") {
      toast({
        title: "Camera Offline",
        description: "This camera is currently offline. Showing last recorded footage.",
        variant: "destructive",
      });
    } else if (camera.status === "maintenance") {
      toast({
        title: "Camera Under Maintenance",
        description: "This camera is currently under maintenance. Showing test signal.",
        variant: "destructive",
      });
    }
  };

  const getCameraStatusBadge = (status: "online" | "offline" | "maintenance") => {
    switch (status) {
      case "online":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Online</span>;
      case "offline":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Offline</span>;
      case "maintenance":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Maintenance</span>;
    }
  };

  const getCameraTypeBadge = (type: "traffic" | "speed" | "anpr" | "red-light") => {
    switch (type) {
      case "traffic":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Traffic</span>;
      case "speed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Speed</span>;
      case "anpr":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">ANPR</span>;
      case "red-light":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Red Light</span>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-titeh-primary">Traffic Camera Feed</h1>
            <p className="text-gray-500">Monitor real-time traffic conditions across Telangana</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast({
                title: "Export Feature",
                description: "Video export feature will be available soon",
              })}
            >
              Export
            </Button>
            <Button 
              className="bg-titeh-primary" 
              size="sm"
              onClick={() => toast({
                title: "Snapshot Saved",
                description: "Camera snapshot has been saved to your gallery",
              })}
            >
              Take Snapshot
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {selectedCamera ? (
                  <div className="relative">
                    <div className="relative w-full h-[400px] bg-gray-900">
                      <div className="absolute top-0 left-0 p-3 z-10 flex gap-2">
                        {getCameraStatusBadge(selectedCamera.status)}
                        {getCameraTypeBadge(selectedCamera.type)}
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{selectedCamera.name}</h3>
                            <p className="text-sm opacity-80">{selectedCamera.district}, {selectedCamera.city}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-white hover:bg-black/30"
                              onClick={() => setIsPaused(!isPaused)}
                            >
                              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-white hover:bg-black/30"
                              onClick={() => setIsFullscreen(!isFullscreen)}
                            >
                              <RotateCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {selectedCamera.status === "online" ? (
                        <img
                          src={`https://source.unsplash.com/random/800x450/?traffic,road,${selectedCamera.district}`}
                          alt={selectedCamera.name}
                          className="w-full h-full object-cover"
                        />
                      ) : selectedCamera.status === "maintenance" ? (
                        <div className="flex items-center justify-center h-full bg-yellow-900">
                          <div className="text-center text-yellow-500">
                            <AlertTriangle className="h-16 w-16 mx-auto mb-2" />
                            <p className="text-lg font-medium">Camera Under Maintenance</p>
                            <p className="text-sm">Last maintenance: {selectedCamera.last_maintenance}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-800">
                          <div className="text-center text-gray-400">
                            <AlertTriangle className="h-16 w-16 mx-auto mb-2" />
                            <p className="text-lg font-medium">Camera Offline</p>
                            <p className="text-sm">Connection lost</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{selectedCamera.district}, {selectedCamera.city}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Camera ID</p>
                          <p className="font-medium">{selectedCamera.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="font-medium">{selectedCamera.type.toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Maintenance</p>
                          <p className="font-medium">{selectedCamera.last_maintenance}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">No Camera Selected</h3>
                      <p className="text-gray-500">Select a camera from the list to view live feed</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Traffic Analysis</CardTitle>
                <CardDescription>
                  Real-time traffic statistics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCamera ? (
                  <div>
                    <Tabs defaultValue="statistics">
                      <TabsList className="mb-4">
                        <TabsTrigger value="statistics">Statistics</TabsTrigger>
                        <TabsTrigger value="violations">Violations</TabsTrigger>
                        <TabsTrigger value="activity">Activity Log</TabsTrigger>
                      </TabsList>
                      <TabsContent value="statistics">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-500">Vehicle Count</p>
                            <p className="text-2xl font-semibold">{Math.floor(Math.random() * 500) + 100}</p>
                            <p className="text-xs text-blue-600">Last hour</p>
                          </div>
                          <div className="p-4 bg-amber-50 rounded-lg">
                            <p className="text-sm text-amber-500">Avg. Speed</p>
                            <p className="text-2xl font-semibold">{Math.floor(Math.random() * 30) + 20} km/h</p>
                            <p className="text-xs text-amber-600">Current</p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-500">Traffic Flow</p>
                            <p className="text-2xl font-semibold">{["Low", "Medium", "High"][Math.floor(Math.random() * 3)]}</p>
                            <p className="text-xs text-green-600">Current status</p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="violations">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <div>
                              <p className="font-medium">Over-speeding</p>
                              <p className="text-sm text-gray-500">Vehicle: TS 07 FX 3891</p>
                            </div>
                            <p className="text-sm">10:45 AM</p>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                            <div>
                              <p className="font-medium">Red Light Violation</p>
                              <p className="text-sm text-gray-500">Vehicle: TS 11 UW 7732</p>
                            </div>
                            <p className="text-sm">09:32 AM</p>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <div>
                              <p className="font-medium">Wrong Lane</p>
                              <p className="text-sm text-gray-500">Vehicle: TS 09 KL 1265</p>
                            </div>
                            <p className="text-sm">08:17 AM</p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="activity">
                        <div className="space-y-2">
                          <div className="text-sm p-2 border-b">
                            <p className="text-gray-600">11:23 AM</p>
                            <p>Camera signal strength: Excellent</p>
                          </div>
                          <div className="text-sm p-2 border-b">
                            <p className="text-gray-600">10:55 AM</p>
                            <p>Traffic density increased to Medium</p>
                          </div>
                          <div className="text-sm p-2 border-b">
                            <p className="text-gray-600">10:30 AM</p>
                            <p>Video quality: 1080p HD</p>
                          </div>
                          <div className="text-sm p-2 border-b">
                            <p className="text-gray-600">10:00 AM</p>
                            <p>System check completed</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <p>Select a camera to view traffic analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Camera Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {TELANGANA_DISTRICTS.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedCameraType} onValueChange={setSelectedCameraType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Camera type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="traffic">Traffic</SelectItem>
                      <SelectItem value="speed">Speed</SelectItem>
                      <SelectItem value="anpr">ANPR</SelectItem>
                      <SelectItem value="red-light">Red Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search cameras..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="border rounded-md h-[480px] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-titeh-primary"></div>
                    </div>
                  ) : paginatedCameras.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                        <p>No cameras found</p>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {paginatedCameras.map((camera) => (
                        <div 
                          key={camera.id}
                          className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedCamera?.id === camera.id ? 'bg-blue-50 border-l-4 border-titeh-primary' : ''
                          }`}
                          onClick={() => handleCameraSelect(camera)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{camera.name}</h3>
                              <p className="text-sm text-gray-500 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {camera.district}, {camera.city}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {getCameraStatusBadge(camera.status)}
                              {getCameraTypeBadge(camera.type)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {!isLoading && totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <p className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Camera Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-green-500"></span>
                      <span>Online ({cameraLocations.filter(c => c.status === "online").length})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-red-500"></span>
                      <span>Offline ({cameraLocations.filter(c => c.status === "offline").length})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                      <span>Maintenance ({cameraLocations.filter(c => c.status === "maintenance").length})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-gray-500"></span>
                      <span>Total ({cameraLocations.length})</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-1">Coverage Information</h3>
                    <p className="text-sm text-blue-700">
                      Traffic cameras are operational 24/7 across all major junctions and highways in Telangana.
                      The system automatically detects traffic violations and congestion events.
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toast({
                      title: "Camera Map View",
                      description: "Camera map view will be available in the next update",
                    })}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedCamera?.name}</DialogTitle>
          </DialogHeader>
          <div className="h-[600px] bg-gray-900">
            {selectedCamera && (
              selectedCamera.status === "online" ? (
                <img
                  src={`https://source.unsplash.com/random/1200x800/?traffic,road,${selectedCamera.district}`}
                  alt={selectedCamera.name}
                  className="w-full h-full object-cover"
                />
              ) : selectedCamera.status === "maintenance" ? (
                <div className="flex items-center justify-center h-full bg-yellow-900">
                  <div className="text-center text-yellow-500">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-lg font-medium">Camera Under Maintenance</p>
                    <p className="text-sm">Last maintenance: {selectedCamera.last_maintenance}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-800">
                  <div className="text-center text-gray-400">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-lg font-medium">Camera Offline</p>
                    <p className="text-sm">Connection lost</p>
                  </div>
                </div>
              )
            )}
          </div>
          <div className="flex justify-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
              {isPaused ? "Play" : "Pause"}
            </Button>
            <Button 
              variant="outline"
              onClick={() => toast({
                title: "Recording Started",
                description: "Camera feed recording has been started",
              })}
            >
              <Camera className="h-4 w-4 mr-2" />
              Record
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TrafficCameraFeed;
