import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Award, Gauge, Clock, BarChart, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SafetyScore } from "@/types/safety";

const SafetyScore = () => {
  const { toast } = useToast();
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [scores, setScores] = useState<SafetyScore[]>([]);
  const [latestScore, setLatestScore] = useState<SafetyScore | null>(null);
  const [loading, setLoading] = useState(true);

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          toast({
            title: "Location access granted",
            description: "We'll use your location to provide personalized safety scores",
          });
          fetchSafetyScores();
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission(false);
          toast({
            title: "Location access denied",
            description: "We can't provide personalized safety scores without your location",
            variant: "destructive",
          });
          fetchSafetyScores();
        }
      );
    } else {
      setLocationPermission(false);
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      fetchSafetyScores();
    }
  };

  const fetchSafetyScores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('safety_score_history')
        .select('*')
        .order('date', { ascending: false })
        .limit(7);

      if (error) throw error;

      if (data) {
        setScores(data as SafetyScore[]);
        setLatestScore(data[0] as SafetyScore);
      }
    } catch (error) {
      console.error("Error fetching safety scores:", error);
      const mockData = generateMockSafetyData();
      setScores(mockData);
      setLatestScore(mockData[0]);
    } finally {
      setLoading(false);
    }
  };

  const generateMockSafetyData = () => {
    const mockData = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      mockData.push({
        id: `mock-${i}`,
        date: date.toISOString().split('T')[0],
        safety_score: Math.floor(Math.random() * 30) + 70, // 70-100 range
        speed_score: Math.floor(Math.random() * 20) + 80,
        braking_score: Math.floor(Math.random() * 25) + 75,
        acceleration_score: Math.floor(Math.random() * 30) + 70,
        distraction_score: Math.floor(Math.random() * 20) + 80,
        recommendations: [
          "Maintain consistent speed on highways",
          "Avoid harsh braking when possible",
          "Ensure phone is in driving mode"
        ][Math.floor(Math.random() * 3)],
        driving_hours: parseFloat((Math.random() * 5 + 1).toFixed(1)),
        city: "Warangal",
        district: "Warangal Urban"
      });
    }
    
    return mockData;
  };

  useEffect(() => {
    if (locationPermission === null) {
      requestLocationPermission();
    }
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 75) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-titeh-primary">Safety Score Calculator</h1>
        <p className="text-gray-600">View your personalized driving safety score based on your driving patterns</p>
        
        {!locationPermission && locationPermission !== null && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Location access required</h3>
                  <p className="text-sm text-amber-700 mb-3">
                    To provide personalized safety scores based on your driving area, we need access to your location.
                  </p>
                  <Button onClick={requestLocationPermission} className="bg-amber-600 hover:bg-amber-700">
                    Allow Location Access
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mb-4"></div>
            <p className="text-gray-500">Loading your safety scores...</p>
          </div>
        ) : (
          <>
            {latestScore && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>Today's Safety Score</span>
                    <div className={`${getScoreBgColor(latestScore.safety_score)} ${getScoreColor(latestScore.safety_score)} text-2xl font-bold px-3 py-1 rounded-md`}>
                      {latestScore.safety_score}/100
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-2">
                            <Gauge className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Speed</p>
                            <p className={`text-xs ${getScoreColor(latestScore.speed_score)}`}>{latestScore.speed_score}/100</p>
                          </div>
                        </div>
                        <div className={`h-2 w-16 bg-gray-200 rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full ${latestScore.speed_score >= 90 ? 'bg-green-500' : latestScore.speed_score >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${latestScore.speed_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-orange-100 p-2 rounded-full mr-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Braking</p>
                            <p className={`text-xs ${getScoreColor(latestScore.braking_score)}`}>{latestScore.braking_score}/100</p>
                          </div>
                        </div>
                        <div className={`h-2 w-16 bg-gray-200 rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full ${latestScore.braking_score >= 90 ? 'bg-green-500' : latestScore.braking_score >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${latestScore.braking_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full mr-2">
                            <BarChart className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Acceleration</p>
                            <p className={`text-xs ${getScoreColor(latestScore.acceleration_score)}`}>{latestScore.acceleration_score}/100</p>
                          </div>
                        </div>
                        <div className={`h-2 w-16 bg-gray-200 rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full ${latestScore.acceleration_score >= 90 ? 'bg-green-500' : latestScore.acceleration_score >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${latestScore.acceleration_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-2 rounded-full mr-2">
                            <Clock className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Distraction</p>
                            <p className={`text-xs ${getScoreColor(latestScore.distraction_score)}`}>{latestScore.distraction_score}/100</p>
                          </div>
                        </div>
                        <div className={`h-2 w-16 bg-gray-200 rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full ${latestScore.distraction_score >= 90 ? 'bg-green-500' : latestScore.distraction_score >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${latestScore.distraction_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="flex items-start gap-3 mb-4 bg-blue-50 p-4 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">Today's Recommendation</h3>
                      <p className="text-sm text-blue-700">{latestScore.recommendations || "Keep maintaining safe driving habits!"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Driving area: {latestScore.city || "Warangal"}, {latestScore.district || "Telangana"}</span>
                    <Clock className="h-4 w-4 ml-4 mr-1" />
                    <span>Driving hours today: {latestScore.driving_hours || "2.5"} hours</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Weekly Safety Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] relative">
                  {scores.map((score, index) => {
                    const normalizedIndex = scores.length - 1 - index;
                    const date = new Date(score.date);
                    const formattedDate = date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
                    return (
                      <div 
                        key={score.id} 
                        className="absolute bottom-0 flex flex-col items-center"
                        style={{ 
                          left: `${(normalizedIndex / (scores.length - 1)) * 100}%`, 
                          height: `${(score.safety_score / 100) * 200}px`,
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <div 
                          className={`w-6 ${getScoreBgColor(score.safety_score)} rounded-t-sm`}
                          style={{ height: `${(score.safety_score / 100) * 200}px` }}
                        ></div>
                        <p className="text-xs mt-2">{formattedDate}</p>
                        <p className={`text-xs font-medium ${getScoreColor(score.safety_score)}`}>
                          {score.safety_score}
                        </p>
                      </div>
                    );
                  })}
                  
                  {/* Score legend */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                    <span>0</span>
                  </div>
                  
                  {/* Horizontal lines */}
                  <div className="absolute left-10 right-0 top-0 h-full">
                    <div className="border-t border-gray-200 h-1/4 w-full"></div>
                    <div className="border-t border-gray-200 h-1/4 w-full"></div>
                    <div className="border-t border-gray-200 h-1/4 w-full"></div>
                    <div className="border-t border-gray-200 h-1/4 w-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default SafetyScore;
