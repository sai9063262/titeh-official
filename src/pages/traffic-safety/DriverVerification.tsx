import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, UserCheck, Scan, RefreshCw, AlertCircle, CheckCircle, X, Info, Shield, FileSpreadsheet, MapPin, Smartphone, Loader2 } from "lucide-react";
import FlashLight from "@/components/icons/FlashLight";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { facialMatchSimulation } from "@/lib/verification-utils";

interface DriverData {
  id: string;
  name: string;
  licenseNumber: string;
  validUntil: string;
  vehicleClass: string;
  photoUrl: string;
  status: "valid" | "expired" | "suspended" | "not_found";
  address?: string;
  age?: string;
  notes?: string;
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
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [facing, setFacing] = useState<"user" | "environment">("environment");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isLicenseValidating, setIsLicenseValidating] = useState(false);
  const [licenseValidationResult, setLicenseValidationResult] = useState<DriverData | null>(null);
  const [manualSearch, setManualSearch] = useState("");
  const [matchFound, setMatchFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allDrivers, setAllDrivers] = useState<DriverData[]>([
    {
      id: "drv-1",
      name: "John Doe",
      licenseNumber: "DL1234567890",
      validUntil: "2025-12-31",
      vehicleClass: "LMV",
      photoUrl: "/placeholder.svg",
      status: "valid",
      address: "123 Main St",
      age: "35",
      notes: "No violations"
    },
    {
      id: "drv-2",
      name: "Jane Smith",
      licenseNumber: "DL0987654321",
      validUntil: "2024-06-30",
      vehicleClass: "MCWG",
      photoUrl: "/placeholder.svg",
      status: "expired",
      address: "456 Oak Ave",
      age: "28",
      notes: "Expired license"
    },
    {
      id: "drv-3",
      name: "Alice Johnson",
      licenseNumber: "DL5678901234",
      validUntil: "2026-03-15",
      vehicleClass: "HMV",
      photoUrl: "/placeholder.svg",
      status: "suspended",
      address: "789 Pine Ln",
      age: "42",
      notes: "License suspended due to traffic violations"
    }
  ]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const enableCamera = async () => {
    try {
      setIsCameraLoading(true);
      setCameraError(null);
      
      const constraints: MediaStreamConstraints = {
        video: { 
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        
        if (facing === "environment") {
          try {
            const track = mediaStream.getVideoTracks()[0];
            if (track && typeof track.applyConstraints === 'function') {
              await track.applyConstraints({
                advanced: [{ torch: isFlashlightOn }] as any
              });
            }
          } catch (flashlightError) {
            console.error("Flashlight access error:", flashlightError);
          }
        }
      }
      
      setIsCameraLoading(false);
      
      toast({
        title: "Camera Access Granted",
        description: `${facing === "user" ? "Front" : "Back"} camera is now active`,
      });
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Could not access camera");
      setIsCameraLoading(false);
      
      toast({
        title: "Camera Access Failed",
        description: "Could not access camera. Check permissions.",
        variant: "destructive",
      });
    }
  };

  const toggleFlashlight = async () => {
    if (!stream || facing !== "environment") return;
    
    try {
      const track = stream.getVideoTracks()[0];
      if (track && typeof track.applyConstraints === 'function') {
        const newFlashlightState = !isFlashlightOn;
        
        await track.applyConstraints({
          advanced: [{ torch: newFlashlightState }] as any
        });
        
        setIsFlashlightOn(newFlashlightState);
        
        toast({
          title: newFlashlightState ? "Night Vision Activated" : "Night Vision Deactivated",
          description: newFlashlightState ? "Flashlight turned on" : "Flashlight turned off",
        });
      }
    } catch (err) {
      console.error("Error toggling flashlight:", err);
      toast({
        title: "Flashlight Unavailable",
        description: "This device doesn't support flashlight control",
        variant: "destructive",
      });
    }
  };

  const toggleCameraFacing = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    setFacing(prev => prev === "user" ? "environment" : "user");
    setIsFlashlightOn(false);
    
    setTimeout(() => {
      enableCamera();
    }, 300);
  };

  const captureAndVerify = async () => {
    if (videoRef.current && canvasRef.current && stream) {
      setIsVerifying(true);
      setVerificationResult(null);
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        const matchResult = facialMatchSimulation(allDrivers);
        
        if (matchResult.matched && matchResult.confidence && matchResult.driver) {
          setVerificationResult({
            ...matchResult,
            imageDataUrl
          });
          
          toast({
            title: "Driver Verified",
            description: `Facial match: ${matchResult.driver.name} (Confidence: ${matchResult.confidence}%)`,
          });
        } else {
          setVerificationResult({
            matched: false,
            confidence: matchResult.confidence,
            imageDataUrl
          });
          
          toast({
            title: "Driver Verification Failed",
            description: `No facial match found (Confidence: ${matchResult.confidence}%)`,
            variant: "destructive",
          });
        }
      }
      
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
    setCameraError(null);
  };

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
      const foundDriver = allDrivers.find(
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Driver Verification</h1>
        
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="text-titeh-primary mr-2" />
            License Validation
          </h2>
          <div className="flex flex-col md:flex-row gap-2">
            <Input 
              placeholder="Enter License Number (e.g., DL1234567890)" 
              className="flex-1"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
            <Button 
              onClick={handleManualSearch} 
              className="bg-titeh-primary hover:bg-blue-600"
              disabled={isLicenseValidating}
            >
              {isLicenseValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Validate
                </>
              )}
            </Button>
          </div>
          
          {licenseValidationResult && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                License is valid and belongs to: {licenseValidationResult.name}
              </p>
            </div>
          )}
        </Card>
        
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Camera className="text-titeh-primary mr-2" />
            Facial Recognition
          </h2>
          
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Initiate facial recognition to verify the driver's identity.
            </p>
            <Button 
              onClick={() => setIsCameraOpen(true)} 
              className="bg-titeh-primary hover:bg-blue-600"
              disabled={isCameraOpen}
            >
              <Scan className="mr-2 h-4 w-4" />
              Open Camera
            </Button>
          </div>
          
          {cameraError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                <AlertCircle className="mr-2 h-4 w-4 inline-block align-middle" />
                {cameraError}
              </p>
            </div>
          )}
          
          {verificationResult && (
            <div className="mt-4">
              {verificationResult.matched ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <p className="text-sm text-green-700 font-medium">
                      Driver Verified: {verificationResult.driver.name}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <img 
                      src={verificationResult.imageDataUrl} 
                      alt="Captured Driver" 
                      className="w-24 h-24 object-cover rounded-md mr-4" 
                    />
                    <div>
                      <p className="text-xs text-gray-600">
                        Confidence: {verificationResult.confidence}%
                      </p>
                      <p className="text-xs text-gray-600">
                        License Number: {verificationResult.driver.licenseNumber}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-700 font-medium">
                      Driver Verification Failed
                    </p>
                  </div>
                  <div className="flex items-center">
                    <img 
                      src={verificationResult.imageDataUrl} 
                      alt="Captured Driver" 
                      className="w-24 h-24 object-cover rounded-md mr-4" 
                    />
                    <p className="text-xs text-gray-600">
                      No match found (Confidence: {verificationResult.confidence}%)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
        
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-medium">Capture Driver Photo</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500" 
                  onClick={closeCamera}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="relative">
                {isCameraLoading ? (
                  <div className="w-full h-64 flex items-center justify-center">
                    <Loader2 className="animate-spin text-titeh-primary" size={48} />
                  </div>
                ) : (
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline
                    className="w-full h-64 object-cover"
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        videoRef.current.play();
                      }
                    }}
                  />
                )}
                
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                  {facing === "user" ? "Front Camera" : "Back Camera"}
                </div>
                
                {facing === "environment" && (
                  <div className={`absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs ${isFlashlightOn ? 'text-yellow-300' : 'text-white'}`}>
                    {isFlashlightOn ? 'Flashlight ON' : 'Flashlight OFF'}
                  </div>
                )}
              </div>
              
              <div className="p-4 flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={toggleCameraFacing}
                  className="flex-1"
                  disabled={isCameraLoading}
                >
                  <Camera className="h-4 w-4 mr-1" />
                  Switch Camera
                </Button>
                
                {facing === "environment" && (
                  <Button 
                    variant="outline" 
                    onClick={toggleFlashlight}
                    className={`flex-1 ${isFlashlightOn ? 'bg-yellow-50 border-yellow-300' : ''}`}
                    disabled={isCameraLoading}
                  >
                    <FlashLight className={`h-4 w-4 mr-1 ${isFlashlightOn ? 'text-yellow-500' : ''}`} />
                    {isFlashlightOn ? 'Turn Off Light' : 'Turn On Light'}
                  </Button>
                )}
                
                <Button 
                  className="flex-1 bg-titeh-primary"
                  onClick={captureAndVerify}
                  disabled={isVerifying || isCameraLoading}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-1" />
                      Capture & Verify
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-600 italic mt-4">
          <p>
            Note: This feature uses simulated facial recognition and license validation.
            For demonstration purposes only.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DriverVerification;
