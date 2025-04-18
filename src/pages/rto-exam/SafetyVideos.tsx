
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Video, Play, Eye, CheckCircle, List, Filter, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const SafetyVideos = () => {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample video data
  const safetyVideos = [
    {
      id: 1,
      title: "Dangers of Drunk Driving",
      description: "Learn about the risks of driving under the influence of alcohol and how it affects your driving ability.",
      duration: "3:45",
      thumbnail: "/placeholder.svg",
      category: "prevention",
      viewed: true,
      quizCompleted: true
    },
    {
      id: 2,
      title: "Pedestrian Safety Tips",
      description: "Essential safety practices for pedestrians and how drivers should be aware of pedestrian zones.",
      duration: "2:30",
      thumbnail: "/placeholder.svg",
      category: "awareness",
      viewed: true,
      quizCompleted: false
    },
    {
      id: 3,
      title: "Night Driving Techniques",
      description: "Special techniques for safe driving at night and in low-visibility conditions.",
      duration: "4:15",
      thumbnail: "/placeholder.svg",
      category: "techniques",
      viewed: false,
      quizCompleted: false
    },
    {
      id: 4,
      title: "Two-wheeler Safety",
      description: "Essential safety tips for motorcycle and scooter riders on Indian roads.",
      duration: "3:20",
      thumbnail: "/placeholder.svg",
      category: "techniques",
      viewed: false,
      quizCompleted: false
    },
    {
      id: 5,
      title: "Road Rage Prevention",
      description: "How to manage stress while driving and avoid road rage incidents.",
      duration: "2:50",
      thumbnail: "/placeholder.svg",
      category: "prevention",
      viewed: false,
      quizCompleted: false
    }
  ];

  // Filter videos based on search query and category
  const filteredVideos = safetyVideos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || video.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Sample quiz questions for the selected video
  const quizQuestions = [
    {
      question: "What is the legal blood alcohol limit for driving in Telangana?",
      options: ["0.03%", "0.08%", "0.00%", "0.05%"],
      correctAnswer: 2
    },
    {
      question: "What should you do if you've consumed alcohol?",
      options: [
        "Wait an hour before driving", 
        "Drink coffee to sober up", 
        "Use a designated driver or taxi", 
        "Drive slowly and carefully"
      ],
      correctAnswer: 2
    },
    {
      question: "How does alcohol affect your driving ability?",
      options: [
        "It only affects your reaction time", 
        "It improves focus but slows reactions", 
        "It has no effect if you're below the legal limit", 
        "It impairs judgment, coordination and reaction time"
      ],
      correctAnswer: 3
    },
    {
      question: "What is the penalty for drunk driving in Telangana?",
      options: [
        "₹500 fine only", 
        "₹10,000 fine or imprisonment", 
        "No penalty for first offense", 
        "License suspension for 1 month"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of these is most affected by alcohol consumption?",
      options: [
        "Hearing ability", 
        "Judgment and decision-making", 
        "Sense of smell", 
        "Short-term memory"
      ],
      correctAnswer: 1
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Road Safety Videos</h1>
        </div>

        <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">Visual Learning Resources</h2>
              <p className="text-sm text-gray-600 mb-4 md:mb-0">
                Watch these educational videos to enhance your understanding of road safety practices.
                Complete the quiz after each video to test your knowledge.
              </p>
            </div>
            <div className="flex items-center">
              <Badge className="mr-2 bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>1/5 Completed</span>
              </Badge>
            </div>
          </div>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search videos..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-400 mr-2" />
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="techniques">Driving Techniques</option>
              <option value="awareness">Safety Awareness</option>
              <option value="prevention">Accident Prevention</option>
            </select>
          </div>
        </div>

        <Tabs defaultValue="grid" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="grid">
              <div className="flex items-center">
                <div className="grid grid-cols-2 gap-1 w-4 h-4 mr-2">
                  <div className="bg-current rounded-sm w-1.5 h-1.5"></div>
                  <div className="bg-current rounded-sm w-1.5 h-1.5"></div>
                  <div className="bg-current rounded-sm w-1.5 h-1.5"></div>
                  <div className="bg-current rounded-sm w-1.5 h-1.5"></div>
                </div>
                Grid View
              </div>
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    {video.viewed && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-blue-500">Watched</Badge>
                      </div>
                    )}
                    {video.quizCompleted && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500">Quiz Completed</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="capitalize">
                        {video.category}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-titeh-primary"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <div className="space-y-4">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="p-4 flex flex-col md:flex-row">
                    <div className="md:w-48 relative mb-4 md:mb-0 md:mr-4">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{video.title}</h3>
                        <div className="flex space-x-1">
                          {video.viewed && (
                            <Badge className="bg-blue-500">Watched</Badge>
                          )}
                          {video.quizCompleted && (
                            <Badge className="bg-green-500">Quiz Completed</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="capitalize">
                          {video.category}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredVideos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No videos found for your search criteria.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        <Card className="p-6">
          <div className="flex items-start">
            <Video className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Why Video Learning Matters</h3>
              <p className="text-sm text-gray-600 mt-1">
                Visual learning through videos helps retain information better than text alone. 
                Watching these safety videos can significantly improve your understanding of road rules
                and safe driving practices.
              </p>
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium mb-1">Study Tip</h4>
                <p className="text-xs text-gray-600">
                  After watching each video, take notes on key points and practice answering the quiz 
                  questions. This active learning approach improves retention by up to 70%.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Video Player Dialog */}
        {selectedVideo && (
          <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{selectedVideo.title}</DialogTitle>
              </DialogHeader>
              
              <div className="mt-2">
                <div className="bg-black aspect-video rounded-md flex items-center justify-center mb-4">
                  <div className="text-center text-white">
                    <Play className="h-12 w-12 mx-auto mb-2 opacity-70" />
                    <p className="text-sm">Video player placeholder - In a real app, the video would play here</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">{selectedVideo.description}</p>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Knowledge Check Quiz</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Test your understanding of the video content by answering these 5 questions.
                  </p>
                  
                  <div className="space-y-4">
                    {quizQuestions.map((question, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <p className="font-medium mb-3">Question {index + 1}: {question.question}</p>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div 
                              key={optionIndex}
                              className="flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                            >
                              <div className="h-4 w-4 rounded-full border mr-3 flex items-center justify-center">
                                {optionIndex === question.correctAnswer && (
                                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                )}
                              </div>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    className="bg-titeh-primary hover:bg-blue-600"
                    onClick={() => setSelectedVideo(null)}
                  >
                    Complete & Continue
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default SafetyVideos;
