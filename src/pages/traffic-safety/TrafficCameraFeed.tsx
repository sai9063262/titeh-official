
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Search, Map, Eye, Maximize2, Download, Clock, CalendarDays, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const TrafficCameraFeed = () => {
  const { toast } = useToast();
  const [activeCamera, setActiveCamera] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Feeds Refreshed",
        description: "All camera feeds have been updated.",
      });
    }, 1500);
  };

  const handleFullscreen = (id: number) => {
    toast({
      title: "Fullscreen Mode",
      description: `Camera #${id} opened in fullscreen`,
    });
  };

  const cameraLocations = [
    { id: 1, name: "Begumpet Signal", area: "Secunderabad", status: "active" },
    { id: 2, name: "Hi-Tech City Junction", area: "Cyberabad", status: "active" },
    { id: 3, name: "Charminar", area: "Hyderabad", status: "active" },
    { id: 4, name: "Gachibowli Flyover", area: "Cyberabad", status: "inactive" },
    { id: 5, name: "Punjagutta Circle", area: "Hyderabad", status: "active" },
    { id: 6, name: "LB Nagar", area: "Hyderabad", status: "maintenance" }
  ];

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold text-titeh-primary mb-2">Traffic Camera Feed</h1>
        <p className="text-gray-500 mb-6">Monitor traffic conditions through live camera feeds</p>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Camera View */}
          <div className="w-full lg:w-8/12">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Live View: {cameraLocations[activeCamera - 1].name}</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleFullscreen(activeCamera)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {cameraLocations[activeCamera - 1].area} | Last updated: {new Date().toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 h-64 sm:h-80 md:h-96 rounded-md overflow-hidden relative">
                  <img 
                    src={`https://source.unsplash.com/random/800x600/?traffic,road,junction&${activeCamera}`} 
                    alt="Traffic Camera Feed" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm flex items-center">
                    <Camera className="h-3 w-3 mr-1" />
                    Camera #{activeCamera}
                  </div>
                  <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date().toLocaleTimeString()}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm flex items-center">
                    <Map className="h-3 w-3 mr-1" />
                    {cameraLocations[activeCamera - 1].area}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map(id => (
                    <div 
                      key={id} 
                      className={`relative cursor-pointer ${activeCamera === id ? 'ring-2 ring-titeh-primary' : ''}`}
                      onClick={() => setActiveCamera(id)}
                    >
                      <img 
                        src={`https://source.unsplash.com/random/100x80/?traffic,road,junction&${id}`} 
                        alt={`Camera ${id}`}
                        className="w-full h-16 object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center hover:bg-opacity-0 transition-all">
                        <span className="text-white text-xs font-medium">{id}</span>
                      </div>
                      {cameraLocations[id - 1].status === 'inactive' && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-xs">Offline</span>
                        </div>
                      )}
                      {cameraLocations[id - 1].status === 'maintenance' && (
                        <div className="absolute inset-0 bg-yellow-800 bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-xs">Maintenance</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Traffic Analysis</CardTitle>
                <CardDescription>
                  AI-generated traffic insights for {cameraLocations[activeCamera - 1].name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <h3 className="font-medium text-sm">Current Conditions</h3>
                    <p className="text-sm text-gray-600">
                      Moderate traffic flow with average speed of 35 km/h. No congestion detected.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="border rounded-md p-3">
                      <h3 className="font-medium text-sm">Vehicle Count</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-lg font-semibold">143</span>
                        <span className="text-sm text-gray-500">Last 15 min</span>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <h3 className="font-medium text-sm">Average Speed</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-lg font-semibold">35 km/h</span>
                        <span className="text-sm text-gray-500">Current</span>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <h3 className="font-medium text-sm">Violations</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-lg font-semibold">3</span>
                        <span className="text-sm text-gray-500">Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Sidebar */}
          <div className="w-full lg:w-4/12">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Camera Locations</CardTitle>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Map className="h-4 w-4" />
                    Map View
                  </Button>
                </div>
                <CardDescription>Total: {cameraLocations.length} cameras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search cameras by location..."
                    className="w-full pl-8 py-2 border rounded-md"
                  />
                </div>
                
                <Tabs defaultValue="all">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="hyderabad">Hyderabad</TabsTrigger>
                    <TabsTrigger value="cyberabad">Cyberabad</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <div className="space-y-2 h-[400px] overflow-y-auto pr-2">
                      {cameraLocations.map(camera => (
                        <div 
                          key={camera.id}
                          className={`p-2 border rounded-md cursor-pointer flex items-center gap-2 ${
                            activeCamera === camera.id ? 'bg-blue-50 border-titeh-primary' : ''
                          } ${camera.status === 'inactive' ? 'opacity-60' : ''}`}
                          onClick={() => setActiveCamera(camera.id)}
                        >
                          <div className={`p-1.5 rounded-full ${
                            camera.status === 'active' ? 'bg-green-500' : 
                            camera.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}>
                            <Camera className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{camera.name}</p>
                            <p className="text-xs text-gray-500">{camera.area}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleFullscreen(camera.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="hyderabad">
                    <div className="space-y-2 h-[400px] overflow-y-auto pr-2">
                      {cameraLocations.filter(camera => camera.area === 'Hyderabad').map(camera => (
                        <div 
                          key={camera.id}
                          className={`p-2 border rounded-md cursor-pointer flex items-center gap-2 ${
                            activeCamera === camera.id ? 'bg-blue-50 border-titeh-primary' : ''
                          } ${camera.status === 'inactive' ? 'opacity-60' : ''}`}
                          onClick={() => setActiveCamera(camera.id)}
                        >
                          <div className={`p-1.5 rounded-full ${
                            camera.status === 'active' ? 'bg-green-500' : 
                            camera.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}>
                            <Camera className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{camera.name}</p>
                            <p className="text-xs text-gray-500">{camera.area}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleFullscreen(camera.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="cyberabad">
                    <div className="space-y-2 h-[400px] overflow-y-auto pr-2">
                      {cameraLocations.filter(camera => camera.area === 'Cyberabad').map(camera => (
                        <div 
                          key={camera.id}
                          className={`p-2 border rounded-md cursor-pointer flex items-center gap-2 ${
                            activeCamera === camera.id ? 'bg-blue-50 border-titeh-primary' : ''
                          } ${camera.status === 'inactive' ? 'opacity-60' : ''}`}
                          onClick={() => setActiveCamera(camera.id)}
                        >
                          <div className={`p-1.5 rounded-full ${
                            camera.status === 'active' ? 'bg-green-500' : 
                            camera.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}>
                            <Camera className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{camera.name}</p>
                            <p className="text-xs text-gray-500">{camera.area}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleFullscreen(camera.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Archive</CardTitle>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
                <CardDescription>Access historical footage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="date" className="text-xs">Date</Label>
                      <div className="relative">
                        <CalendarDays className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <input 
                          id="date" 
                          type="date" 
                          className="w-full pl-8 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-xs">Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <input 
                          id="time" 
                          type="time" 
                          className="w-full pl-8 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-titeh-primary" 
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        toast({
                          title: "Archive Accessed",
                          description: "Historical footage loaded successfully",
                        });
                      }, 1500);
                    }}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search Archives
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrafficCameraFeed;
