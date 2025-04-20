
export interface RoadCondition {
  id: string;
  user_id: string;
  location: string;
  condition_type: string;
  description?: string;
  image_url?: string;
  latitude: number;
  longitude: number;
  reported_at: string;
  is_active: boolean;
  upvotes: number;
  city?: string;
  district?: string;
}

export interface SafetyScore {
  id: string;
  user_id: string;
  date: string;
  safety_score: number;
  speed_score?: number;
  braking_score?: number;
  acceleration_score?: number;
  distraction_score?: number;
  recommendations?: string;
  driving_hours?: number;
  city?: string;
  district?: string;
}

export interface VehicleRecall {
  id: string;
  manufacturer: string;
  model: string;
  year_from: number;
  year_to: number;
  recall_reason: string;
  recall_date: string;
  affected_parts?: string[];
  recommended_action: string;
  contact_info?: string;
  city?: string;
  district?: string;
}

// Telangana districts constant for reuse across components
export const TELANGANA_DISTRICTS = [
  "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally",
  "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad",
  "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool",
  "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla",
  "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy",
  "Warangal", "Hanamkonda", "Yadadri Bhuvanagiri"
];

// Modified DriverData interface to explicitly include district and city
export interface DriverData {
  id: string;
  name: string;
  licenseNumber: string;
  validUntil: string;
  vehicleClass: string;
  photoUrl: string;
  status: "valid" | "expired" | "suspended";
  address: string;
  age: string;
  notes: string;
  district: string;
  city: string;
  fingerprint_data?: string;
  
  // Required properties with default values
  blood_type: string;
  created_at: string;
  criminal_record_notes: string;
  criminal_record_status: string;
  date_of_birth: string;
  document_url: string;
  driver_experience_years: number;
  emergency_contact_name: string;
  emergency_phone_number: string;
  endorsements: string[];
  health_conditions: string[];
  height: string;
  last_verification: string;
  license_class: string;
  license_issue_date: string;
  license_points: number;
  license_restrictions: string[];
  organ_donor: boolean;
  phone_number: string;
  previous_offenses: string[];
  profile_image: string;
  restrictions: string[];
  updated_at: string;
  vehicle_color: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_plate: string;
  vehicle_type: string;
  vehicle_year: string;
  verification_status: string;
  weight: string;
}

// Air quality data
export interface AirQualityData {
  id: string;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  city: string;
  district: string;
  location: string;
  latitude: number;
  longitude: number;
  last_updated: string;
  health_recommendations: string;
}

// Weather driving condition type
export interface WeatherDrivingCondition {
  id: string;
  condition: string;
  description: string;
  recommendations: string[];
  severity: "low" | "moderate" | "high" | "extreme";
  icon: string;
  city: string;
  district: string;
  current_temperature?: number;
  humidity?: number;
  wind_speed?: number;
  visibility?: string;
  updated_at: string;
}

// Emergency beacon type
export interface EmergencyBeacon {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  beacon_type: string;
  operational_status: string;
  city: string;
  district: string;
  last_checked: string;
  contact_number?: string;
}

// Interface for WebAuthn credential creation options
export interface AuthenticatorSelectionOptions {
  authenticatorAttachment: "platform" | "cross-platform";
  requireResidentKey: boolean;
  userVerification: "required" | "preferred" | "discouraged";
}
