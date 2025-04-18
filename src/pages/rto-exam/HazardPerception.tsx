
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  ChevronLeft, 
  Eye, 
  Play, 
  Pause, 
  Info, 
  AlertTriangle, 
  Award,
  RotateCcw,
  ChevronRight,
  Clock,
  Activity
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const HazardPerception = () => {
  const [currentClip, setCurrentClip] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [clipDuration, setClipDuration] = useState(15); // seconds
  const [hazardClicked, setHazardClicked] = useState(false);
  const [hazardClickTime, setHazardClickTime] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [completedClips, setCompletedClips] = useState<number[]>([]);
  const videoRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Sample hazard clips
  const hazardClips = [
    {
      id: 1,
      title: "Pedestrian Crossing",
      description: "A pedestrian suddenly enters the road from behind a parked vehicle.",
      hazardTimeFrame: [5, 7], // seconds when the hazard appears and becomes critical
      maxScore: 5,
      thumbnail: "/placeholder.svg", // This would be replaced with actual thumbnail in a real app
      difficulty: "easy"
    },
    {
      id: 2,
      title: "Vehicle Cutting In",
      description: "A car suddenly cuts into your lane without signaling.",
      hazardTimeFrame: [8, 10],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "medium"
    },
    {
      id: 3,
      title: "Traffic Signal Change",
      description: "A traffic light changes from green to amber as you approach.",
      hazardTimeFrame: [6, 8],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "easy"
    },
    {
      id: 4,
      title: "Child Running Into Road",
      description: "A child chasing a ball runs into the road from between parked cars.",
      hazardTimeFrame: [7, 9],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "hard"
    },
    {
      id: 5,
      title: "Vehicle Braking Suddenly",
      description: "The vehicle ahead brakes suddenly due to an obstacle.",
      hazardTimeFrame: [9, 11],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "medium"
    },
    {
      id: 6,
      title: "Cyclist at Junction",
      description: "A cyclist appears at a junction and proceeds without looking.",
      hazardTimeFrame: [4, 6],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "medium"
    },
    {
      id: 7,
      title: "Vehicle Reversing",
      description: "A parked vehicle begins to reverse without warning.",
      hazardTimeFrame: [10, 12],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "easy"
    },
    {
      id: 8,
      title: "Road Worker Entering Lane",
      description: "A road worker steps into the lane from a construction zone.",
      hazardTimeFrame: [8, 10],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "hard"
    },
    {
      id: 9,
      title: "Obscured Junction",
      description: "An approaching junction is partially obscured by foliage.",
      hazardTimeFrame: [6, 8],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "medium"
    },
    {
      id: 10,
      title: "Merging Traffic",
      description: "Heavy traffic merging from a slip road in wet conditions.",
      hazardTimeFrame: [7, 9],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "hard"
    },
    {
      id: 11,
      title: "Animal on Road",
      description: "A dog runs onto the road from a side path.",
      hazardTimeFrame: [5, 7],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "medium"
    },
    {
      id: 12,
      title: "School Zone Activity",
      description: "Children near a school crossing with a distracted crossing guard.",
      hazardTimeFrame: [9, 11],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "hard"
    },
    {
      id: 13,
      title: "Bus Pulling Out",
      description: "A bus signals and begins to pull out from a bus stop.",
      hazardTimeFrame: [6, 8],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "easy"
    },
    {
      id: 14,
      title: "Debris on Road",
      description: "Debris has fallen from a truck onto the road ahead.",
      hazardTimeFrame: [8, 10],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "medium"
    },
    {
      id: 15,
      title: "Night Time Pedestrian",
      description: "A pedestrian in dark clothing crossing at night with poor visibility.",
      hazardTimeFrame: [7, 9],
      maxScore: 5,
      thumbnail: "/placeholder.svg",
      difficulty: "hard"
    }
  ];

  // Timer effect for clip playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          if (prev >= clipDuration) {
            setIsPlaying(false);
            setTimeElapsed(clipDuration);
            showClipResult();
            return clipDuration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, clipDuration]);

  // Play/pause the clip
  const togglePlayback = () => {
    if (timeElapsed >= clipDuration) {
      // Reset and play from beginning
      setTimeElapsed(0);
      setHazardClicked(false);
      setHazardClickTime(null);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Handle clicking on the video to identify hazard
  const handleVideoClick = () => {
    if (!isPlaying || hazardClicked) return;
    
    setHazardClicked(true);
    setHazardClickTime(timeElapsed);
    
    const currentHazard = hazardClips[currentClip];
    const [hazardStart, hazardEnd] = currentHazard.hazardTimeFrame;
    
    // Calculate score based on reaction time
    let clipScore = 0;
    if (timeElapsed < hazardStart) {
      // Too early
      clipScore = 0;
      toast({
        title: "Too Early!",
        description: "You clicked before the hazard appeared.",
        variant: "destructive",
      });
    } else if (timeElapsed <= hazardEnd) {
      // Good timing
      const reactionPercentage = 1 - ((timeElapsed - hazardStart) / (hazardEnd - hazardStart));
      clipScore = Math.round(reactionPercentage * currentHazard.maxScore);
      if (clipScore >= 4) {
        toast({
          title: "Excellent!",
          description: "You spotted the hazard quickly.",
          variant: "default",
        });
      } else if (clipScore >= 2) {
        toast({
          title: "Good!",
          description: "You identified the hazard in time.",
          variant: "default",
        });
      } else {
        toast({
          title: "Spotted!",
          description: "You identified the hazard, but a bit late.",
          variant: "default",
        });
      }
    } else {
      // Too late
      clipScore = 0;
      toast({
        title: "Too Late!",
        description: "You responded after the critical moment.",
        variant: "destructive",
      });
    }
    
    setScore(clipScore);
  };

  // Show result dialog after clip ends
  const showClipResult = () => {
    if (!hazardClicked) {
      toast({
        title: "Hazard Missed!",
        description: "You didn't respond to the hazard in this clip.",
        variant: "destructive",
      });
      setScore(0);
    }
    
    setIsResultDialogOpen(true);
    
    // Mark clip as completed
    if (!completedClips.includes(hazardClips[currentClip].id)) {
      setCompletedClips([...completedClips, hazardClips[currentClip].id]);
    }
  };

  // Move to next clip
  const nextClip = () => {
    if (currentClip < hazardClips.length - 1) {
      setCurrentClip(currentClip + 1);
      resetClip();
      setIsResultDialogOpen(false);
    } else {
      toast({
        title: "All Clips Completed",
        description: "You've reached the end of the hazard perception clips.",
      });
    }
  };

  // Move to previous clip
  const previousClip = () => {
    if (currentClip > 0) {
      setCurrentClip(currentClip - 1);
      resetClip();
      setIsResultDialogOpen(false);
    }
  };

  // Reset the current clip
  const resetClip = () => {
    setTimeElapsed(0);
    setHazardClicked(false);
    setHazardClickTime(null);
    setScore(0);
    setIsPlaying(false);
  };

  // Calculate total score across all completed clips
  const totalScore = completedClips.length * 5; // Maximum possible score
  const userScore = completedClips.filter(id => id !== hazardClips[currentClip].id).length * 3 + score; // Approximate score based on completed clips
  const scorePercentage = totalScore > 0 ? Math.round((userScore / totalScore) * 100) : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Hazard Perception Training</h1>
        </div>

        {showInstructions ? (
          <Card className="p-6 mb-6">
            <div className="flex items-start">
              <Info className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold mb-2">How to Use the Hazard Perception Trainer</h2>
                <p className="text-sm text-gray-600 mb-4">
                  This training helps you identify potential hazards while driving. Here's how it works:
                </p>
                <ol className="list-decimal pl-5 mb-6 space-y-2 text-sm text-gray-600">
                  <li>You'll watch video clips of driving scenarios from a driver's perspective.</li>
                  <li>Click on the video <strong>as soon as you spot a developing hazard</strong> that would cause you to slow down, stop, or change direction.</li>
                  <li>Clicking too early (before the hazard appears) or too late (after it becomes critical) will result in a lower score.</li>
                  <li>Each clip has a maximum score of 5 points. Your reaction time determines your score.</li>
                  <li>Try to achieve the highest total score across all 15 clips.</li>
                </ol>
                <Button 
                  onClick={() => setShowInstructions(false)} 
                  className="bg-titeh-primary hover:bg-blue-600"
                >
                  Start Training
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">
                    {hazardClips[currentClip].title}
                    <Badge 
                      className={`ml-2 ${
                        hazardClips[currentClip].difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                        hazardClips[currentClip].difficulty === 'medium' ? 'bg-blue-100 text-blue-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {hazardClips[currentClip].difficulty.charAt(0).toUpperCase() + hazardClips[currentClip].difficulty.slice(1)}
                    </Badge>
                  </h2>
                  <p className="text-sm text-gray-600">
                    {hazardClips[currentClip].description}
                  </p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetClip}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={previousClip}
                    disabled={currentClip === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={nextClip}
                    disabled={currentClip === hazardClips.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="relative mb-4">
                <div 
                  ref={videoRef}
                  className="w-full aspect-video bg-gray-900 rounded-md cursor-pointer overflow-hidden"
                  onClick={handleVideoClick}
                >
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      {!isPlaying && (
                        <div>
                          <Play className="h-16 w-16 mx-auto mb-2 opacity-70" />
                          <p className="text-sm">Click to play hazard clip</p>
                          <p className="text-xs text-gray-400 mt-1">
                            (Click when you spot a hazard)
                          </p>
                        </div>
                      )}
                      {isPlaying && !hazardClicked && (
                        <div className="animate-pulse">
                          <p className="text-sm">Click when you spot a hazard!</p>
                        </div>
                      )}
                      {isPlaying && hazardClicked && (
                        <div>
                          <Check className="h-16 w-16 mx-auto mb-2 text-green-500" />
                          <p className="text-sm">Hazard clicked!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="bg-black/50 text-white hover:bg-black/70 h-8 w-8 p-0 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayback();
                    }}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {Math.floor(timeElapsed)}.{Math.floor((timeElapsed % 1) * 10)}s / {clipDuration}s
                  </div>
                </div>
              </div>

              <Progress 
                value={(timeElapsed / clipDuration) * 100} 
                className="h-2 mb-4" 
              />

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>
                  Clip {currentClip + 1} of {hazardClips.length}
                </span>
                <span>
                  {completedClips.includes(hazardClips[currentClip].id) ? (
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  ) : (
                    <Badge variant="outline">Not completed</Badge>
                  )}
                </span>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="font-medium">Your Score</h3>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-3xl font-bold">{userScore}/{totalScore}</p>
                  <p className="text-sm text-gray-600">{scorePercentage}% Accuracy</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-titeh-primary mr-2" />
                  <h3 className="font-medium">Clips Completed</h3>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-3xl font-bold">{completedClips.length}/{hazardClips.length}</p>
                  <p className="text-sm text-gray-600">
                    {Math.round((completedClips.length / hazardClips.length) * 100)}% Complete
                  </p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="font-medium">Average Reaction</h3>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-3xl font-bold">1.2s</p>
                  <p className="text-sm text-gray-600">Good reaction time</p>
                </div>
              </Card>
            </div>

            <h2 className="text-lg font-semibold mb-4">All Hazard Clips</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {hazardClips.map((clip, index) => (
                <div 
                  key={clip.id} 
                  className={`cursor-pointer rounded-md overflow-hidden border-2 transition-colors ${
                    currentClip === index ? 'border-titeh-primary' : 
                    completedClips.includes(clip.id) ? 'border-green-300' : 'border-transparent'
                  }`}
                  onClick={() => {
                    setCurrentClip(index);
                    resetClip();
                  }}
                >
                  <div className="aspect-video relative bg-gray-100">
                    <img 
                      src={clip.thumbnail} 
                      alt={clip.title}
                      className="w-full h-full object-cover"
                    />
                    {completedClips.includes(clip.id) && (
                      <div className="absolute top-1 right-1">
                        <div className="bg-green-500 text-white w-4 h-4 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-1 text-center">
                    <p className="text-xs font-medium truncate">{clip.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="p-6">
              <div className="flex items-start">
                <AlertTriangle className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Why Hazard Perception Matters</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Studies show that drivers with good hazard perception skills are up to 25% less likely 
                    to be involved in accidents. Early hazard detection gives you more time to react safely.
                  </p>
                  <Separator className="my-3" />
                  <p className="text-sm text-gray-600">
                    The RTO driving test includes a hazard perception component. Practicing with this trainer 
                    will help you develop the quick scanning and identification skills needed to pass the test 
                    and become a safer driver.
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Result Dialog */}
        <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Clip Result</DialogTitle>
            </DialogHeader>
            
            <div className="mt-2">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  score >= 4 ? 'bg-green-100' : 
                  score >= 1 ? 'bg-blue-100' : 
                  'bg-amber-100'
                }`}>
                  <span className={`text-2xl font-bold ${
                    score >= 4 ? 'text-green-600' : 
                    score >= 1 ? 'text-blue-600' : 
                    'text-amber-600'
                  }`}>{score}</span>
                </div>
                <h3 className="font-medium">{
                  score >= 4 ? 'Excellent reaction!' : 
                  score >= 1 ? 'Good effort!' : 
                  'Needs improvement'
                }</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {hazardClicked 
                    ? `You responded at ${hazardClickTime?.toFixed(1)}s` 
                    : "You didn't respond to the hazard"}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h4 className="font-medium mb-2">Hazard Details</h4>
                <p className="text-sm text-gray-600 mb-2">{hazardClips[currentClip].description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium">Optimal response time:</p>
                    <p className="text-gray-600">{hazardClips[currentClip].hazardTimeFrame[0]}s - {hazardClips[currentClip].hazardTimeFrame[1]}s</p>
                  </div>
                  <div>
                    <p className="font-medium">Your response:</p>
                    <p className={`${
                      !hazardClicked ? 'text-red-500' :
                      score >= 4 ? 'text-green-500' :
                      score >= 1 ? 'text-blue-500' :
                      'text-amber-500'
                    }`}>
                      {hazardClicked ? `${hazardClickTime?.toFixed(1)}s` : "No response"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetClip();
                    setIsResultDialogOpen(false);
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Try Again
                </Button>
                <Button 
                  onClick={() => {
                    nextClip();
                  }}
                  className="bg-titeh-primary hover:bg-blue-600"
                >
                  {currentClip < hazardClips.length - 1 ? (
                    <>
                      Next Clip
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    'Finish Training'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

const Check = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default HazardPerception;
