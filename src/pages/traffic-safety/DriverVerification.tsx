
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Search, Check, X, RefreshCw, User, AlertTriangle, Shield, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { facialMatchSimulation, validateLicenseNumber } from "@/lib/verification-utils";
import FlashLight from "@/components/icons/FlashLight";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Sample driver data for demonstration
const driverDatabase = [
  {
    id: "DL-123456",
    name: "Raj Kumar",
    licenseNumber: "TS-12345-2020",
    validUntil: "2025-12-31",
    vehicleClass: "LMV, MCWG",
    photoUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200",
    status: "valid" as const,
    address: "123 Main Road, Hyderabad",
    age: "32",
    notes: "Clean record"
  },
  {
    id: "DL-654321",
    name: "Priya Sharma",
    licenseNumber: "TS-54321-2019",
    validUntil: "2024-05-15",
    vehicleClass: "LMV",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    status: "valid" as const,
    address: "456 Park Avenue, Secunderabad",
    age: "28",
    notes: "One minor violation in 2023"
  },
  {
    id: "DL-111222",
    name: "Suresh Reddy",
    licenseNumber: "TS-11122-2018",
    validUntil: "2023-10-10",
    vehicleClass: "MCWG",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    status: "expired" as const,
    address: "789 Lake View, Kukatpally",
    age: "45",
    notes: "License expired"
  }
];

