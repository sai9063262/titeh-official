
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  ChevronLeft, 
  HelpCircle, 
  Check, 
  X, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw,
  Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// For this demo, we'll use a subset of the mock test questions focused on traffic rules
import { mockTestQuestions } from "@/utils/ExamData";

const TrafficQuiz = () => {
  // Get 20 random questions from the mock test questions
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(600); // 10 minutes in seconds
  const { toast } = useToast();

  // Initialize quiz with 20 random questions
  useEffect(() => {
    const shuffled = [...mockTestQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 20);
    setQuizQuestions(selected);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (quizCompleted) return;

    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          completeQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizCompleted]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (answerIndex === currentQuestion.answer) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct!",
        description: currentQuestion.explanation,
      });
    } else {
      toast({
        title: "Incorrect!",
        description: `The correct answer is: ${currentQuestion.options[currentQuestion.answer]}`,
        variant: "destructive",
      });
    }
  };

  // Move to next question
  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeQuiz();
    }
  };

  // Complete quiz and show results
  const completeQuiz = () => {
    setQuizCompleted(true);
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    toast({
      title: "Quiz Completed!",
      description: `Your score: ${percentage}%`,
    });
  };

  // Reset the quiz
  const resetQuiz = () => {
    // Get new set of 20 random questions
    const shuffled = [...mockTestQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 20);
    setQuizQuestions(selected);
    
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setRemainingTime(600);
  };

  // If no questions have been loaded yet
  if (quizQuestions.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/rto-exam" className="mr-2">
              <ChevronLeft className="text-titeh-primary" />
            </Link>
            <h1 className="text-2xl font-bold text-titeh-primary">Traffic Rules Quiz</h1>
          </div>
          <Card className="p-6">
            <p className="text-center">Loading questions...</p>
          </Card>
        </div>
      </Layout>
    );
  }

  // Quiz results screen
  if (quizCompleted) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const isPassed = percentage >= 70;
    
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/rto-exam" className="mr-2">
              <ChevronLeft className="text-titeh-primary" />
            </Link>
            <h1 className="text-2xl font-bold text-titeh-primary">Traffic Rules Quiz</h1>
          </div>
          
          <Card className="p-6 mb-6">
            <div className="text-center mb-6">
              {isPassed ? (
                <div className="mb-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-green-600">Well Done!</h2>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <AlertTriangle className="h-10 w-10 text-amber-500" />
                  </div>
                  <h2 className="text-xl font-bold text-amber-600">Keep Practicing</h2>
                </div>
              )}
              
              <div className="mb-4">
                <p className="text-lg font-medium">Your Score: {percentage}%</p>
                <p className="text-sm text-gray-600">
                  {score} correct out of {quizQuestions.length} questions
                </p>
              </div>
              
              <Progress value={percentage} className="h-4 mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-semibold">Pass Threshold</p>
                  <p className="text-sm">70% (14 correct answers)</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-semibold">Time Taken</p>
                  <p className="text-sm">{Math.floor((600 - remainingTime) / 60)} minutes</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-semibold">Status</p>
                  <p className={`text-sm ${isPassed ? 'text-green-600' : 'text-amber-600'}`}>
                    {isPassed ? 'Passed' : 'Try Again'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={resetQuiz} 
                  className="bg-titeh-primary hover:bg-blue-600"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Take Another Quiz
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-start">
              <Info className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Study Recommendation</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Based on your performance, we recommend focusing on the following areas:
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                  <li>Traffic signal rules and right-of-way</li>
                  <li>Speed limits in different zones</li>
                  <li>Parking regulations</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  Visit our Question Bank for detailed explanations and practice more with our Mock Test Simulator.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // Active quiz
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/rto-exam" className="mr-2">
              <ChevronLeft className="text-titeh-primary" />
            </Link>
            <h1 className="text-2xl font-bold text-titeh-primary">Traffic Rules Quiz</h1>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-md flex items-center">
            <HelpCircle className="h-4 w-4 text-titeh-primary mr-1" />
            <span className={`text-sm font-medium ${remainingTime < 60 ? 'text-red-500' : ''}`}>
              {formatTime(remainingTime)}
            </span>
          </div>
        </div>
        
        <Card className="p-6 mb-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
              <p className="text-sm text-gray-600">Score: {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}</p>
            </div>
            <Progress 
              value={(currentQuestionIndex / quizQuestions.length) * 100} 
              className="h-2" 
            />
          </div>
          
          <h2 className="text-lg font-medium mb-6">{currentQuestion.question}</h2>
          
          <RadioGroup 
            value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
            className="space-y-3 mb-6"
          >
            {currentQuestion.options.map((option: string, index: number) => (
              <div
                key={index}
                className={`rounded-md border p-4 ${
                  isAnswered && index === currentQuestion.answer
                    ? 'bg-green-50 border-green-200'
                    : isAnswered && index === selectedAnswer
                    ? index !== currentQuestion.answer ? 'bg-red-50 border-red-200' : ''
                    : 'hover:bg-gray-50'
                }`}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                  disabled={isAnswered}
                  onClick={() => handleAnswerSelect(index)}
                  className="sr-only"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex items-center cursor-pointer"
                >
                  {isAnswered && index === currentQuestion.answer && (
                    <Check className="text-green-500 mr-2 h-5 w-5" />
                  )}
                  {isAnswered && index === selectedAnswer && index !== currentQuestion.answer && (
                    <X className="text-red-500 mr-2 h-5 w-5" />
                  )}
                  <span>{option}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {isAnswered && (
            <div className={`p-4 rounded-md mb-4 ${
              selectedAnswer === currentQuestion.answer
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className="font-medium mb-1">
                {selectedAnswer === currentQuestion.answer ? 'Correct!' : 'Incorrect!'}
              </p>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
          )}
          
          {isAnswered && (
            <Button 
              onClick={nextQuestion} 
              className="w-full bg-titeh-primary hover:bg-blue-600"
            >
              {currentQuestionIndex < quizQuestions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                'Complete Quiz'
              )}
            </Button>
          )}
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start">
            <HelpCircle className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Traffic Rules Quiz Tips</h3>
              <p className="text-sm text-gray-600 mt-1">
                This quiz focuses on Telangana-specific traffic rules and regulations. Read each question 
                carefully and consider all options before selecting your answer.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                You need to score at least 70% to pass. You can retake the quiz as many times as you need.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default TrafficQuiz;
