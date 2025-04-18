
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  ChevronLeft, 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  BookOpen,
  Check,
  AlertTriangle,
  Info,
  ChevronRight,
  Clock,
  Activity
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const AdaptiveLearning = () => {
  const [userLearningData, setUserLearningData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Mock fetching user's learning data
  useEffect(() => {
    // This would be a Supabase query in a real app
    const fetchUserData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user learning data
      const mockData = {
        overallProgress: 68,
        topicsCompleted: 12,
        totalTopics: 20,
        studyTimeWeek: 4.5, // hours
        weeklyGoal: 5, // hours
        strengths: ["Road Signs", "Traffic Rules", "Lane Discipline"],
        weaknesses: ["Complex Intersections", "Night Driving Rules", "Highway Regulations"],
        recentResults: [85, 72, 90, 68, 75], // percentages
        recommendedTopics: [
          {
            id: 1,
            title: "Complex Intersection Navigation",
            difficulty: "Hard",
            estimatedTime: 30, // minutes
            description: "Learn how to safely navigate complex intersections with multiple lanes and signals.",
            resources: [
              { type: "video", title: "Understanding Multi-lane Intersections", duration: "6:30" },
              { type: "quiz", title: "Intersection Right-of-Way Quiz", questions: 10 },
              { type: "practice", title: "Interactive Intersection Simulator", duration: "15 min" }
            ]
          },
          {
            id: 2,
            title: "Night Driving Safety",
            difficulty: "Medium",
            estimatedTime: 25, // minutes
            description: "Essential safety practices and regulations for driving at night.",
            resources: [
              { type: "reading", title: "Night Driving Visibility Guidelines", pages: 4 },
              { type: "video", title: "Headlight Usage and Regulations", duration: "5:15" },
              { type: "quiz", title: "Night Driving Rules Assessment", questions: 8 }
            ]
          },
          {
            id: 3,
            title: "Highway Merging Techniques",
            difficulty: "Medium",
            estimatedTime: 20, // minutes
            description: "Master safe and efficient highway entry, merging, and exit techniques.",
            resources: [
              { type: "video", title: "Highway Merging Best Practices", duration: "4:45" },
              { type: "practice", title: "Highway Merge Simulator", duration: "10 min" },
              { type: "quiz", title: "Highway Entry/Exit Rules Quiz", questions: 5 }
            ]
          },
          {
            id: 4,
            title: "Emergency Vehicle Protocols",
            difficulty: "Easy",
            estimatedTime: 15, // minutes
            description: "Learn the proper protocols when encountering emergency vehicles on the road.",
            resources: [
              { type: "reading", title: "Emergency Vehicle Right-of-Way", pages: 2 },
              { type: "quiz", title: "Emergency Scenarios Assessment", questions: 7 }
            ]
          },
          {
            id: 5,
            title: "Adverse Weather Driving",
            difficulty: "Hard",
            estimatedTime: 35, // minutes
            description: "Safety techniques for driving in rain, fog, and other adverse weather conditions.",
            resources: [
              { type: "video", title: "Monsoon Driving Safety", duration: "8:20" },
              { type: "reading", title: "Visibility in Fog and Heavy Rain", pages: 3 },
              { type: "quiz", title: "Weather Response Quiz", questions: 12 }
            ]
          }
        ],
        weeklySchedule: [
          { day: "Monday", topics: ["Complex Intersections", "Traffic Signals"], status: "completed" },
          { day: "Tuesday", topics: ["Night Driving"], status: "completed" },
          { day: "Wednesday", topics: ["Highway Rules"], status: "upcoming" },
          { day: "Thursday", topics: ["Emergency Vehicles"], status: "upcoming" },
          { day: "Friday", topics: ["Weather Conditions"], status: "upcoming" },
          { day: "Saturday", topics: ["Review & Practice Test"], status: "upcoming" },
          { day: "Sunday", topics: ["Rest Day"], status: "upcoming" }
        ]
      };
      
      setUserLearningData(mockData);
      setIsLoading(false);
    };
    
    fetchUserData();
  }, []);

  // Start a learning session for a topic
  const startLearningSession = (topicId: number) => {
    const topic = userLearningData.recommendedTopics.find((t: any) => t.id === topicId);
    if (topic) {
      toast({
        title: `Starting ${topic.title}`,
        description: `Preparing your adaptive learning session (${topic.estimatedTime} min)`,
      });
      
      // In a real app, this would navigate to a learning session page
    }
  };

  // If still loading
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/rto-exam" className="mr-2">
              <ChevronLeft className="text-titeh-primary" />
            </Link>
            <h1 className="text-2xl font-bold text-titeh-primary">Adaptive Learning Module</h1>
          </div>
          
          <Card className="p-6 flex justify-center items-center h-60">
            <div className="text-center">
              <Brain className="h-10 w-10 text-titeh-primary mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Analyzing your learning patterns...</p>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Adaptive Learning Module</h1>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Your Personalized Learning Plan</h2>
              <p className="text-sm text-gray-600">
                Based on your performance, we've tailored a study plan to focus on your areas of improvement.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Badge variant="outline" className="bg-blue-50 flex items-center">
                <Brain className="h-4 w-4 text-titeh-primary mr-1" />
                <span>AI-Powered</span>
              </Badge>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Overall Progress</span>
              <span className="font-bold">{userLearningData.overallProgress}%</span>
            </div>
            <Progress value={userLearningData.overallProgress} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{userLearningData.topicsCompleted} of {userLearningData.totalTopics} topics completed</span>
              <span>{userLearningData.studyTimeWeek}/{userLearningData.weeklyGoal} hours this week</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-md p-4">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium">Strengths</h3>
              </div>
              <ul className="mt-2 space-y-1">
                {userLearningData.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-sm flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 rounded-md p-4">
              <div className="flex items-center">
                <TrendingDown className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="font-medium">Areas to Improve</h3>
              </div>
              <ul className="mt-2 space-y-1">
                {userLearningData.weaknesses.map((weakness: string, index: number) => (
                  <li key={index} className="text-sm flex items-center">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 rounded-md p-4">
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-medium">Recent Results</h3>
              </div>
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Last 5 assessments</span>
                  <span className="text-xs font-medium">
                    Avg: {Math.round(userLearningData.recentResults.reduce((a: number, b: number) => a + b, 0) / userLearningData.recentResults.length)}%
                  </span>
                </div>
                <div className="flex h-20 items-end space-x-1">
                  {userLearningData.recentResults.map((result: number, index: number) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className={`w-full rounded-t-sm ${
                          result >= 80 ? 'bg-green-400' : 
                          result >= 70 ? 'bg-blue-400' : 
                          'bg-amber-400'
                        }`} 
                        style={{ height: `${result}%` }}
                      ></div>
                      <span className="text-xs mt-1">{result}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="recommend" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="recommend">
              <Info className="h-4 w-4 mr-2" />
              Recommended Topics
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Clock className="h-4 w-4 mr-2" />
              Weekly Schedule
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Activity className="h-4 w-4 mr-2" />
              Detailed Stats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommend" className="mt-0">
            <div className="space-y-4">
              {userLearningData.recommendedTopics.map((topic: any) => (
                <Card key={topic.id} className="overflow-hidden">
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium">{topic.title}</h3>
                          <Badge 
                            className={`ml-2 ${
                              topic.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                              topic.difficulty === 'Medium' ? 'bg-blue-100 text-blue-800' : 
                              'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {topic.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Estimated time: {topic.estimatedTime} minutes</span>
                        </div>
                        <div className="space-y-2">
                          {topic.resources.map((resource: any, index: number) => (
                            <div key={index} className="flex items-center text-sm">
                              {resource.type === 'video' && <PlayCircle className="h-4 w-4 text-titeh-primary mr-1" />}
                              {resource.type === 'quiz' && <ListCheck className="h-4 w-4 text-titeh-primary mr-1" />}
                              {resource.type === 'reading' && <BookOpen className="h-4 w-4 text-titeh-primary mr-1" />}
                              {resource.type === 'practice' && <Target className="h-4 w-4 text-titeh-primary mr-1" />}
                              <span>{resource.title}</span>
                              {resource.duration && <span className="text-xs text-gray-500 ml-1">({resource.duration})</span>}
                              {resource.questions && <span className="text-xs text-gray-500 ml-1">({resource.questions} questions)</span>}
                              {resource.pages && <span className="text-xs text-gray-500 ml-1">({resource.pages} pages)</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Button 
                          onClick={() => startLearningSession(topic.id)} 
                          className="bg-titeh-primary hover:bg-blue-600"
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          Start Learning
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-0">
            <Card className="p-6">
              <h3 className="font-medium mb-4">Your Weekly Study Plan</h3>
              <div className="space-y-4">
                {userLearningData.weeklySchedule.map((day: any, index: number) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-md ${
                      day.status === 'completed' ? 'bg-green-50 border-green-200' : 
                      'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{day.day}</div>
                      {day.status === 'completed' && (
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      )}
                      {day.status === 'upcoming' && (
                        <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {day.topics.map((topic: string, topicIndex: number) => (
                        <div key={topicIndex} className="flex items-center">
                          {day.status === 'completed' ? (
                            <Check className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-gray-400 mr-1" />
                          )}
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-0">
            <Card className="p-6">
              <h3 className="font-medium mb-4">Learning Performance Statistics</h3>
              <div className="text-center mb-6">
                <p className="text-gray-500">Detailed performance statistics will be available after completing more lessons.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "Detailed statistics and analytics are being developed.",
                    });
                  }}
                >
                  <BarChart2 className="h-4 w-4 mr-1" />
                  View Available Data
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-6">
          <div className="flex items-start">
            <Brain className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">How Adaptive Learning Works</h3>
              <p className="text-sm text-gray-600 mt-1">
                Our AI-powered system analyzes your performance across all learning activities to identify 
                strengths and weaknesses. It then creates a personalized learning path that focuses on 
                the areas where you need the most improvement.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium mb-1">Data Analysis</h4>
                  <p className="text-xs text-gray-600">
                    The system tracks your answers, completion times, and learning patterns
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium mb-1">Topic Prioritization</h4>
                  <p className="text-xs text-gray-600">
                    Content is ordered based on your knowledge gaps and learning needs
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium mb-1">Continuous Adaptation</h4>
                  <p className="text-xs text-gray-600">
                    The system adjusts as you learn, ensuring content remains challenging but achievable
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

const PlayCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="10 8 16 12 10 16 10 8"></polygon>
  </svg>
);

const ListCheck = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="10" y1="6" x2="21" y2="6"></line>
    <line x1="10" y1="12" x2="21" y2="12"></line>
    <line x1="10" y1="18" x2="21" y2="18"></line>
    <path d="M4 6h1l1 2h1l-1.5 2 1.5 2h-1l-1-2h-1"></path>
    <path d="M3 12h2l1 2c-.667.667-1.333 1-2 1-.667 0-1-.333-1-1v-2Z"></path>
    <path d="m3 18 1-2c.667 0 1.333.333 2 1l-1 1h-2Z"></path>
  </svg>
);

const Target = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

export default AdaptiveLearning;
