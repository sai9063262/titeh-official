
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
