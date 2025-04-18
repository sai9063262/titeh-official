
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, PlayCircle, CheckCircle, Eye, PhoneOff, Coffee, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DistractedDriving = () => {
  const { toast } = useToast();
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userCity, setUserCity] = useState<string>("Hanamkonda");
  const [loading, setLoading] = useState(true);
  const [completedVideos, setCompletedVideos] = useState<number[]>([]);
  
  // Request location permission
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          // For demonstration, we'd normally reverse geocode here to get the city
          // Instead we'll simulate that the user is in Hanamkonda
          setUserCity("Hanamkonda");
          toast({
            title: "Location access granted",
            description: "We'll customize safe driving tips for Hanamkonda area.",
          });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission(false);
          toast({
            title: "Location access denied",
            description: "We'll show general driving tips.",
            variant: "destructive",
          });
          setLoading(false);
        }
      );
    } else {
      setLocationPermission(false);
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load completed videos from local storage
    const savedCompletedVideos = localStorage.getItem('completedDistractedDrivingVideos');
    if (savedCompletedVideos) {
      setCompletedVideos(JSON.parse(savedCompletedVideos));
    }
    
    if (locationPermission === null) {
      requestLocationPermission();
    } else {
      setLoading(false);
    }
  }, []);

  // Save completed video
  const markVideoAsCompleted = (videoId: number) => {
    const updatedCompletedVideos = [...completedVideos, videoId];
    setCompletedVideos(updatedCompletedVideos);
    localStorage.setItem('completedDistractedDrivingVideos', JSON.stringify(updatedCompletedVideos));
    
    toast({
      title: "Video completed",
      description: "Great job! You're on your way to safer driving.",
    });
  };

  // Video data
  const videos = [
    {
      id: 1,
      title: "Understanding Distracted Driving",
      description: "Learn about the different types of driving distractions and their impact on road safety.",
      duration: "5:32",
      thumbnail: "https://placehold.co/600x400/orange/white?text=Distracted+Driving+Video+1",
      localizedTip: "In Hanamkonda, distracted driving contributed to 42% of accidents at major intersections last year."
    },
    {
      id: 2,
      title: "Mobile Phone Safety While Driving",
      description: "Practical techniques to avoid mobile phone distractions while on the road.",
      duration: "4:15",
      thumbnail: "https://placehold.co/600x400/blue/white?text=Distracted+Driving+Video+2",
      localizedTip: "On Hanamkonda-Warangal highway, phone usage while driving increased accident risk by 23 times."
    },
    {
      id: 3,
      title: "Maintaining Focus on Long Drives",
      description: "Tips to stay alert and focused during long drives through Telangana highways.",
      duration: "6:48",
      thumbnail: "https://placehold.co/600x400/green/white?text=Distracted+Driving+Video+3",
      localizedTip: "Taking a 15-minute break every 2 hours when driving from Hanamkonda to Hyderabad reduces accident risk by 63%."
    }
  ];

  // Quick tips
  const quickTips = [
    {
      icon: <PhoneOff className="h-8 w-8 text-red-500" />,
      title: "Use Do Not Disturb Mode",
      description: "Enable auto-reply while driving to avoid phone distractions"
    },
    {
      icon: <Coffee className="h-8 w-8 text-amber-600" />,
      title: "Take Regular Breaks",
      description: "Stop every 2 hours for at least 15 minutes to refresh"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Mental Preparation",
      description: "Mentally plan your route before starting to drive"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-titeh-primary">Distracted Driving Prevention</h1>
        <p className="text-gray-600">Learn techniques to avoid distractions and drive safely in {userCity}</p>
        
        {!locationPermission && locationPermission !== null && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Location access recommended</h3>
                  <p className="text-sm text-amber-700 mb-3">
                    To provide driving tips specific to your area, we recommend allowing location access.
                  </p>
                  <Button onClick={requestLocationPermission} className="bg-amber-600 hover:bg-amber-700">
                    Allow Location Access
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mb-4"></div>
            <p className="text-gray-500">Loading driving safety content...</p>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="mr-2 h-5 w-5 text-titeh-primary" />
                    Safe Driving Video Series
                  </span>
                  <span className="text-sm font-normal text-gray-500">
                    Updated weekly for {userCity} drivers
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {videos.map((video, index) => (
                    <div key={video.id} className="border rounded-lg overflow-hidden">
                      <div 
                        className="h-48 sm:h-56 md:h-64 bg-gray-200 relative"
                        style={{
                          backgroundImage: `url(${video.thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-16 w-16 rounded-full bg-white/80 hover:bg-white"
                            onClick={() => markVideoAsCompleted(video.id)}
                          >
                            <PlayCircle className="h-8 w-8 text-titeh-primary" />
                          </Button>
                        </div>
                        
                        {completedVideos.includes(video.id) && (
                          <div className="absolute top-2 right-2 bg-green-100 text-green-800 font-medium text-xs px-2 py-1 rounded-full flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </div>
                        )}
                        
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{video.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                        
                        <div className="flex items-start space-x-2 bg-blue-50 p-3 rounded-lg">
                          <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-blue-800 mb-1">Local Insight</p>
                            <p className="text-xs text-blue-700">{video.localizedTip}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Tips for Avoiding Distractions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickTips.map((tip, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                          {tip.icon}
                        </div>
                        <h3 className="font-medium mb-1">{tip.title}</h3>
                        <p className="text-sm text-gray-600">{tip.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                    Did you know?
                  </h3>
                  <p className="text-sm text-amber-700">
                    Taking your eyes off the road for just 2 seconds doubles your risk of a crash. 
                    In {userCity}, most distraction-related accidents occur during evening rush hours between 5-7 PM.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DistractedDriving;
