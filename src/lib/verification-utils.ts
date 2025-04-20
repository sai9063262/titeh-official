
/**
 * This module simulates facial recognition for driver verification.
 * In a production application, this would be replaced with actual facial recognition API calls.
 */

export type DriverStatus = "valid" | "expired" | "suspended" | "not_found";

export interface DriverData {
  id: string;
  name: string;
  licenseNumber: string;
  validUntil: string;
  vehicleClass: string;
  photoUrl: string;
  status: DriverStatus;
  address?: string;
  age?: string;
  notes?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalConditions?: string[];
  trainingCertificates?: string[];
  documents?: { name: string; url: string; }[];
  district?: string;
  city?: string;
  fingerprint_data?: string;
  
  // These fields are marked optional to maintain compatibility
  blood_type?: string;
  created_at?: string;
  criminal_record_notes?: string;
  criminal_record_status?: string;
  date_of_birth?: string;
  document_url?: string;
  driver_experience_years?: number;
  emergency_phone_number?: string;
  endorsements?: string[];
  health_conditions?: string[];
  height?: string;
  last_verification?: string;
  license_class?: string;
  license_issue_date?: string;
  license_points?: number;
  license_restrictions?: string[];
  organ_donor?: boolean;
  phone_number?: string;
  previous_offenses?: string[];
  profile_image?: string;
  restrictions?: string[];
  updated_at?: string;
  vehicle_color?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_plate?: string;
  vehicle_type?: string;
  vehicle_year?: string;
  verification_status?: string;
  weight?: string;
}

interface MatchResult {
  matched: boolean;
  confidence?: number;
  driver?: DriverData;
}

/**
 * Enhanced facial recognition matching against driver database
 * @param drivers Array of driver records to match against
 * @returns Match result with confidence score and matched driver if found
 */
export const facialMatchSimulation = (drivers: DriverData[]): MatchResult => {
  // For consistent testing, check if we have a stored driver from previous calls
  const storedDriverId = localStorage.getItem('lastVerifiedDriverId');
  
  if (storedDriverId) {
    const storedDriver = drivers.find(d => d.id === storedDriverId);
    if (storedDriver) {
      // 90% chance to match the same driver for consistent testing
      const shouldMatch = Math.random() < 0.9;
      
      if (shouldMatch) {
        // Generate a high confidence score between 92% and 99%
        const confidenceScore = 92 + Math.floor(Math.random() * 7);
        
        return {
          matched: true,
          confidence: confidenceScore,
          driver: storedDriver
        };
      }
    }
  }
  
  // More sophisticated matching logic
  // Active and valid drivers are more likely to match than expired/suspended ones
  const validDrivers = drivers.filter(d => d.status === "valid");
  const otherDrivers = drivers.filter(d => d.status !== "valid");
  
  // 80% chance to match with a valid driver if any exist
  const shouldMatchValidDriver = validDrivers.length > 0 && Math.random() < 0.8;
  
  if (shouldMatchValidDriver) {
    const randomIndex = Math.floor(Math.random() * validDrivers.length);
    const matchedDriver = validDrivers[randomIndex];
    
    // Generate a high confidence score between 90% and 99%
    const confidenceScore = 90 + Math.floor(Math.random() * 10);
    
    // Store this driver ID for consistent future matches
    localStorage.setItem('lastVerifiedDriverId', matchedDriver.id);
    
    return {
      matched: true,
      confidence: confidenceScore,
      driver: matchedDriver
    };
  } else if (otherDrivers.length > 0 && Math.random() < 0.4) {
    // 40% chance to match with a non-valid driver
    const randomIndex = Math.floor(Math.random() * otherDrivers.length);
    const matchedDriver = otherDrivers[randomIndex];
    
    // Generate a medium-high confidence score between 85% and 92%
    const confidenceScore = 85 + Math.floor(Math.random() * 8);
    
    return {
      matched: true,
      confidence: confidenceScore,
      driver: matchedDriver
    };
  }
  
  // No match found
  return {
    matched: false,
    confidence: 30 + Math.floor(Math.random() * 40) // Low confidence score
  };
};

/**
 * Simulates license number validation against driver database
 * @param licenseNumber License number to search for
 * @param drivers Array of driver records to search in
 * @returns Matched driver if found, null otherwise
 */
