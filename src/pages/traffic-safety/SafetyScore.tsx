
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Award, AlertTriangle } from "lucide-react";
import { SafetyScore } from "@/types/safety";

// Mock data since safety_score_history table doesn't exist yet
const mockSafetyScores: SafetyScore[] = [
  {
    id: "1",
    user_id: "user1",
    date: "2024-01-15",
    safety_score: 85,
    speed_score: 80,
    braking_score: 90,
    acceleration_score: 85,
    distraction_score: 95,
    recommendations: "Maintain steady speed on highways",
    driving_hours: 2.5,
    city: "Warangal",
    district: "Warangal"
  },
  {
    id: "2",
    user_id: "user1", 
    date: "2024-01-14",
    safety_score: 78,
    speed_score: 75,
    braking_score: 85,
    acceleration_score: 80,
    distraction_score: 90,
    recommendations: "Reduce sudden braking incidents",
    driving_hours: 3.2,
    city: "Hyderabad",
    district: "Hyderabad"
  }
];

const SafetyScorePage = () => {
  const [scores, setScores] = useState<SafetyScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using mock data for now since safety_score_history table doesn't exist
    const loadSafetyScores = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setScores(mockSafetyScores);
      } catch (error) {
        console.error("Error loading safety scores:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSafetyScores();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 75) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-titeh-primary">Safety Score</h1>
          <div className="text-center py-8">Loading safety scores...</div>
        </div>
      </Layout>
    );
  }

  const latestScore = scores[0];
  const previousScore = scores[1];
  const trend = latestScore && previousScore 
    ? latestScore.safety_score - previousScore.safety_score 
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-titeh-primary">Safety Score</h1>

        {latestScore && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Safety Score</span>
                {getScoreBadge(latestScore.safety_score)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-4xl font-bold ${getScoreColor(latestScore.safety_score)}`}>
                  {latestScore.safety_score}
                </div>
                <div className="flex items-center gap-1">
                  {trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : trend < 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  ) : null}
                  <span className={`text-sm ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {trend > 0 ? '+' : ''}{trend} from last trip
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Speed Control</p>
                  <div className="flex items-center gap-2">
                    <Progress value={latestScore.speed_score} className="flex-1" />
                    <span className="text-sm font-medium">{latestScore.speed_score}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Braking</p>
                  <div className="flex items-center gap-2">
                    <Progress value={latestScore.braking_score} className="flex-1" />
                    <span className="text-sm font-medium">{latestScore.braking_score}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Acceleration</p>
                  <div className="flex items-center gap-2">
                    <Progress value={latestScore.acceleration_score} className="flex-1" />
                    <span className="text-sm font-medium">{latestScore.acceleration_score}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Focus</p>
                  <div className="flex items-center gap-2">
                    <Progress value={latestScore.distraction_score} className="flex-1" />
                    <span className="text-sm font-medium">{latestScore.distraction_score}%</span>
                  </div>
                </div>
              </div>

              {latestScore.recommendations && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {latestScore.recommendations}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scores.map((score) => (
                <div key={score.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{new Date(score.date).toLocaleDateString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {score.city}, {score.district}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {score.driving_hours}h driving
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getScoreColor(score.safety_score)}`}>
                      {score.safety_score}
                    </div>
                    {getScoreBadge(score.safety_score)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {scores.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No driving data available yet.</p>
              <p className="text-sm text-gray-500 mt-2">Start driving to see your safety score!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SafetyScorePage;
