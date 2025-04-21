
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Trash, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateFaceInImage } from "@/utils/faceDetectionUtils";
import FaceMatchButton from "./FaceMatchButton";

interface DriverImageUploaderProps {
  onImageCapture: (imageUrl: string) => void;
  existingImageUrl?: string;
  // Add optional prop for instantly verifying against driver DB
  onFaceMatch?: (result: { matched: boolean; confidence: number; driverName?: string }) => void;
}

const DriverImageUploader = ({
  onImageCapture,
  existingImageUrl,
  onFaceMatch
}: DriverImageUploaderProps) => {
  const { toast } = useToast();
  const [capturedImage, setCapturedImage] = useState<string | null>(existingImageUrl || null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [faceValidationMsg, setFaceValidationMsg] = useState<string | null>(null);
  const [faceValidationStatus, setFaceValidationStatus] = useState<"success" | "warning" | "error" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceBox, setFaceBox] = useState<{x: number, y: number, width: number, height: number} | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("user");

  useEffect(() => {
    // Clean up media stream when component unmounts
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  // Clear face validation message when a new photo is captured/uploaded
  useEffect(() => {
    setFaceValidationMsg(null);
    setFaceValidationStatus(null);
    setFaceBox(null);
  }, [capturedImage, isCameraOpen]);

  const startCamera = async () => {
    try {
      // Request permission with better constraints for face detection
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: cameraFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
      setIsCameraOpen(true);
      toast({
        title: "Camera Activated",
        description: "Position your face clearly in the center of the frame.",
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Access Failed",
        description: "Could not access your camera. Please check permissions or try uploading a photo instead.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setMediaStream(null);
    setIsCameraOpen(false);
  };

  const switchCamera = async () => {
    // Stop the current stream
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    // Toggle the facing mode
    const newMode = cameraFacingMode === "user" ? "environment" : "user";
    setCameraFacingMode(newMode);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: newMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
      toast({
        title: "Camera Switched",
        description: `Now using ${newMode === "user" ? "front" : "back"} camera.`,
      });
    } catch (error) {
      console.error("Error switching camera:", error);
      toast({
        title: "Camera Switch Failed",
        description: "Failed to switch camera. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Enhanced face validation function
  async function runFaceValidation(imageDataUrl: string) {
    setIsProcessing(true);
    setFaceValidationMsg("Analyzing image quality and detecting face...");
    setFaceValidationStatus(null);
    
    try {
      // Use the enhanced validation function
      const validationResult = await validateFaceInImage(imageDataUrl);
      
      setFaceValidationMsg(validationResult.message);
      setFaceValidationStatus(validationResult.status);
      setFaceBox(validationResult.faceBox || null);
      
      if (!validationResult.valid) {
        toast({
          title: "Face Detection Issue",
          description: validationResult.message,
          variant: validationResult.status === "warning" ? "default" : "destructive",
        });
      }
      
      setIsProcessing(false);
      return validationResult.valid;
    } catch (e) {
      console.error("Face validation error:", e);
      setFaceValidationMsg("An error occurred while verifying the image.");
      setFaceValidationStatus("error");
      setIsProcessing(false);
      return false;
    }
  }

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video for highest quality
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame on the canvas with enhancements
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Apply subtle image enhancements for better facial recognition
    ctx.filter = 'contrast(1.1) brightness(1.05)';
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
    
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.92);
    
    // Face validation step
    const isValid = await runFaceValidation(imageDataUrl);
    
    // Proceed even with warnings, but stop on errors
    if (faceValidationStatus === "error") return;
    
    setCapturedImage(imageDataUrl);
    onImageCapture(imageDataUrl);
    
    // Don't stop camera immediately so user can see validation result
    setTimeout(() => {
      if (isValid) {
        stopCamera();
        toast({
          title: "Photo Captured",
          description: "Driver photo has been successfully captured and validated.",
        });
      }
    }, 1500);
  };

  const deleteImage = () => {
    setCapturedImage(null);
    onImageCapture('');
    setFaceValidationMsg(null);
    setFaceValidationStatus(null);
    setFaceBox(null);
    toast({
      title: "Photo Deleted",
      description: "Driver photo has been removed.",
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      
      // Face validation for uploaded photo
      const isValid = await runFaceValidation(imageDataUrl);
      
      // Proceed even with warnings, but stop on errors
      if (faceValidationStatus === "error") return;
      
      setCapturedImage(imageDataUrl);
      onImageCapture(imageDataUrl);
      
      toast({
        title: "Image Uploaded",
        description: isValid 
          ? "Driver photo has been successfully validated." 
          : "Photo uploaded but may have quality issues.",
      });
    };
    reader.readAsDataURL(file);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input for gallery selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Camera view or captured image */}
      {isCameraOpen ? (
        <div className="space-y-4">
          <div className="relative w-full h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            ></video>
            {/* Overlay guide */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="h-full w-full flex items-center justify-center">
                <div className="border-2 border-dashed border-white rounded-full w-40 h-40 opacity-60" />
              </div>
            </div>
          </div>
          {/* Camera controls */}
          <div className="flex justify-between">
            <div className="space-x-2">
              <Button variant="outline" onClick={stopCamera}>
                Cancel
              </Button>
              <Button variant="outline" onClick={switchCamera}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Switch Camera
              </Button>
            </div>
            <Button
              onClick={captureImage}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isProcessing}
            >
              <Camera className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Capture Photo"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* CAMERA BUTTON - First option */}
          <div className="w-full flex flex-col items-center pb-4 border-b border-gray-200">
            <Button
              onClick={startCamera}
              className="mb-2 bg-blue-600 hover:bg-blue-700 w-full"
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
            <p className="text-gray-500 text-xs mb-1">Use device camera to capture driver's face</p>
          </div>
          
          {/* UPLOAD BUTTON - Second option with clear spacing */}
          <div className="w-full flex flex-col items-center pt-2 pb-4 border-b border-gray-200">
            <Button onClick={openFileSelector} variant="outline" className="mb-2 w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
            <p className="text-gray-500 text-xs">
              JPG, PNG or GIF, up to 5MB. Upload a clear photo.
            </p>
          </div>
          
          {/* IMAGE PREVIEW & VERIFICATION BUTTON (if uploaded/captured) */}
          {capturedImage && (
            <div className="space-y-2 pt-2">
              <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-300">
                <img
                  src={capturedImage}
                  alt="Driver"
                  className="w-full h-full object-cover"
                />
                {faceBox && (
                  <div
                    className="absolute border-2 border-green-500 rounded-sm"
                    style={{
                      left: `${faceBox.x * 100}%`,
                      top: `${faceBox.y * 100}%`,
                      width: `${faceBox.width * 100}%`,
                      height: `${faceBox.height * 100}%`
                    }}
                  />
                )}
              </div>
              
              {/* Show validation message */}
              {faceValidationMsg && (
                <div className={`flex items-center px-3 py-2 rounded-md text-sm
                 ${faceValidationStatus === "success" ? "bg-green-50 text-green-800 border border-green-200" : ""}
                 ${faceValidationStatus === "warning" ? "bg-amber-50 text-amber-900 border border-amber-200" : ""}
                 ${faceValidationStatus === "error" ? "bg-red-50 text-red-700 border border-red-200" : ""}
                 ${!faceValidationStatus ? "bg-blue-50 text-blue-800 border border-blue-200" : ""}
               `}>
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{faceValidationMsg}</span>
                </div>
              )}
              
              {/* Use the enhanced FaceMatchButton component */}
              <FaceMatchButton 
                imageDataUrl={capturedImage} 
                onResult={onFaceMatch} 
              />
              
              <div className="flex justify-end mt-2">
                <Button variant="outline" onClick={deleteImage} className="text-red-500 hover:text-red-700">
                  <Trash className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          )}
          
          {/* Processing feedback */}
          {isProcessing && (
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
              Processing image...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverImageUploader;
