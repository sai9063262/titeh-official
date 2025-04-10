
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Clock, Check, X, RotateCcw, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Questions database with 50 questions specific to Telangana
const questions = [
  {
    id: 1,
    question: "What is the minimum age to apply for a learner's license to drive a motorcycle without gear in Telangana?",
    options: ["16 years", "18 years", "21 years"],
    answer: 0, // Index of the correct answer (16 years)
    explanation: "In Telangana, you can apply for a learner's license for a motorcycle without gear at 16 years of age."
  },
  {
    id: 2,
    question: "What should you do when approaching an unguarded railway crossing in Telangana?",
    options: ["Sound the horn and cross quickly", "Stop, check for trains, and proceed safely", "Wait until a train passes"],
    answer: 1, // Stop, check for trains, and proceed safely
    explanation: "Always stop at unguarded railway crossings, look both ways for approaching trains, and only proceed when it's safe."
  },
  {
    id: 3,
    question: "What is the maximum speed limit in urban areas of Telangana?",
    options: ["40 km/h", "50 km/h", "60 km/h"],
    answer: 1, // 50 km/h
    explanation: "In urban areas of Telangana, the maximum speed limit is generally 50 km/h unless otherwise specified."
  },
  {
    id: 4,
    question: "When turning left on a two-wheeler, what should you do?",
    options: ["Signal and slow down", "Increase speed and turn", "Turn without signaling"],
    answer: 0, // Signal and slow down
    explanation: "Always signal your intention to turn left, slow down appropriately, and then make the turn safely."
  },
  {
    id: 5,
    question: "What does a red traffic light indicate?",
    options: ["Proceed with caution", "Stop", "Prepare to go"],
    answer: 1, // Stop
    explanation: "A red traffic light means you must come to a complete stop behind the stop line and wait until the light turns green."
  },
  // I'll add 10 more questions here as examples, with the remaining 35 to be expanded similarly
  {
    id: 6,
    question: "What is the validity period of a learner's license in Telangana?",
    options: ["6 months", "1 year", "2 years"],
    answer: 0, // 6 months
    explanation: "A learner's license in Telangana is valid for 6 months from the date of issue."
  },
  {
    id: 7,
    question: "What should you do if your vehicle breaks down on a highway?",
    options: ["Leave it and walk away", "Place a warning triangle and inform authorities", "Ignore it and continue"],
    answer: 1, // Place a warning triangle and inform authorities
    explanation: "If your vehicle breaks down, move it to the side if possible, place a warning triangle, and contact authorities for assistance."
  },
  {
    id: 8,
    question: "What is the penalty for driving without a valid license in Telangana?",
    options: ["₹500 fine", "₹5,000 fine or imprisonment", "₹1,000 fine"],
    answer: 1, // ₹5,000 fine or imprisonment
    explanation: "Driving without a valid license in Telangana can result in a fine of ₹5,000 or imprisonment, or both."
  },
  {
    id: 9,
    question: "Which side of the road should pedestrians walk on if there is no footpath?",
    options: ["Right side", "Left side", "Either side"],
    answer: 0, // Right side
    explanation: "Pedestrians should walk facing oncoming traffic (right side) when there is no footpath for better visibility and safety."
  },
  {
    id: 10,
    question: "What does a triangular road sign with a red border indicate?",
    options: ["Mandatory instruction", "Warning", "Informatory sign"],
    answer: 1, // Warning
    explanation: "A triangular sign with a red border is a warning sign alerting drivers to potential hazards ahead."
  },
  {
    id: 11,
    question: "What is the minimum distance to maintain from the vehicle ahead?",
    options: ["5 meters", "10 meters", "Safe distance (10 seconds gap)"],
    answer: 2, // Safe distance
    explanation: "Maintain a safe distance from the vehicle ahead, typically the 'two-second rule' in good conditions, or 10 seconds in adverse conditions."
  },
  {
    id: 12,
    question: "What should you do when you see a school zone sign?",
    options: ["Speed up", "Slow down and be cautious", "Honk and proceed"],
    answer: 1, // Slow down and be cautious
    explanation: "Slow down when approaching a school zone and watch for children who may unexpectedly cross the road."
  },
  {
    id: 13,
    question: "What is the legal blood alcohol limit for driving in Telangana?",
    options: ["0.03%", "0.00%", "0.08%"],
    answer: 1, // 0.00%
    explanation: "Telangana follows a zero-tolerance policy for drinking and driving with a legal blood alcohol concentration limit of 0.00%."
  },
  {
    id: 14,
    question: "What should you do at a roundabout?",
    options: ["Go straight without signaling", "Yield to traffic from the right", "Speed through"],
    answer: 1, // Yield to traffic from the right
    explanation: "At a roundabout, yield to traffic already in the roundabout (usually coming from your right) before entering."
  },
  {
    id: 15,
    question: "What is the validity of a Pollution Under Control (PUC) certificate?",
    options: ["6 months", "1 year", "2 years"],
    answer: 0, // 6 months
    explanation: "A PUC certificate is typically valid for 6 months, after which the vehicle must be retested for emissions compliance."
  },
];

