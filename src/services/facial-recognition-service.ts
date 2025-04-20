
// This is a simplified version for demonstration
// In a real app, you'd use a library like face-api.js or OpenCV.js

interface FaceMatchResult {
  matched: boolean;
  confidence: number;
  driverId?: string;
  driverName?: string;
}

class FacialRecognitionService {
  private static instance: FacialRecognitionService;

  private constructor() {}

  public static getInstance(): FacialRecognitionService {
    if (!FacialRecognitionService.instance) {
      FacialRecognitionService.instance = new FacialRecognitionService();
    }
    return FacialRecognitionService.instance;
  }

  // Request camera permissions with enhanced error handling
  public async requestCameraPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      // Stop the stream immediately, we just needed to request permission
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error("Camera permission denied:", error);
      return false;
    }
  }

  // Capture high-resolution image from camera with improved quality
  public async captureImage(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<string | null> {
    try {
      const context = canvasElement.getContext('2d');
      if (!context) return null;
      
      // Set canvas to video dimensions for highest quality capture
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      
      // Draw the current video frame to the canvas with image enhancement
      context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      
      // Apply basic image enhancement (brightness/contrast adjustment)
      const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
      this.enhanceImageQuality(imageData);
      context.putImageData(imageData, 0, 0);
      
      // Get the image data URL at high quality
      const imageDataUrl = canvasElement.toDataURL('image/jpeg', 0.95);
      return imageDataUrl;
    } catch (error) {
      console.error("Error capturing image:", error);
      return null;
    }
  }

  // Simple image enhancement for better face detection
  private enhanceImageQuality(imageData: ImageData): void {
    const data = imageData.data;
    const brightness = 1.1; // Slight brightness increase
    const contrast = 1.2;   // Moderate contrast increase
    
    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness/contrast adjustment to RGB channels
      for (let j = 0; j < 3; j++) {
        data[i + j] = Math.min(255, Math.max(0, 
          contrast * (data[i + j] - 128) + 128 * brightness
        ));
      }
    }
  }

  // Enhanced facial recognition matching with more accurate simulation
  // In a real app, this would use a proper facial recognition API
  public async verifyFace(capturedImageData: string, driverDatabase: any[]): Promise<FaceMatchResult> {
    try {
      if (!capturedImageData) {
        throw new Error("No image data provided");
      }
      
      if (!driverDatabase || driverDatabase.length === 0) {
        throw new Error("Driver database is empty");
      }
      
      console.log(`Verifying face against ${driverDatabase.length} driver records`);
      
      // Simulate face detection preprocessing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sort drivers by license expiration to prioritize active drivers
      const sortedDrivers = [...driverDatabase].sort((a, b) => {
        const aIsValid = a.status === "valid" ? 1 : 0;
        const bIsValid = b.status === "valid" ? 1 : 0;
        return bIsValid - aIsValid;
      });
      
      // Use a driver ID from the URL if available (for demo purposes)
      const urlParams = new URLSearchParams(window.location.search);
      const demoDriverId = urlParams.get('driverId');
      
      if (demoDriverId) {
        const demoDriver = driverDatabase.find(d => d.id === demoDriverId);
        if (demoDriver) {
          // Simulate a high-confidence match for demo purposes
          return {
            matched: true,
            confidence: 98.7,
            driverId: demoDriver.id,
            driverName: demoDriver.name
          };
        }
      }
      
      // Enhanced face matching simulation
      // In real implementation, this would use proper face recognition algorithms
      const randomIndex = Math.floor(Math.random() * sortedDrivers.length);
      const randomDriver = sortedDrivers[randomIndex];
      
      // Create more deterministic results for testing
      const storedDriverName = localStorage.getItem('lastVerifiedDriverName');
      const storedDriverId = localStorage.getItem('lastVerifiedDriverId');
      
      if (storedDriverName && storedDriverId) {
        const matchedDriver = driverDatabase.find(d => d.id === storedDriverId);
        if (matchedDriver) {
          const confidence = 92 + Math.random() * 7; // 92-99% confidence
          
          return {
            matched: true,
            confidence: parseFloat(confidence.toFixed(2)),
            driverId: matchedDriver.id,
            driverName: matchedDriver.name
          };
        }
      }
      
      // Standard random simulation with improved confidence calculation
      const randomConfidence = Math.random() * 100;
      
      // Weight the confidence based on driver status (valid licenses more likely to match)
      const adjustedConfidence = randomDriver.status === "valid" 
        ? randomConfidence * 1.1 
        : randomConfidence * 0.9;
      
      const finalConfidence = Math.min(99.9, adjustedConfidence);
      
      // Simulate match with required 90% confidence threshold for higher accuracy
      if (finalConfidence >= 90) {
        // Store this driver for subsequent verifications to be more consistent
        localStorage.setItem('lastVerifiedDriverName', randomDriver.name);
        localStorage.setItem('lastVerifiedDriverId', randomDriver.id);
        
        return {
          matched: true,
          confidence: parseFloat(finalConfidence.toFixed(2)),
          driverId: randomDriver.id,
          driverName: randomDriver.name
        };
      } else {
        return {
          matched: false,
          confidence: parseFloat(finalConfidence.toFixed(2))
        };
      }
    } catch (error) {
      console.error("Error in facial verification:", error);
      return {
        matched: false,
        confidence: 0
      };
    }
  }

  // For admin login, require 95% confidence with enhanced reliability
  public async verifyAdmin(capturedImageData: string): Promise<FaceMatchResult> {
    try {
      // Simulate API processing time with more realistic timing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate with higher threshold (95%) for admin verification
      const randomConfidence = 85 + (Math.random() * 15);
      
      // For demo purposes, use a consistent admin ID
      const adminId = localStorage.getItem('adminId');
      
      return {
        matched: randomConfidence >= 95,
        confidence: parseFloat(randomConfidence.toFixed(2)),
        driverId: adminId || undefined
      };
    } catch (error) {
      console.error("Error in admin facial verification:", error);
      return {
        matched: false,
        confidence: 0
      };
    }
  }
}

export default FacialRecognitionService.getInstance();
