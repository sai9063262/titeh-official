
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
