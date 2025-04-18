
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Image, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DriverImageUploaderProps {
  onImageCapture: (imageUrl: string) => void;
  existingImageUrl?: string;
}

const DriverImageUploader = ({ onImageCapture, existingImageUrl }: DriverImageUploaderProps) => {
  const { toast } = useToast();
  const [capturedImage, setCapturedImage] = useState<string | null>(existingImageUrl || null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  
  useEffect(() => {
    // Clean up media stream when component unmounts
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setMediaStream(stream);
      setIsCameraOpen(true);
      
      toast({
        title: "Camera Activated",
        description: "Position your face in the frame and take the photo.",
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
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame on the canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL (base64 encoded image)
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        
        // Set the captured image and pass it to parent component
        setCapturedImage(imageDataUrl);
        onImageCapture(imageDataUrl);
        
        // Stop the camera after capturing
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
    
    toast({
      title: "Photo Deleted",
      description: "Driver photo has been removed.",
    });
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
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
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={stopCamera}>
              Cancel
            </Button>
            <Button onClick={captureImage} className="bg-titeh-primary">
              <Camera className="h-4 w-4 mr-2" />
              Capture Photo
            </Button>
          </div>
        </div>
      ) : capturedImage ? (
        <div className="space-y-4">
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-gray-300">
            <img 
              src={capturedImage} 
              alt="Driver" 
              className="w-full h-full object-cover"
            />
          </div>
          
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
        <div className="space-y-4">
          <div className="flex justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="flex flex-col items-center">
                <Image className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-gray-500 mb-2">No driver photo</p>
                <p className="text-xs text-gray-400 mb-3">JPG, PNG or GIF, up to 5MB</p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button onClick={startCamera} className="bg-titeh-primary">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button onClick={openFileSelector} variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverImageUploader;
