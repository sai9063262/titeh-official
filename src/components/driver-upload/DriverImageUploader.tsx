
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Image, Trash, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
// ^ If you have storage for production image uploads, use supabase.
//   For now, all features below are local/temporary as before.
import { validateFaceInImage } from "@/utils/faceDetectionUtils";

interface DriverImageUploaderProps {
  onImageCapture: (imageUrl: string) => void;
  existingImageUrl?: string;
}

const DriverImageUploader = ({ onImageCapture, existingImageUrl }: DriverImageUploaderProps) => {
  const { toast } = useToast();
  const [capturedImage, setCapturedImage] = useState<string | null>(existingImageUrl || null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [faceValidationMsg, setFaceValidationMsg] = useState<string | null>(null);
  const [faceValidationStatus, setFaceValidationStatus] = useState<"success" | "warning" | "error" | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("environment");

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
  }, [capturedImage, isCameraOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: cameraFacingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
      setIsCameraOpen(true);
      toast({
        title: "Camera Activated",
        description: "Position your face clearly in the frame and take the photo.",
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Access Failed",
        description: "Could not access your camera. Please check permissions.",
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
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
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

  // ---------- ENHANCED FACE VALIDATION FUNCTION ----------
  async function runFaceValidation(imageDataUrl: string) {
    setFaceValidationMsg("Assessing image quality and detecting face...");
    setFaceValidationStatus(null);
    try {
      // Simulate async detection and basic feedback
      const { valid, message, status } = await validateFaceInImage(imageDataUrl);
      setFaceValidationMsg(message);
      setFaceValidationStatus(status);
      if (!valid) {
        toast({
          title: "Photo Could Not Be Used",
          description: message,
          variant: "destructive",
        });
      }
      return valid;
    } catch (e) {
      setFaceValidationMsg("An error occurred while verifying the image.");
      setFaceValidationStatus("error");
      return false;
    }
  }

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      // Set canvas dimensions to match video for highest quality
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // Draw the current video frame on the canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.filter = 'contrast(1.1) brightness(1.05)';
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.95);
        // Face validation step
        const isValid = await runFaceValidation(imageDataUrl);
        if (!isValid) return;
        setCapturedImage(imageDataUrl);
        onImageCapture(imageDataUrl);
        stopCamera();
        toast({
          title: "Photo Captured",
          description: "Driver photo has been successfully captured.",
        });
      }
    }
  };

  const deleteImage = () => {
    setCapturedImage(null);
    onImageCapture('');
    setFaceValidationMsg(null);
    setFaceValidationStatus(null);
    toast({
      title: "Photo Deleted",
      description: "Driver photo has been removed.",
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
        if (!isValid) return;
        setCapturedImage(imageDataUrl);
        onImageCapture(imageDataUrl);
        toast({
          title: "Image Uploaded",
          description: "Driver photo has been successfully uploaded.",
        });
      };
      reader.readAsDataURL(file);
    }
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

      {/* ----------- Camera vs Uploaded UI separation ----------- */}
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
            {/* Camera guide overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="h-full w-full flex items-center justify-center">
                <div className="border-2 border-dashed border-white rounded-full w-40 h-40 opacity-50" />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="space-x-2">
              <Button variant="outline" onClick={stopCamera}>
                Cancel
              </Button>
              <Button variant="outline" onClick={switchCamera}>
                Switch Camera
              </Button>
            </div>
            <Button onClick={captureImage} className="bg-titeh-primary">
              <Camera className="h-4 w-4 mr-2" />
              Capture Photo
            </Button>
          </div>
        </div>
      ) : (
        // ----------- NEW: rearranged upload option below the "Take Photo" button and no overlap with other sections ----------- 
        <div className="space-y-2">
          {capturedImage ? (
            <div className="space-y-2">
              <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-gray-300">
                <img 
                  src={capturedImage} 
                  alt="Driver"
                  className="w-full h-full object-cover"
                />
              </div>
              {faceValidationMsg && (
                <div className={`flex items-center px-3 py-2 rounded-md text-xs mb-1
                  ${faceValidationStatus === "success" ? "bg-green-50 text-green-800 border border-green-200" : ""}
                  ${faceValidationStatus === "warning" ? "bg-amber-50 text-amber-900 border border-amber-200" : ""}
                  ${faceValidationStatus === "error" ? "bg-red-50 text-red-700 border border-red-200" : ""}
                `}>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{faceValidationMsg}</span>
                </div>
              )}
              <div className="flex justify-between">
                <Button variant="outline" onClick={deleteImage} className="text-red-500 hover:text-red-700">
                  <Trash className="h-4 w-4 mr-2" />
                  Remove
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={startCamera}>
                    <Camera className="h-4 w-4 mr-2" />
                    Retake
                  </Button>
                  <Button variant="outline" onClick={openFileSelector}>
                    <Upload className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* ---------- First: Camera option ---------- */}
              <div className="flex justify-center items-center w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto text-titeh-primary mb-3" />
                  <Button onClick={startCamera} className="bg-titeh-primary">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                  <div>
                    <p className="mt-1 text-gray-500 text-xs">Use device camera to capture driver's face.</p>
                  </div>
                </div>
              </div>
              {/* ---------- Second: Upload from device (below the camera) ---------- */}
              <div className="flex justify-center items-center w-full h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mt-2">
                <div className="text-center">
                  <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <Button onClick={openFileSelector} variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="mt-1 text-gray-500 text-xs">JPG, PNG or GIF, up to 5MB</p>
                </div>
              </div>
              {/* -------------- Face validation feedback below upload --------------- */}
              {faceValidationMsg && (
                <div className={`flex items-center px-3 py-2 rounded-md text-xs mt-1
                  ${faceValidationStatus === "success" ? "bg-green-50 text-green-800 border border-green-200" : ""}
                  ${faceValidationStatus === "warning" ? "bg-amber-50 text-amber-900 border border-amber-200" : ""}
                  ${faceValidationStatus === "error" ? "bg-red-50 text-red-700 border border-red-200" : ""}
                `}>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{faceValidationMsg}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverImageUploader;

