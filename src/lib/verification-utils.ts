
/**
 * This module simulates facial recognition for driver verification.
 * In a production application, this would be replaced with actual facial recognition API calls.
 */

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

interface MatchResult {
  matched: boolean;
  confidence?: number;
  driver?: DriverData;
}

/**
 * Simulates facial recognition matching against driver database
 * @param drivers Array of driver records to match against
 * @returns Match result with confidence score and matched driver if found
 */
export const facialMatchSimulation = (drivers: DriverData[]): MatchResult => {
  // In a real application, this would be an actual facial recognition algorithm
  // For demo purposes, we'll randomly match with 75% probability
  const shouldMatch = Math.random() < 0.75;
  
  if (shouldMatch && drivers.length > 0) {
    // Select a random driver from the database
    const randomIndex = Math.floor(Math.random() * drivers.length);
    const matchedDriver = drivers[randomIndex];
    
    // Generate a random confidence score between 85% and 99%
    const confidenceScore = 85 + Math.floor(Math.random() * 15);
    
    return {
      matched: true,
      confidence: confidenceScore,
      driver: matchedDriver
    };
  }
  
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
  const normalizedLicense = licenseNumber.trim().toLowerCase();
  
  const matchedDriver = drivers.find(
    driver => driver.licenseNumber.toLowerCase() === normalizedLicense
  );
  
  return matchedDriver || null;
};
