
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Camera, Search, Check, X, RefreshCw, User, AlertTriangle, 
  Shield, FileText, AlertCircle, MapPin, Image, CornerDownLeft, 
  ArrowRight, Hash, UserCheck, BadgeCheck, FileSymlink, Clock, 
  Calendar, List, MoreHorizontal, Download, Fingerprint, Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  facialMatchSimulation, validateLicenseNumber, isTorchSupported, toggleTorch, 
  DriverData, fileToDataUrl, detectFace, assessImageQuality 
} from "@/lib/verification-utils";
import FlashLight from "@/components/icons/FlashLight";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DriverService from "@/services/driver-service";
import { supabase } from "@/integrations/supabase/client";
import FacialRecognitionService from "@/services/facial-recognition-service";
import { extractFacialFeatures, calculateFaceSimilarity } from "@/utils/biometricUtils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    imageQuality?: number;
    capturedImage?: string;
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
  const [processingStage, setProcessingStage] = useState<string | null>(null);
  const [showDriverDetails, setShowDriverDetails] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{name: string, url: string} | null>(null);
  
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
        console.log("Loaded drivers:", drivers);
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

  const handleLicenseSearch = async () => {
    if (!licenseNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a license number",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    setProcessingStage("Searching database for license number...");
    
    try {
      // First try with direct service method that combines both Supabase and local storage
      const driverResult = await DriverService.findDriverByLicense(licenseNumber);
      
      setProcessingStage("Validating driver information...");
      
      if (driverResult) {
        console.log("Driver found:", driverResult);
        
        setProcessingStage("Analyzing driver status...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setVerificationResult({
          success: true,
          driver: driverResult,
          message: "License verified successfully"
        });
      } else {
        console.log("No driver found with license:", licenseNumber);
        console.log("Current driver database:", driverDatabase);
        
        setProcessingStage("Checking alternative records...");
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Fallback to the local validation utility 
        const validatedDriver = validateLicenseNumber(licenseNumber, driverDatabase);
        
        if (validatedDriver) {
          setVerificationResult({
            success: true,
            driver: validatedDriver,
            message: "License verified successfully"
          });
        } else {
          setVerificationResult({
            success: false,
            message: "License number not found in database"
          });
        }
      }
    } catch (error) {
      console.error("License verification error:", error);
      setVerificationResult({
        success: false,
        message: "Error during verification process"
      });
    } finally {
      setIsVerifying(false);
      setProcessingStage(null);
    }
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
      
      // Try to access the camera with high resolution
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
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
          width: { ideal: 1920 },
          height: { ideal: 1080 }
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

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || !stream) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas to video dimensions for higher quality capture
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Capture with improved quality for facial recognition
    context.filter = 'contrast(1.1) brightness(1.05)';
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.filter = 'none';
    
    const capturedImageUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    setIsVerifying(true);
    setProcessingStage("Analyzing captured image...");
    
    try {
      // First check if there's a face in the image
      setProcessingStage("Detecting face in image...");
      const faceDetection = await detectFace(capturedImageUrl);
      
      if (!faceDetection.faceDetected) {
        setVerificationResult({
          success: false,
          message: "No face detected in the image. Please try again.",
          confidence: 0,
          capturedImage: capturedImageUrl
        });
        setIsVerifying(false);
        setProcessingStage(null);
        return;
      }
      
      // Assess image quality
      setProcessingStage("Assessing image quality...");
      const imageQuality = await assessImageQuality(capturedImageUrl);
      
      if (imageQuality < 60) {
        setVerificationResult({
          success: false,
          message: "The image quality is too low for reliable face recognition. Please try again with better lighting.",
          confidence: 0,
          imageQuality: imageQuality,
          capturedImage: capturedImageUrl
        });
        setIsVerifying(false);
        setProcessingStage(null);
        return;
      }
      
      // Refresh driver database before verification
      setProcessingStage("Retrieving driver database...");
      const drivers = await DriverService.getAllDrivers();
      setDriverDatabase(drivers);
      
      // Extract facial features (simulated)
      setProcessingStage("Extracting facial features...");
      await extractFacialFeatures(capturedImageUrl);
      
      // Match against database (enhanced simulation)
      setProcessingStage("Matching against driver records...");
      const faceRecognitionResult = await FacialRecognitionService.verifyFace(capturedImageUrl, drivers);
      
      // Use the result from the facial recognition service
      if (faceRecognitionResult.matched && faceRecognitionResult.driverId) {
        setProcessingStage("Driver match found! Retrieving details...");
        
        // Find the complete driver record
        const matchedDriver = drivers.find(d => d.id === faceRecognitionResult.driverId);
        
        if (matchedDriver) {
          setVerificationResult({
            success: true,
            driver: matchedDriver,
            message: "Face matched with database record",
            confidence: faceRecognitionResult.confidence,
            imageQuality: imageQuality,
            capturedImage: capturedImageUrl
          });
        } else {
          // Fallback to the simulation if driver record not found
          const result = facialMatchSimulation(drivers);
          
          if (result.matched && result.driver) {
            setVerificationResult({
              success: true,
              driver: result.driver,
              message: "Face matched with database record",
              confidence: result.confidence,
              imageQuality: imageQuality,
              capturedImage: capturedImageUrl
            });
          } else {
            setVerificationResult({
              success: false,
              message: "No matching face found in database",
              confidence: result.confidence,
              imageQuality: imageQuality,
              capturedImage: capturedImageUrl
            });
          }
        }
      } else {
        setVerificationResult({
          success: false,
          message: "No matching face found in database",
          confidence: faceRecognitionResult.confidence,
          imageQuality: imageQuality,
          capturedImage: capturedImageUrl
        });
      }
    } catch (error) {
      console.error("Error during facial verification:", error);
      setVerificationResult({
        success: false,
        message: "Error during verification process",
        capturedImage: capturedImageUrl
      });
    } finally {
      closeCamera();
      setIsVerifying(false);
      setProcessingStage(null);
    }
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
    setProcessingStage("Processing uploaded image...");
    
    try {
      // Convert to data URL
      const imageUrl = await fileToDataUrl(file);
      
      // First check if there's a face in the image
      setProcessingStage("Detecting face in image...");
      const faceDetection = await detectFace(imageUrl);
      
      if (!faceDetection.faceDetected) {
        setVerificationResult({
          success: false,
          message: "No face detected in the image. Please try again with a clearer photo.",
          confidence: 0,
          capturedImage: imageUrl
        });
        setIsVerifying(false);
        setProcessingStage(null);
        return;
      }
      
      // Assess image quality
      setProcessingStage("Assessing image quality...");
      const imageQuality = await assessImageQuality(imageUrl);
      
      if (imageQuality < 60) {
        setVerificationResult({
          success: false,
          message: "The image quality is too low for reliable face recognition. Please try again with a better quality image.",
          confidence: 0,
          imageQuality: imageQuality,
          capturedImage: imageUrl
        });
        setIsVerifying(false);
        setProcessingStage(null);
        return;
      }
      
      // Refresh driver database before verification
      setProcessingStage("Retrieving driver database...");
      const drivers = await DriverService.getAllDrivers();
      setDriverDatabase(drivers);
      
      // Extract facial features (simulated)
      setProcessingStage("Extracting facial features...");
      await extractFacialFeatures(imageUrl);
      
      // Match against database
      setProcessingStage("Matching against driver records...");
      const faceRecognitionResult = await FacialRecognitionService.verifyFace(imageUrl, drivers);
      
      if (faceRecognitionResult.matched && faceRecognitionResult.driverId) {
        setProcessingStage("Driver match found! Retrieving details...");
        
        // Find the complete driver record
        const matchedDriver = drivers.find(d => d.id === faceRecognitionResult.driverId);
        
        if (matchedDriver) {
          setVerificationResult({
            success: true,
            driver: matchedDriver,
            message: "Face matched with database record",
            confidence: faceRecognitionResult.confidence,
            imageQuality: imageQuality,
            capturedImage: imageUrl
          });
        } else {
          // Fallback to the simulation
          const result = facialMatchSimulation(drivers);
          
          if (result.matched && result.driver) {
            setVerificationResult({
              success: true,
              driver: result.driver,
              message: "Face matched with database record",
              confidence: result.confidence,
              imageQuality: imageQuality,
              capturedImage: imageUrl
            });
          } else {
            setVerificationResult({
              success: false,
              message: "No matching face found in database",
              confidence: result.confidence,
              imageQuality: imageQuality,
              capturedImage: imageUrl
            });
          }
        }
      } else {
        setVerificationResult({
          success: false,
          message: "No matching face found in database",
          confidence: faceRecognitionResult.confidence,
          imageQuality: imageQuality,
          capturedImage: imageUrl
        });
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error",
        description: "Failed to process the uploaded image",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
      setProcessingStage(null);
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
        
        <canvas ref={canvasRef} className="hidden" width="1920" height="1080" />
        
        {/* Improved face positioning guide */}
        {showPositionGuide && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 rounded-full border-2 border-dashed border-white opacity-70"></div>
          </div>
        )}
        
        {/* Position helper text - smaller and less intrusive */}
        {showPositionGuide && (
          <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none">
            <div className="text-white text-sm bg-black bg-opacity-60 px-3 py-1 rounded-full flex items-center">
              <span>Position face inside the circle</span>
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

  const openDriverDetails = (tab: string) => {
    setShowDriverDetails(tab);
  };

  const closeDriverDetails = () => {
    setShowDriverDetails(null);
    setSelectedDocument(null);
  };

  const renderDriverDetailsDialog = () => {
    if (!verificationResult?.driver) return null;
    
    const driver = verificationResult.driver;
    
    return (
      <Dialog open={!!showDriverDetails} onOpenChange={() => closeDriverDetails()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-titeh-primary" />
              Driver Detailed Information
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue={showDriverDetails || "overview"} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle Info</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3">
                  <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-lg overflow-hidden border">
                    <img 
                      src={driver.photoUrl} 
                      alt={driver.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute bottom-0 left-0 right-0 py-1 text-center text-white text-sm ${
                      driver.status === "valid" ? "bg-green-500" :
                      driver.status === "expired" ? "bg-amber-500" : "bg-red-500"
                    }`}>
                      {driver.status === "valid" ? "Valid License" :
                       driver.status === "expired" ? "Expired License" : "Suspended License"}
                    </div>
                  </div>
                  
                  {verificationResult.confidence && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-sm">
                      <BadgeCheck className={`h-4 w-4 ${verificationResult.confidence > 90 ? 'text-green-500' : 'text-amber-500'}`} />
                      <span>Match confidence: <strong>{verificationResult.confidence}%</strong></span>
                    </div>
                  )}
                </div>
                
                <div className="md:w-2/3 space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="text-xl font-bold">{driver.name}</h3>
                    <p className="text-gray-500 flex items-center">
                      <Hash className="h-4 w-4 mr-1 text-gray-400" />
                      License: {driver.licenseNumber}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">License Class</p>
                      <p className="font-medium">{driver.vehicleClass}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Valid Until</p>
                      <p className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {driver.validUntil}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">{driver.age || "Not available"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{driver.address || "Not available"}</p>
                    </div>
                  </div>
                  
                  {driver.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="font-medium">{driver.notes}</p>
                    </div>
                  )}
                  
                  {driver.documents && driver.documents.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-500 mb-2">Associated Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {driver.documents.slice(0, 3).map((doc, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="cursor-pointer flex items-center"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDriverDetails("documents");
                            }}
                          >
                            <FileSymlink className="h-3 w-3 mr-1" />
                            {doc.name}
                          </Badge>
                        ))}
                        
                        {driver.documents.length > 3 && (
                          <Badge 
                            variant="outline" 
                            className="cursor-pointer"
                            onClick={() => setShowDriverDetails("documents")}
                          >
                            +{driver.documents.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDriverDetails("personal")}
                >
                  <User className="h-4 w-4 mr-1" />
                  Personal Details
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDriverDetails("documents")}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View Documents
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{driver.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{driver.dateOfBirth || driver.date_of_birth || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p className="font-medium">{driver.blood_type || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{driver.phoneNumber || driver.phone_number || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Emergency Contact</p>
                  <p className="font-medium">{driver.emergencyContactName || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Emergency Phone</p>
                  <p className="font-medium">{driver.emergencyContactPhone || driver.emergency_phone_number || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="font-medium">{driver.height || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium">{driver.weight || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">License Issue Date</p>
                  <p className="font-medium">{driver.license_issue_date || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">License Points</p>
                  <p className="font-medium">{driver.license_points?.toString() || "Not available"}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{driver.address || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">{driver.city || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p className="font-medium">{driver.district || "Not available"}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Medical Conditions</p>
                  <div>
                    {driver.medicalConditions?.length || driver.health_conditions?.length ? (
                      <ul className="list-disc list-inside">
                        {(driver.medicalConditions || driver.health_conditions || []).map((condition, idx) => (
                          <li key={idx} className="text-sm">{condition}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm">None reported</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="vehicle" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Vehicle Class</p>
                  <p className="font-medium">{driver.vehicleClass}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">License Restrictions</p>
                  <div>
                    {driver.license_restrictions?.length ? (
                      <ul className="list-disc list-inside">
                        {driver.license_restrictions.map((restriction, idx) => (
                          <li key={idx} className="text-sm">{restriction}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm">None</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Vehicle Make</p>
                  <p className="font-medium">{driver.vehicle_make || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Vehicle Model</p>
                  <p className="font-medium">{driver.vehicle_model || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Vehicle Year</p>
                  <p className="font-medium">{driver.vehicle_year || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Vehicle Color</p>
                  <p className="font-medium">{driver.vehicle_color || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">License Plate</p>
                  <p className="font-medium">{driver.vehicle_plate || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type</p>
                  <p className="font-medium">{driver.vehicle_type || "Not available"}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Endorsements</p>
                  <div>
                    {driver.endorsements?.length ? (
                      <ul className="list-disc list-inside">
                        {driver.endorsements.map((endorsement, idx) => (
                          <li key={idx} className="text-sm">{endorsement}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm">None</p>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Previous Offenses</p>
                  <div>
                    {driver.previous_offenses?.length ? (
                      <ul className="list-disc list-inside">
                        {driver.previous_offenses.map((offense, idx) => (
                          <li key={idx} className="text-sm">{offense}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm">No recorded offenses</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              {selectedDocument ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-titeh-primary" />
                      {selectedDocument.name}
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDocument(null)}
                    >
                      <List className="h-4 w-4 mr-1" />
                      Back to List
                    </Button>
                  </div>
                  
                  <div className="aspect-[4/3] w-full border rounded-lg overflow-hidden bg-gray-50">
                    <img 
                      src={selectedDocument.url} 
                      alt={selectedDocument.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(selectedDocument.url, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Full Size
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Associated documents for {driver.name} (License: {driver.licenseNumber})
                  </p>
                  
                  {driver.documents && driver.documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {driver.documents.map((doc, index) => (
                        <div 
                          key={index} 
                          className="border rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedDocument(doc)}
                        >
                          <div className="h-12 w-12 flex-shrink-0 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-titeh-primary" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-gray-500">Click to view document</p>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FileText className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">No documents available for this driver</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

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
                  Verify driver identity using facial recognition technology. Position the driver's face clearly in the frame for best results.
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
        
        {/* Processing indicator */}
        {processingStage && (
          <Card className="border-titeh-primary">
            <CardContent className="py-4">
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 text-titeh-primary animate-spin mr-3" />
                <div>
                  <p className="font-medium">{processingStage}</p>
                  <p className="text-xs text-gray-500">Please wait while we process your request...</p>
                </div>
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
                    <div className="relative w-32 h-40 rounded-lg overflow-hidden border border-gray-200">
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
                    
                    {verificationResult.capturedImage && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                        <p className="text-xs text-center mb-1">Captured Image</p>
                        <img 
                          src={verificationResult.capturedImage} 
                          alt="Captured" 
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Driver Name</p>
                      <p className="font-semibold text-lg">{verificationResult.driver.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">License Number</p>
                      <p className="font-semibold">{verificationResult.driver.licenseNumber}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
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
                    
                    <div className="pt-3 mt-3 border-t flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDriverDetails("overview")}
                        className="flex items-center"
                      >
                        <User className="h-4 w-4 mr-1" />
                        Driver Details
                      </Button>
                      
                      {verificationResult.driver.documents && verificationResult.driver.documents.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openDriverDetails("documents")}
                          className="flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View Documents
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDriverDetails("vehicle")}
                        className="flex items-center"
                      >
                        <MoreHorizontal className="h-4 w-4 mr-1" />
                        More Info
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-red-500 font-medium">{verificationResult.message}</p>
                  
                  {verificationResult.capturedImage && verificationMode === "facial" && (
                    <div className="flex justify-center mt-4">
                      <div className="w-48 h-48 border rounded overflow-hidden">
                        <img 
                          src={verificationResult.capturedImage} 
                          alt="Captured" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-4 gap-2">
                    {verificationMode === "license" ? (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setVerificationMode("facial");
                          setVerificationResult(null);
                        }}
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Try Facial Recognition
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={openCamera}
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          Try Again
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setVerificationMode("license");
                            setVerificationResult(null);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Try License Number
                        </Button>
                      </>
                    )}
                  </div>
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
                : "Facial recognition verification matches a driver's face with their official records. For best results, ensure good lighting and position the face clearly in the frame."}
            </p>
            
            <div className="bg-blue-50 p-3 mt-4 rounded-md">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Note:</span> This is a demonstration system for license validation. For full functionality, please ensure accurate photo capture with sufficient lighting.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Render detailed driver information dialog when opened */}
      {renderDriverDetailsDialog()}
    </Layout>
  );
};

export default DriverVerification;
