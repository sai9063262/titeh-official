
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Search, Check, X, RefreshCw, User, AlertTriangle, Shield, FileText, AlertCircle, MapPin, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { facialMatchSimulation, validateLicenseNumber, isTorchSupported, toggleTorch, DriverData, fileToDataUrl } from "@/lib/verification-utils";
import FlashLight from "@/components/icons/FlashLight";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DriverService from "@/services/driver-service";
import { supabase } from "@/integrations/supabase/client";

const DriverVerification = () => {
  const { toast } = useToast();
  const [licenseNumber, setLicenseNumber] = useState("");
  const [verificationMode, setVerificationMode] = useState<"license" | "facial">("license");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    driver?: DriverData;
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
  const [flashlightSupported, setFlashlightSupported] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lon: number} | null>(null);
  const [showPositionGuide, setShowPositionGuide] = useState(true);
  const [driverDatabase, setDriverDatabase] = useState<DriverData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Check if the browser supports the required APIs
  const isCameraSupported = useRef(
    'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
  ).current;

  // Load drivers from database
  useEffect(() => {
    const fetchDrivers = async () => {
      setIsLoading(true);
      try {
        const drivers = await DriverService.getAllDrivers();
        setDriverDatabase(drivers);
      } catch (error) {
        console.error("Error loading drivers:", error);
        toast({
          title: "Error",
          description: "Failed to load driver database",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDrivers();
  }, [toast]);

  // Get current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          console.log("Geolocation permission denied or unavailable");
        }
      );
    }
  }, []);

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
      // Check if permission is already granted
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissionStatus.state === 'denied') {
        setCameraError("Camera permission denied. Please enable it in your browser settings.");
        toast({
          title: "Permission Denied",
          description: "Camera access was denied. Check browser settings and reload the page.",
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
      
      // Check if flashlight is supported
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const isSupported = await isTorchSupported(videoTrack);
        setFlashlightSupported(isSupported);
      }
      
      toast({
        title: "Camera Active",
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
      
      // Check if flashlight is supported on this camera
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const isSupported = await isTorchSupported(videoTrack);
        setFlashlightSupported(isSupported);
        // Turn off flashlight when switching to front camera
        if (newFacing === 'user' && isFlashlightOn) {
          setIsFlashlightOn(false);
        }
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

  const handleToggleFlashlight = async () => {
    if (!stream) return;
    
    try {
      const videoTrack = stream.getVideoTracks()[0];
      if (!videoTrack) return;
      
      const success = await toggleTorch(videoTrack, !isFlashlightOn);
      
      if (success) {
        setIsFlashlightOn(!isFlashlightOn);
        toast({
          title: `Flashlight ${!isFlashlightOn ? 'ON' : 'OFF'}`,
          description: `Camera flashlight turned ${!isFlashlightOn ? 'on' : 'off'}`,
        });
      } else {
        toast({
          title: "Flashlight Error",
          description: "Could not control flashlight. Your device may not support this feature.",
          variant: "destructive",
        });
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // Convert to data URL
      const imageUrl = await fileToDataUrl(file);
      
      // Simulate facial recognition with delay
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
        
        setIsVerifying(false);
      }, 2000);
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error",
        description: "Failed to process the uploaded image",
        variant: "destructive",
      });
      setIsVerifying(false);
    }
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

  const renderCameraControls = () => (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: "300px" }}>
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
        
        {/* Position helper text - smaller and less intrusive */}
        {showPositionGuide && (
          <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none">
            <div className="text-white text-sm bg-black bg-opacity-40 px-2 py-1 rounded flex items-center">
              <span>Position the face in frame</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 ml-2 p-0 text-white pointer-events-auto"
                onClick={() => setShowPositionGuide(false)}
              >
                ×
              </Button>
            </div>
          </div>
        )}
        
        {/* Top camera info bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between bg-black bg-opacity-60 p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white h-8 px-2 py-1"
            onClick={switchCamera}
          >
            {facing === "environment" ? (
              <>
                <Camera className="h-4 w-4 mr-1" />
                Back Camera
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-1" />
                Front Camera
              </>
            )}
          </Button>
          
          {currentLocation && (
            <div className="text-white text-xs flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              Location: {currentLocation.lat.toFixed(4)}, {currentLocation.lon.toFixed(4)}
            </div>
          )}
        </div>
        
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
          <Button 
            variant="outline" 
            onClick={switchCamera}
            className="flex-1"
          >
            Switch to {facing === "environment" ? "Front" : "Back"} Camera
          </Button>
          
          {(flashlightSupported && facing === "environment") && (
            <Button 
              variant={isFlashlightOn ? "default" : "outline"}
              onClick={handleToggleFlashlight}
              className="flex-1"
            >
              <FlashLight className={`mr-2 h-4 w-4 ${isFlashlightOn ? 'text-white' : ''}`} />
              {isFlashlightOn ? "Turn Off Light" : "Turn On Light"}
            </Button>
          )}
        </div>
        
        <div className="flex gap-2 mt-2 sm:mt-0">
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
                Take Photo
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

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
              closeCamera();
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
                    placeholder="Enter License Number"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleLicenseSearch} 
                    disabled={!licenseNumber || isVerifying || isLoading}
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
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={openCamera} 
                      className="bg-titeh-primary flex-1"
                      disabled={isRequestingPermission || isLoading}
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
                    
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isVerifying || isLoading}
                    >
                      <Image className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                ) : renderCameraControls()}
                
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
    </Layout>
  );
};

export default DriverVerification;