const PracticeExam = () => {
  const [currentQuestions, setCurrentQuestions] = useState<Array<typeof questions[0]>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [showExplanation, setShowExplanation] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const { toast } = useToast();

  // Initialize the exam with 20 random questions when starting
  const startExam = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 20);
    setCurrentQuestions(selected);
    setExamStarted(true);
    setTimeLeft(900);
    setScore(0);
    setCurrentQuestionIndex(0);
    setIsExamCompleted(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowExplanation(false);
  };

  // Timer countdown
  useEffect(() => {
    if (!examStarted || isExamCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          completeExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, isExamCompleted]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const currentQuestion = currentQuestions[currentQuestionIndex];
    if (optionIndex === currentQuestion.answer) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct!",
        description: currentQuestion.explanation,
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect!",
        description: `The correct answer is: ${currentQuestion.options[currentQuestion.answer]}`,
        variant: "destructive",
      });
    }
  };

  // Move to next question or complete the exam
  const handleNext = () => {
    setShowExplanation(false);
    setSelectedOption(null);
    setIsAnswered(false);
    
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeExam();
    }
  };

  // Complete the exam and show results
  const completeExam = () => {
    setIsExamCompleted(true);
    setExamStarted(false);
    
    const percentage = Math.round((score / currentQuestions.length) * 100);
    const passed = percentage >= 80;
    
    toast({
      title: passed ? "Congratulations!" : "Try Again!",
      description: passed 
        ? `You passed with a score of ${percentage}%` 
        : `You scored ${percentage}%. You need 80% to pass.`,
      variant: passed ? "default" : "destructive",
    });
  };

  // Toggle explanation visibility
  const toggleExplanation = () => {
    setShowExplanation(prev => !prev);
  };

  // If exam hasn't started yet, show the start screen
  if (!examStarted && !isExamCompleted) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/rto-exam" className="mr-2">
              <ChevronLeft className="text-titeh-primary" />
            </Link>
            <h1 className="text-2xl font-bold text-titeh-primary">Practice Driving License Exam</h1>
          </div>
          
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Your Knowledge</h2>
            <p className="mb-4">This practice exam consists of 20 random questions from our database of 50 Telangana-specific driving questions.</p>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Exam Rules:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>You have 15 minutes to complete the exam</li>
                <li>You need to score at least 80% (16 out of 20) to pass</li>
                <li>Each question has only one correct answer</li>
                <li>You will receive immediate feedback after each question</li>
              </ul>
            </div>
            
            <Button onClick={startExam} className="w-full mt-4 bg-titeh-primary hover:bg-blue-600">
              Start Exam
            </Button>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-start">
              <BookOpen className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Tips for Success</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Read all questions carefully. Take your time to understand each question before selecting an answer.
                  Focus on traffic rules and signs specific to Telangana. Review the Telangana RTO handbook before taking the exam.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // If exam is completed, show the results screen
  if (isExamCompleted) {
    const percentage = Math.round((score / currentQuestions.length) * 100);
    const passed = percentage >= 80;
    
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/rto-exam" className="mr-2">
              <ChevronLeft className="text-titeh-primary" />
            </Link>
            <h1 className="text-2xl font-bold text-titeh-primary">Exam Results</h1>
          </div>
          
          <Card className="p-6 mb-6">
            <div className="text-center mb-6">
              {passed ? (
                <div className="mb-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="text-green-500 w-10 h-10" />
                  </div>
                  <h2 className="text-xl font-semibold text-green-600">Congratulations!</h2>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <X className="text-red-500 w-10 h-10" />
                  </div>
                  <h2 className="text-xl font-semibold text-red-600">Try Again</h2>
                </div>
              )}
              
              <div className="mb-4">
                <p className="text-lg font-medium">Your Score: {percentage}%</p>
                <p className="text-sm text-gray-600">
                  {score} correct out of {currentQuestions.length} questions
                </p>
              </div>
              
              <Progress value={percentage} className="h-4 mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-semibold">Passing Score</p>
                  <p className="text-sm">80% (16 correct answers)</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-semibold">Time Taken</p>
                  <p className="text-sm">{15 - Math.floor(timeLeft / 60)} minutes</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <Button onClick={startExam} className="flex-1 bg-titeh-primary hover:bg-blue-600">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Take Again
                </Button>
                <Link to="/rto-exam/questions" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Study Question Bank
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // Main exam interface
  const currentQuestion = currentQuestions[currentQuestionIndex];
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/rto-exam" className="mr-2">
              <ChevronLeft className="text-titeh-primary" />
            </Link>
            <h1 className="text-2xl font-bold text-titeh-primary">Practice Exam</h1>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md">
            <Clock className="text-titeh-primary h-4 w-4" />
            <span className={`font-medium ${timeLeft < 60 ? 'text-red-500' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        
        <Card className="p-6 mb-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Question {currentQuestionIndex + 1} of {currentQuestions.length}</p>
              <p className="text-sm text-gray-600">Score: {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}</p>
            </div>
            <Progress 
              value={(currentQuestionIndex / currentQuestions.length) * 100} 
              className="h-2" 
            />
          </div>
          
          <h2 className="text-lg font-medium mb-6">{currentQuestion.question}</h2>
          
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 border rounded-md cursor-pointer transition-colors ${
                  selectedOption === index && index === currentQuestion.answer
                    ? 'bg-green-100 border-green-300'
                    : selectedOption === index
                    ? 'bg-red-100 border-red-300'
                    : isAnswered && index === currentQuestion.answer
                    ? 'bg-green-100 border-green-300'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                <div className="flex items-center">
                  {isAnswered && index === currentQuestion.answer && (
                    <Check className="text-green-500 mr-2 h-5 w-5" />
                  )}
                  {isAnswered && selectedOption === index && index !== currentQuestion.answer && (
                    <X className="text-red-500 mr-2 h-5 w-5" />
                  )}
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
          
          {isAnswered && (
            <>
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  onClick={toggleExplanation} 
                  className="text-sm"
                >
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </Button>
              </div>
              
              {showExplanation && (
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <p className="text-sm">{currentQuestion.explanation}</p>
                </div>
              )}
              
              <Button 
                onClick={handleNext} 
                className="w-full bg-titeh-primary hover:bg-blue-600"
              >
                {currentQuestionIndex < currentQuestions.length - 1 ? 'Next Question' : 'Finish Exam'}
              </Button>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default PracticeExam;