export const validateLicenseNumber = (licenseNumber: string, drivers: DriverData[]): DriverData | null => {
  if (!licenseNumber || !drivers || drivers.length === 0) {
    console.log("No license number provided or empty driver database");
    return null;
  }
  
  const normalizedLicense = licenseNumber.trim().toLowerCase();
  
  // Debug: log the license being searched and available licenses
  console.log("Searching for license:", normalizedLicense);
  console.log("Available drivers:", drivers.length);
  console.log("License numbers in database:", drivers.map(d => d.licenseNumber.toLowerCase()));
  
  const matchedDriver = drivers.find(
    driver => driver.licenseNumber.toLowerCase() === normalizedLicense
  );
  
  // Debug: log if a match was found
  console.log("Match found:", !!matchedDriver);
  if (matchedDriver) {
    console.log("Matched driver:", matchedDriver);
  }
  
  return matchedDriver || null;
};

/**
 * Check if the browser supports torch (flashlight) functionality
 * @returns Boolean indicating if torch is supported
 */
export const isTorchSupported = async (track: MediaStreamTrack): Promise<boolean> => {
  if (!track) return false;
  
  try {
    const capabilities = track.getCapabilities();
    // The torch capability might not be exposed in the type definitions
    // So we use a type assertion here
    return !!(capabilities as any).torch;
  } catch (error) {
    console.error("Error checking torch support:", error);
    return false;
  }
};

/**
 * Toggle torch/flashlight on a video track
 * @param track Media track to toggle flashlight on
 * @param turnOn Boolean to turn torch on or off
 * @returns Success status
 */
export const toggleTorch = async (track: MediaStreamTrack, turnOn: boolean): Promise<boolean> => {
  if (!track) return false;
  
  try {
    // Apply the torch constraint
    await track.applyConstraints({
      advanced: [{ torch: turnOn } as any]
    });
    return true;
  } catch (error) {
    console.error("Failed to toggle torch:", error);
    return false;
  }
};

/**
 * Convert a File object to a data URL
 * @param file File to convert
 * @returns Promise resolving to a data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Enhanced image quality assessment for better facial recognition
 * @param imageDataUrl The image data URL to analyze
 * @returns Quality score between 0-100
 */
export const assessImageQuality = async (imageDataUrl: string): Promise<number> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Basic quality assessment based on resolution
      const resolution = img.width * img.height;
      let qualityScore = 0;
      
      // Resolution-based quality score (higher is better)
      if (resolution > 1920 * 1080) qualityScore = 90;
      else if (resolution > 1280 * 720) qualityScore = 80;
      else if (resolution > 640 * 480) qualityScore = 70;
      else if (resolution > 320 * 240) qualityScore = 60;
      else qualityScore = 50;
      
      // Add some randomness to simulate more complex quality assessment
      qualityScore += Math.random() * 10 - 5; // +/- 5 points
      
      // Ensure score is between 0-100
      qualityScore = Math.min(100, Math.max(0, qualityScore));
      
      resolve(qualityScore);
    };
    img.onerror = () => resolve(0);
    img.src = imageDataUrl;
  });
};

/**
 * Detect face in image (simulated)
 * @param imageDataUrl The image data URL to analyze
 * @returns Object with detection results
 */
export const detectFace = async (imageDataUrl: string): Promise<{
  faceDetected: boolean;
  faceConfidence?: number;
  faceBox?: { x: number; y: number; width: number; height: number };
}> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 90% chance to detect a face (simulating realistic face detection)
  const faceDetected = Math.random() < 0.9;
  
  if (faceDetected) {
    const confidence = 80 + Math.random() * 20; // 80-100% confidence
    
    // Generate a plausible face bounding box
    const faceBox = {
      x: 0.3 + Math.random() * 0.15, // 30-45% from left
      y: 0.2 + Math.random() * 0.2,  // 20-40% from top
      width: 0.3 + Math.random() * 0.15, // 30-45% of image width
      height: 0.4 + Math.random() * 0.15  // 40-55% of image height
    };
    
    return {
      faceDetected: true,
      faceConfidence: parseFloat(confidence.toFixed(2)),
      faceBox: {
        x: faceBox.x,
        y: faceBox.y,
        width: faceBox.width,
        height: faceBox.height
      }
    };
  }
  
  return { faceDetected: false };
};
