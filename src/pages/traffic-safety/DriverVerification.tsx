
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, UserCheck, Scan, RefreshCw, AlertCircle, CheckCircle, X, Info, Shield, FileSpreadsheet, MapPin, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DriverData {
  name: string;
  licenseNumber: string;
  validUntil: string;
  vehicleClass: string;
  photoUrl: string;
  status: "valid" | "expired" | "suspended" | "not_found";
}

interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: number;
}

const DriverVerification = () => {
  const { toast } = useToast();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchFound, setMatchFound] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeTab, setActiveTab] = useState("camera");
  const [manualSearch, setManualSearch] = useState("");
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [facing, setFacing] = useState<"user" | "environment">("environment");
  const [locationGranted, setLocationGranted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  
  const dummyDrivers: DriverData[] = [
    {
      name: "Raj Kumar Singh",
      licenseNumber: "TG0220210123456",
      validUntil: "2030-06-15",
      vehicleClass: "LMV, MCWG",
      photoUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=180&h=180",
      status: "valid"
    },
    {
      name: "Priya Sharma",
      licenseNumber: "TG0420200789012",
      validUntil: "2025-11-30",
      vehicleClass: "MCWG",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=180&h=180",
      status: "valid"
    },
    {
      name: "Mohammad Farhan",
      licenseNumber: "TG0120183456789",
      validUntil: "2023-05-20",
      vehicleClass: "LMV, MCWG, HMV",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=180&h=180",
      status: "expired"
    },
    {
      name: "Anjali Reddy",
      licenseNumber: "TG0320190234567",
      validUntil: "2029-08-10",
      vehicleClass: "LMV",
      photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=180&h=180",
      status: "suspended"
    }
  ];

  // Request location access
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            setLocationGranted(true);
            toast({
              title: "Location Access Granted",
              description: "Location services are now available for verification",
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            toast({
              title: "Location Access Denied",
              description: "Please enable location for complete verification",
              variant: "destructive",
            });
            setLocationGranted(false);
          }
        );
      } else {
        toast({
          title: "Location Not Supported",
          description: "Your device doesn't support location services",
          variant: "destructive",
        });
      }
    };

    getLocation();
  }, [toast]);

  // Effect to handle camera access
  useEffect(() => {
    if (isCameraOpen) {
      const enableCamera = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: facing 
            } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            setStream(mediaStream);
          }
          
          toast({
            title: "Camera Access Granted",
            description: "Camera is now active for verification",
          });
        } catch (err) {
          console.error("Error accessing camera:", err);
          toast({
            title: "Camera Access Failed",
            description: "Could not access your camera. Please check permissions.",
            variant: "destructive",
          });
          
          // Fallback to simulation mode
          simulateCamera();
        }
      };
      
      enableCamera();
      
      return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isCameraOpen, facing, toast]);
  
  // Toggle camera facing mode
  const toggleCameraFacing = () => {
    // Stop current stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Toggle facing mode
    setFacing(prev => prev === "user" ? "environment" : "user");
    
    // Re-enable camera with new facing mode
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraOpen(false);
    setTimeout(() => setIsCameraOpen(true), 100);
  };
  
  // Function to simulate camera if access fails
  const simulateCamera = () => {
    setImageSrc("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=480&h=320");
    setIsPhotoTaken(true);
    runVerification();
  };
  
  // Handle taking a photo from camera stream
  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageSrc(dataUrl);
        setIsPhotoTaken(true);
        
        // Stop camera stream after taking photo
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        runVerification();
      }
    } else {
      // Fallback for testing
      simulateCamera();
    }
  };
  
  // Reset camera and take new photo
  const resetCamera = () => {
    setIsPhotoTaken(false);
    setImageSrc(null);
    setMatchFound(null);
    setDriverData(null);
    setManualSearch("");
    setProgress(0);
    setIsProcessing(false);
    setIsCameraOpen(true);
  };

  // Open map with current location
  const openMap = () => {
    if (currentLocation) {
      const mapUrl = `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
      window.open(mapUrl, '_blank');
    } else {
      toast({
        title: "Location Not Available",
        description: "Please enable location services to view on map",
        variant: "destructive",
      });
    }
  };
  
  // Run verification process with progress bar
  const runVerification = () => {
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Simulate a match with 75% probability for demo
          const isMatch = Math.random() < 0.75;
          setMatchFound(isMatch);
          
          if (isMatch) {
            // Pick a random driver from our dummy data
            const randomDriver = dummyDrivers[Math.floor(Math.random() * dummyDrivers.length)];
            setDriverData(randomDriver);
            
            // Show result dialog
            setIsDialogOpen(true);
            
            toast({
              title: "Driver Identified",
              description: `Match found: ${randomDriver.name}`,
            });
          } else {
            toast({
              title: "No Match Found",
              description: "Could not identify driver in our database",
              variant: "destructive",
            });
          }
          
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };
  
  // Handle manual search by license number
  const handleManualSearch = () => {
    if (!manualSearch) {
      toast({
        title: "Search Error",
        description: "Please enter a license number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const foundDriver = dummyDrivers.find(
        driver => driver.licenseNumber.toLowerCase() === manualSearch.toLowerCase()
      );
      
      if (foundDriver) {
        setDriverData(foundDriver);
        setMatchFound(true);
        setIsDialogOpen(true);
        
        toast({
          title: "Driver Found",
          description: `License details found for ${foundDriver.name}`,
        });
      } else {
        setMatchFound(false);
        
        toast({
          title: "No Records Found",
          description: "No driver found with that license number",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold text-titeh-primary mb-2">Driver Verification</h1>
        <p className="text-gray-500 mb-6">Verify driver's identity and license status</p>
        
        {/* Location Permission Banner */}
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 ${locationGranted ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className={`p-2 rounded-full ${locationGranted ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <MapPin className={`h-5 w-5 ${locationGranted ? 'text-green-600' : 'text-yellow-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm">
              {locationGranted ? 'Location Access Granted' : 'Location Access Required'}
            </h3>
            <p className="text-xs text-gray-600">
              {locationGranted 
                ? 'Your location is being used for verification purposes' 
                : 'Enable location services for complete verification'
              }
            </p>
          </div>
          {locationGranted && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={openMap}
              className="ml-auto"
            >
              <Map className="h-4 w-4 mr-1" />
              View Map
            </Button>
          )}
          {!locationGranted && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position: GeolocationPosition) => {
                      setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                      });
                      setLocationGranted(true);
                      toast({
                        title: "Location Access Granted",
                        description: "Location services are now available",
                      });
                    },
                    (error) => {
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
          )}
        </div>
        
        <Tabs 
          defaultValue="camera" 
          className="mb-6"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Face Recognition
            </TabsTrigger>
            <TabsTrigger value="license" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              License Number
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Face Verification</CardTitle>
                    {isCameraOpen && !isPhotoTaken && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={toggleCameraFacing}
                      >
                        <Smartphone className="h-4 w-4 mr-1" />
                        {facing === "user" ? "Switch to Back Camera" : "Switch to Front Camera"}
                      </Button>
                    )}
                  </div>
                  <CardDescription>
                    Take a clear photo of the driver for instant verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!isCameraOpen && !isPhotoTaken ? (
                      <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <Camera className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 text-center mb-4">
                          Access your camera to take a photo of the driver for verification
                        </p>
                        <Button 
                          onClick={() => setIsCameraOpen(true)}
                          className="bg-titeh-primary"
                        >
                          Open Camera
                        </Button>
                      </div>
                    ) : isPhotoTaken ? (
                      <div className="space-y-4">
                        <div className="relative border rounded-lg overflow-hidden">
                          {imageSrc && (
                            <img 
                              src={imageSrc} 
                              alt="Driver" 
                              className="w-full h-64 object-cover"
                            />
                          )}
                          
                          {isProcessing && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                              <Scan className="h-8 w-8 animate-pulse mb-2" />
                              <p className="text-sm mb-2">Analyzing face...</p>
                              <div className="w-3/4">
                                <Progress value={progress} className="h-2" />
                              </div>
                              <p className="text-xs mt-2">{progress}% complete</p>
                            </div>
                          )}
                          
                          {matchFound === false && !isProcessing && (
                            <div className="absolute inset-0 bg-red-500/30 flex flex-col items-center justify-center">
                              <div className="bg-white p-4 rounded-lg text-center">
                                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                <p className="font-semibold text-red-600">No Match Found</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Driver not recognized in the database
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {locationGranted && currentLocation && (
                            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              Location: Verified
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={resetCamera}
                            className="flex items-center gap-1 flex-1"
                            disabled={isProcessing}
                          >
                            <Camera className="h-4 w-4" />
                            Take New Photo
                          </Button>
                          
                          {matchFound === false && (
                            <Button 
                              className="flex items-center gap-1 flex-1 bg-titeh-primary"
                              onClick={() => setActiveTab("license")}
                            >
                              <FileSpreadsheet className="h-4 w-4" />
                              Search by License
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative border rounded-lg overflow-hidden h-64">
                          <video 
                            ref={videoRef}
                            autoPlay 
                            muted 
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <p className="text-white text-sm">
                              Position the face clearly in the frame
                            </p>
                          </div>
                          
                          {locationGranted && currentLocation && (
                            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              Location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (stream) {
                                stream.getTracks().forEach(track => track.stop());
                              }
                              setIsCameraOpen(false);
                            }}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          
                          <Button 
                            onClick={takePhoto} 
                            className="bg-titeh-primary flex-1"
                          >
                            <Camera className="h-4 w-4 mr-1" />
                            Take Photo
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Verification Guide</CardTitle>
                  <CardDescription>
                    How to properly verify a driver's identity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Camera className="h-5 w-5 text-titeh-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Take a Clear Photo</h3>
                        <p className="text-sm text-gray-600">
                          Ensure good lighting and a straight-on view of the driver's face
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <UserCheck className="h-5 w-5 text-titeh-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Verify Identity</h3>
                        <p className="text-sm text-gray-600">
                          Compare the photo with the driver and check license details
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-titeh-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Check Status</h3>
                        <p className="text-sm text-gray-600">
                          Confirm the license is valid and not expired or suspended
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded-md">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-sm text-yellow-800">Important Notice</h3>
                          <p className="text-xs text-yellow-700">
                            Only authorized personnel should perform driver verification. 
                            Unauthorized access to driver data is punishable under data protection laws.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="license">
            <Card>
              <CardHeader>
                <CardTitle>License Number Search</CardTitle>
                <CardDescription>
                  Enter the driver's license number to verify their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="space-y-2">
                      <Label htmlFor="license" className="block text-sm font-medium">
                        Driver's License Number
                      </Label>
                      <input 
                        id="license"
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g. TG0220210123456"
                        value={manualSearch}
                        onChange={(e) => setManualSearch(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Format: State code (TG) followed by numbers
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setActiveTab("camera")}
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Use Camera
                    </Button>
                    <Button 
                      className="flex-1 bg-titeh-primary"
                      onClick={handleManualSearch}
                      disabled={isLoading || !manualSearch}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Scan className="h-4 w-4 mr-1" />
                          Verify License
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-md">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm text-blue-800">Sample License Numbers</h3>
                        <p className="text-xs text-blue-700 mb-2">
                          For testing, use one of these license numbers:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {dummyDrivers.map((driver, index) => (
                            <div 
                              key={index}
                              className="text-xs bg-white p-2 rounded border border-blue-100 flex justify-between"
                            >
                              <span>{driver.licenseNumber}</span>
                              <span className={`font-medium ${
                                driver.status === "valid" ? "text-green-600" : 
                                driver.status === "expired" ? "text-red-600" : "text-orange-600"
                              }`}>
                                {driver.status === "valid" ? "Valid" : 
                                 driver.status === "expired" ? "Expired" : "Suspended"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Driver verification results dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Driver Verification Results</DialogTitle>
            </DialogHeader>
            
            {driverData && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={driverData.photoUrl} 
                    alt={driverData.name}
                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div>
                    <h3 className="font-medium text-lg">{driverData.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {driverData.status === "valid" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid
                        </span>
                      ) : driverData.status === "expired" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Suspended
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">License Number</span>
                    <span className="text-sm font-medium">{driverData.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valid Until</span>
                    <span className={`text-sm font-medium ${
                      driverData.status === "expired" ? "text-red-600" : ""
                    }`}>
                      {new Date(driverData.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vehicle Class</span>
                    <span className="text-sm font-medium">{driverData.vehicleClass}</span>
                  </div>
                  {locationGranted && currentLocation && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Verification Location</span>
                      <span className="text-sm font-medium text-blue-600 underline cursor-pointer" onClick={openMap}>
                        View on Map
                      </span>
                    </div>
                  )}
                </div>
                
                {driverData.status !== "valid" && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-red-800">
                          {driverData.status === "expired" ? "License Expired" : "License Suspended"}
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          {driverData.status === "expired" 
                            ? "This driver's license has expired and is no longer valid."
                            : "This driver's license has been suspended. Not permitted to drive."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              <Button className="bg-titeh-primary">
                Print Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default DriverVerification;
