import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Car, Play, HelpCircle, RefreshCw, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const VirtualSimulator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [score, setScore] = useState(0);
  const [scenario, setScenario] = useState("intersection");
  const [showTutorial, setShowTutorial] = useState(false);
  const [carPosition, setCarPosition] = useState({ x: 150, y: 300 });
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // Initially moving up
  const [speed, setSpeed] = useState(0);
  const { toast } = useToast();

  // Control the car with keyboard
  useEffect(() => {
    if (!isSimulationActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case "ArrowUp":
          setSpeed(prev => Math.min(prev + 1, 5));
          break;
        case "ArrowDown":
          setSpeed(prev => Math.max(prev - 1, 0));
          break;
        case "ArrowLeft":
          setDirection(prev => {
            // Rotate direction vector counterclockwise
            const newX = prev.y;
            const newY = -prev.x;
            return { x: newX, y: newY };
          });
          break;
        case "ArrowRight":
          setDirection(prev => {
            // Rotate direction vector clockwise
            const newX = -prev.y;
            const newY = prev.x;
            return { x: newX, y: newY };
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSimulationActive]);

  // Update car position based on direction and speed
  useEffect(() => {
    if (!isSimulationActive) return;

    const interval = setInterval(() => {
      setCarPosition(prev => {
        const newX = prev.x + direction.x * speed;
        const newY = prev.y + direction.y * speed;

        // Keep the car within the canvas bounds
        const boundedX = Math.max(20, Math.min(newX, 580));
        const boundedY = Math.max(20, Math.min(newY, 380));

        // Check if we hit a boundary, if so update score
        if (boundedX !== newX || boundedY !== newY) {
          setScore(prev => Math.max(0, prev - 5));
          toast({
            title: "Watch out!",
            description: "You hit a boundary! -5 points",
            variant: "destructive",
          });
        }

        return { x: boundedX, y: boundedY };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isSimulationActive, direction, speed, toast]);

  // Draw the simulator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 600, 400);

    // Draw road
    ctx.fillStyle = '#333';
    if (scenario === "intersection") {
      // Horizontal road
      ctx.fillRect(0, 150, 600, 100);
      // Vertical road
      ctx.fillRect(250, 0, 100, 400);
      
      // Road markings
      ctx.setLineDash([20, 10]);
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(0, 200);
      ctx.lineTo(250, 200);
      ctx.moveTo(350, 200);
      ctx.lineTo(600, 200);
      ctx.moveTo(300, 0);
      ctx.lineTo(300, 150);
      ctx.moveTo(300, 250);
      ctx.lineTo(300, 400);
      ctx.stroke();
      
      // Traffic light
      ctx.fillStyle = '#222';
      ctx.fillRect(350, 150, 20, 60);
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(360, 160, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(360, 180, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.arc(360, 200, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (scenario === "roundabout") {
      // Roads leading to roundabout
      ctx.fillRect(0, 150, 600, 100);
      ctx.fillRect(250, 0, 100, 400);
      
      // Roundabout
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.arc(300, 200, 70, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner circle
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.arc(300, 200, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw the car
    ctx.fillStyle = 'blue';
    ctx.save();
    ctx.translate(carPosition.x, carPosition.y);
    ctx.rotate(Math.atan2(direction.y, direction.x));
    
    // Car body
    ctx.fillRect(-15, -8, 30, 16);
    
    // Car windshield
    ctx.fillStyle = '#add8e6';
    ctx.fillRect(5, -6, 5, 12);
    
    ctx.restore();

  }, [scenario, carPosition, direction, isSimulationActive]);

  // Start the simulation
  const startSimulation = () => {
    setIsSimulationActive(true);
    setCarPosition({ x: 150, y: 300 });
    setDirection({ x: 0, y: -1 });
    setSpeed(0);
    setScore(100);
    
    toast({
      title: "Simulation Started",
      description: "Use arrow keys to control the car. Follow traffic rules to maintain your score.",
    });
  };

  // Reset the simulation
  const resetSimulation = () => {
    setIsSimulationActive(false);
    setScore(0);
    
    toast({
      title: "Simulation Reset",
      description: "Press start to begin a new simulation.",
    });
  };

  // Change scenario
  const changeScenario = (newScenario: string) => {
    setScenario(newScenario);
    resetSimulation();
    
    toast({
      title: "Scenario Changed",
      description: `Now practicing in the ${newScenario} scenario.`,
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Virtual Driving Simulator</h1>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Practice Scenario: {scenario.charAt(0).toUpperCase() + scenario.slice(1)}</h2>
              <p className="text-sm text-gray-600">
                Use arrow keys to control the car. Follow traffic rules to maintain your score.
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={() => setShowTutorial(true)}>
                <HelpCircle className="h-4 w-4 mr-1" />
                Tutorial
              </Button>
              {!isSimulationActive ? (
                <Button 
                  onClick={startSimulation} 
                  className="bg-titeh-primary hover:bg-blue-600"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start Simulation
                </Button>
              ) : (
                <Button 
                  onClick={resetSimulation} 
                  variant="destructive"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          <div className="mb-6 p-4 border rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Score</span>
              <div className="flex items-center">
                <Award className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-lg font-bold">{score}</span>
              </div>
            </div>
            <Progress value={score} className="h-3" />
          </div>

          <div className="mb-6 flex overflow-x-auto space-x-2 p-1">
            <Badge 
              className={`cursor-pointer ${scenario === "intersection" ? "bg-titeh-primary" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              onClick={() => changeScenario("intersection")}
            >
              Intersection
            </Badge>
            <Badge 
              className={`cursor-pointer ${scenario === "roundabout" ? "bg-titeh-primary" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              onClick={() => changeScenario("roundabout")}
            >
              Roundabout
            </Badge>
            <Badge 
              className={`cursor-pointer ${scenario === "highway" ? "bg-titeh-primary" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              onClick={() => changeScenario("highway")}
            >
              Highway
            </Badge>
            <Badge 
              className={`cursor-pointer ${scenario === "parking" ? "bg-titeh-primary" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              onClick={() => changeScenario("parking")}
            >
              Parallel Parking
            </Badge>
          </div>

          <div className="w-full flex justify-center mb-4">
            <div className="border rounded-md overflow-hidden">
              <canvas 
                ref={canvasRef} 
                width={600} 
                height={400}
                className="bg-gray-100"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-md text-sm">
            <h3 className="font-medium mb-2">Controls</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="p-2 border rounded-md text-center">
                <p className="font-medium">↑</p>
                <p className="text-xs text-gray-600">Accelerate</p>
              </div>
              <div className="p-2 border rounded-md text-center">
                <p className="font-medium">↓</p>
                <p className="text-xs text-gray-600">Brake</p>
              </div>
              <div className="p-2 border rounded-md text-center">
                <p className="font-medium">←</p>
                <p className="text-xs text-gray-600">Turn Left</p>
              </div>
              <div className="p-2 border rounded-md text-center">
                <p className="font-medium">→</p>
                <p className="text-xs text-gray-600">Turn Right</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start">
            <Car className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Why Practice in a Simulator?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Virtual simulators help you practice traffic rules and decision-making in a safe environment.
                Master the basics here before taking real-world driving lessons.
              </p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium mb-1">Benefits</h4>
                  <ul className="list-disc pl-5 text-xs text-gray-600">
                    <li>Risk-free practice environment</li>
                    <li>Learn traffic rule application</li>
                    <li>Develop decision-making skills</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium mb-1">Scenarios</h4>
                  <ul className="list-disc pl-5 text-xs text-gray-600">
                    <li>Traffic signal navigation</li>
                    <li>Roundabout handling</li>
                    <li>Highway merging</li>
                    <li>Parallel parking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tutorial Dialog */}
        <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Virtual Driving Simulator Tutorial</DialogTitle>
            </DialogHeader>
            
            <div className="mt-2">
              <div className="mb-4">
                <h3 className="font-medium mb-1">How to Drive</h3>
                <p className="text-sm text-gray-600">
                  Use your keyboard's arrow keys to control the car:
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                  <li>Press <span className="font-medium">↑</span> to accelerate</li>
                  <li>Press <span className="font-medium">↓</span> to slow down</li>
                  <li>Press <span className="font-medium">←</span> to turn left</li>
                  <li>Press <span className="font-medium">→</span> to turn right</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-1">Traffic Rules</h3>
                <p className="text-sm text-gray-600">
                  Follow these rules to maintain your score:
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                  <li>Stop at red lights</li>
                  <li>Follow lane markings</li>
                  <li>Yield to traffic when required</li>
                  <li>Maintain safe speed</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Scoring</h3>
                <p className="text-sm text-gray-600">
                  You start with 100 points. Points are deducted for traffic violations:
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                  <li>Running red lights: -20 points</li>
                  <li>Hitting boundaries: -5 points</li>
                  <li>Exceeding speed limit: -10 points</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowTutorial(false)}>Close Tutorial</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default VirtualSimulator;
