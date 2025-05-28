
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera, AlertTriangle, ThumbsUp, Eye } from "lucide-react";
import { RoadCondition } from "@/types/safety";

// Mock data since road_conditions table doesn't exist yet
const mockRoadConditions: RoadCondition[] = [
  {
    id: "1",
    user_id: "user1",
    location: "NH-163 near Warangal Fort",
    condition_type: "Pothole",
    description: "Large pothole causing vehicle damage",
    image_url: "https://via.placeholder.com/300x200",
    latitude: 17.9784,
    longitude: 79.6003,
    reported_at: "2024-01-15T10:30:00Z",
    is_active: true,
    upvotes: 15,
    city: "Warangal",
    district: "Warangal"
  },
  {
    id: "2", 
    user_id: "user2",
    location: "Outer Ring Road, Hyderabad",
    condition_type: "Construction Work",
    description: "Road widening work in progress, traffic diverted",
    latitude: 17.3850,
    longitude: 78.4867,
    reported_at: "2024-01-14T08:15:00Z",
    is_active: true,
    upvotes: 8,
    city: "Hyderabad",
    district: "Hyderabad"
  }
];

const RoadConditionPage = () => {
  const [conditions, setConditions] = useState<RoadCondition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using mock data for now since road_conditions table doesn't exist
    const loadConditions = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConditions(mockRoadConditions);
      } catch (error) {
        console.error("Error loading road conditions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConditions();
  }, []);

  const handleUpvote = (id: string) => {
    setConditions(conditions.map(condition => 
      condition.id === id 
        ? { ...condition, upvotes: condition.upvotes + 1 }
        : condition
    ));
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-titeh-primary">Road Conditions</h1>
          <div className="text-center py-8">Loading road conditions...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-titeh-primary">Road Conditions</h1>
          <Button className="bg-titeh-primary">
            <Camera className="h-4 w-4 mr-2" />
            Report Condition
          </Button>
        </div>

        <div className="grid gap-4">
          {conditions.map((condition) => (
            <Card key={condition.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-titeh-primary" />
                      {condition.location}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={condition.condition_type === "Pothole" ? "destructive" : "secondary"}>
                        {condition.condition_type}
                      </Badge>
                      <Badge variant="outline">
                        {condition.district}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Eye className="h-4 w-4" />
                    Active
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-gray-600 mb-3">{condition.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Reported: {new Date(condition.reported_at).toLocaleDateString()}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpvote(condition.id)}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        {condition.upvotes}
                      </Button>
                    </div>
                  </div>
                  {condition.image_url && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={condition.image_url} 
                        alt="Road condition"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {conditions.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No road conditions reported yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default RoadConditionPage;