const DriverVerification = () => {
  const { toast } = useToast();
  const [licenseNumber, setLicenseNumber] = useState("");
  const [verificationMode, setVerificationMode] = useState<"license" | "facial">("license");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    driver?: typeof driverDatabase[0];
    message?: string;
    confidence?: number;
  } | null>(null);
  
  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [facing, setFacing] = useState<"user" | "environment">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Check if the browser supports the required APIs
  const isCameraSupported = useRef(
    'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
  ).current;

  const handleLicenseSearch = () => {
    setIsVerifying(true);
    
    setTimeout(() => {
      const result = validateLicenseNumber(licenseNumber, driverDatabase);
      
      if (result) {
        setVerificationResult({
          success: true,
          driver: result,
          message: "License verified successfully"
        });
      } else {
        setVerificationResult({
          success: false,
          message: "License number not found in database"
        });
      }
      
      setIsVerifying(false);
    }, 1500);
  };

  const openCamera = async () => {
    setCameraError(null);
    setIsRequestingPermission(true);

    if (!isCameraSupported) {
      setCameraError("Your browser does not support camera access");
      toast({
        title: "Camera Not Supported",
        description: "Your browser does not support camera functionality",
        variant: "destructive",
      });
      setIsRequestingPermission(false);
      return;
    }

    try {
      // First, check if we already have permission
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissions.state === 'denied') {
        setCameraError("Camera permission was denied. Please enable it in your browser settings and reload the page.");
        toast({
          title: "Permission Denied",
          description: "Camera access was denied. Check browser settings.",
          variant: "destructive",
        });
        setCameraPermissionGranted(false);
        setIsRequestingPermission(false);
        return;
      }

      // Try to access the camera
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Successful camera access
      setCameraPermissionGranted(true);
      setStream(mediaStream);
      setIsCameraOpen(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      toast({
        title: "Camera Access Granted",
        description: `${facing === 'user' ? 'Front' : 'Back'} camera is now active`,
      });
      
    } catch (error) {
      console.error("Camera access error:", error);
      
      const errorMessage = error instanceof DOMException && error.name === 'NotAllowedError'
        ? "Camera permission denied. Please allow camera access in your browser settings."
        : "Could not access camera. Check permissions or try a different camera.";
      
      setCameraError(errorMessage);
      setCameraPermissionGranted(false);
      
      toast({
        title: "Camera Access Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const switchCamera = async () => {
    const newFacing = facing === "environment" ? "user" : "environment";
    setFacing(newFacing);
    
    // Stop current stream if it exists
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Reopen camera with new facing mode
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: newFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      toast({
        title: "Camera Switched",
        description: `${newFacing === 'user' ? 'Front' : 'Back'} camera activated`,
      });
    } catch (error) {
      console.error("Error switching camera:", error);
      setCameraError("Failed to switch camera");
      
      toast({
        title: "Camera Switch Failed",
        description: "Could not switch cameras. Try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFlashlight = async () => {
    if (!stream) return;
    
    try {
      const track = stream.getVideoTracks()[0];
      
      if (track) {
        const capabilities = track.getCapabilities();
        
        // Check if torch is supported
        if (capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: !isFlashlightOn }]
          });
          
          setIsFlashlightOn(!isFlashlightOn);
          
          toast({
            title: `Flashlight ${!isFlashlightOn ? 'ON' : 'OFF'}`,
            description: `Camera flashlight turned ${!isFlashlightOn ? 'on' : 'off'}`,
          });
        } else {
          toast({
            title: "Flashlight Not Available",
            description: "Your device does not support flashlight control",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Flashlight error:", error);
      toast({
        title: "Flashlight Error",
        description: "Could not control flashlight",
        variant: "destructive",
      });
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !stream) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    setIsVerifying(true);
    
    // Simulate facial recognition
    setTimeout(() => {
      const result = facialMatchSimulation(driverDatabase);
      
      if (result.matched && result.driver) {
        setVerificationResult({
          success: true,
          driver: result.driver,
          message: "Face matched with database record",
          confidence: result.confidence
        });
      } else {
        setVerificationResult({
          success: false,
          message: "No matching face found in database",
          confidence: result.confidence
        });
      }
      
      closeCamera();
      setIsVerifying(false);
    }, 2000);
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
    setIsFlashlightOn(false);
  };

  useEffect(() => {
    // Clean up camera stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Driver Verification</h1>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              setVerificationMode(verificationMode === "license" ? "facial" : "license");
              setVerificationResult(null);
            }}
          >
            {verificationMode === "license" ? (
              <>
                <Camera className="h-4 w-4" />
                Switch to Facial Recognition
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Switch to License Verification
              </>
            )}
          </Button>
        </div>
        
        {verificationMode === "license" ? (
          <Card>
            <CardHeader>
              <CardTitle>License Number Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="Enter License Number (e.g., TS-12345-2020)"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleLicenseSearch} 
                    disabled={!licenseNumber || isVerifying}
                    className="bg-titeh-primary"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Demo license numbers */}
                <div className="text-sm text-gray-500">
                  <p>For demo purposes, try these license numbers:</p>
                  <ul className="list-disc list-inside">
                    <li>TS-12345-2020 (Valid)</li>
                    <li>TS-54321-2019 (Valid)</li>
                    <li>TS-11122-2018 (Expired)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Facial Recognition Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-4">
                  Verify driver identity using facial recognition technology. For demonstration purposes only.
                </p>
                
                {!isCameraOpen ? (
                  <Button 
                    onClick={openCamera} 
                    className="bg-titeh-primary w-full"
                    disabled={isRequestingPermission}
                  >
                    {isRequestingPermission ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Requesting Permission...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ minHeight: "300px" }}>
                      <video 
                        ref={videoRef}
                        autoPlay 
                        playsInline
                        className="w-full h-full object-cover"
                        onLoadedMetadata={() => {
                          if (videoRef.current) {
                            videoRef.current.play().catch(e => {
                              console.error("Video play error:", e);
                              setCameraError("Failed to play video stream");
                            });
                          }
                        }}
                      />
                      
                      <canvas ref={canvasRef} className="hidden" width="1280" height="720" />
                      
                      {cameraError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4">
                          <div className="text-white text-center max-w-md">
                            <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-400" />
                            <p className="text-lg font-semibold mb-2">Camera Error</p>
                            <p className="mb-4">{cameraError}</p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                              <Button 
                                onClick={openCamera} 
                                variant="outline" 
                                className="text-white border-white"
                              >
                                Retry Camera
                              </Button>
                              <Button 
                                onClick={() => {
                                  closeCamera();
                                  setCameraError(null);
                                }}
                                variant="destructive"
                              >
                                Close
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-between">
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={switchCamera}>
                          {facing === "environment" ? "Front Camera" : "Back Camera"}
                        </Button>
                        
                        <Button 
                          variant="secondary" 
                          onClick={toggleFlashlight}
                          disabled={facing === "user"}
                        >
                          <FlashLight className="mr-2 h-4 w-4" />
                          {isFlashlightOn ? "Turn Off Light" : "Turn On Light"}
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={closeCamera}>
                          Cancel
                        </Button>
                        <Button 
                          className="bg-titeh-primary" 
                          onClick={captureImage}
                          disabled={isVerifying || !!cameraError}
                        >
                          {isVerifying ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Camera className="mr-2 h-4 w-4" />
                              Capture & Verify
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isCameraOpen && cameraPermissionGranted === false && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800">Camera Permission Required</h4>
                        <p className="text-sm text-red-700 mt-1">
                          To use facial recognition, you must allow camera access in your browser settings. 
                          After enabling the permission, refresh this page.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isCameraSupported && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800">Camera Not Supported</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Your browser doesn't support camera access. Please try a different browser like Chrome or Firefox.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Verification Result */}
        {verificationResult && (
          <Card className={`border-l-4 ${verificationResult.success ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                {verificationResult.success ? (
                  <>
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Verification Successful
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    Verification Failed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verificationResult.success && verificationResult.driver ? (
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={verificationResult.driver.photoUrl} 
                        alt={verificationResult.driver.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute bottom-0 left-0 right-0 text-xs text-white text-center py-1 ${
                        verificationResult.driver.status === "valid" ? "bg-green-500" :
                        verificationResult.driver.status === "expired" ? "bg-amber-500" : "bg-red-500"
                      }`}>
                        {verificationResult.driver.status === "valid" ? "Valid" :
                         verificationResult.driver.status === "expired" ? "Expired" : "Suspended"}
                      </div>
                    </div>
                    
                    {verificationResult.confidence && (
                      <div className="mt-2 text-xs text-center">
                        <p className="text-gray-500">Match Confidence</p>
                        <p className="font-semibold">{verificationResult.confidence}%</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Driver Name</p>
                      <p className="font-semibold">{verificationResult.driver.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">License Number</p>
                      <p className="font-semibold">{verificationResult.driver.licenseNumber}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <div>
                        <p className="text-sm text-gray-500">Valid Until</p>
                        <p className="font-semibold">{verificationResult.driver.validUntil}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Vehicle Class</p>
                        <p className="font-semibold">{verificationResult.driver.vehicleClass}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-semibold">{verificationResult.driver.address}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-semibold">{verificationResult.driver.age}</p>
                      </div>
                    </div>
                    
                    {verificationResult.driver.notes && (
                      <div>
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className="font-semibold">{verificationResult.driver.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-red-500 font-medium">{verificationResult.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {verificationMode === "license" 
                      ? "Please check the license number and try again" 
                      : "No matching face found in the database"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 text-titeh-primary mr-2" />
              Verification Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {verificationMode === "license" 
                ? "Driver verification by license number allows you to validate the authenticity and status of any driving license issued in Telangana. Enter the complete license number for verification."
                : "Facial recognition verification uses advanced biometric technology to match a driver's face with their official records. Camera access is required for this feature."}
            </p>
            
            <div className="bg-blue-50 p-3 mt-4 rounded-md">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Note:</span> This is a demonstration system for license validation. For demonstration purposes only.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Photo Capture Dialog */}
      <Dialog open={isCameraOpen} onOpenChange={(open) => !open && closeCamera()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Capture Driver Photo</DialogTitle>
          </DialogHeader>
          <div className="flex justify-between">
            <Button variant="secondary">
              {facing === "environment" ? "Back Camera" : "Front Camera"}
            </Button>
            <Button variant="secondary">
              Flashlight {isFlashlightOn ? "OFF" : "ON"}
            </Button>
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={switchCamera}>
              <Camera className="mr-2 h-4 w-4" />
              Switch Camera
            </Button>
            <Button variant="outline" onClick={toggleFlashlight}>
              <FlashLight className="mr-2 h-4 w-4" />
              Turn {isFlashlightOn ? "Off" : "On"} Light
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DriverVerification;
