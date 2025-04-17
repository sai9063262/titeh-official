
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Clock, Check, X, RotateCcw, BookOpen, Info, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import sample questions from ExamData utility
import { mockTestQuestions } from "@/utils/ExamData";

const MockTest = () => {
  const [currentQuestions, setCurrentQuestions] = useState<Array<any>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [showExplanation, setShowExplanation] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const { toast } = useToast();

  // Initialize the exam with 50 random questions when starting
  const startExam = () => {
    const shuffled = [...mockTestQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 50);
    setCurrentQuestions(selected);
    setExamStarted(true);
    setTimeLeft(3600);
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

    // Save progress to Supabase if user is logged in
    saveProgress(optionIndex === currentQuestion.answer);
  };

  // Save progress to Supabase
  const saveProgress = async (isCorrect: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('learning_progress').insert({
          user_id: user.id,
          activity_type: 'mock_test',
          question_id: currentQuestions[currentQuestionIndex].id,
          is_correct: isCorrect,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
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

    // Save final result to Supabase
    saveFinalResult(percentage, passed);
  };

  // Save final result to Supabase
  const saveFinalResult = async (percentage: number, passed: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('mock_test_results').insert({
          user_id: user.id,
          score: percentage,
          passed: passed,
          time_taken: 3600 - timeLeft,
          questions_count: currentQuestions.length,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving final result:', error);
    }
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
            <h1 className="text-2xl font-bold text-titeh-primary">Mock Test Simulator</h1>
          </div>
          
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Full Mock Test (50 Questions)</h2>
            <p className="mb-4">This mock test simulates the real RTO exam environment with 50 random questions from our database. Test your knowledge under exam conditions.</p>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Exam Rules:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>You have 60 minutes to complete the exam</li>
                <li>You need to score at least 80% (40 out of 50) to pass</li>
                <li>Each question has only one correct answer</li>
                <li>You will receive immediate feedback after each question</li>
              </ul>
            </div>
            
            <Button onClick={startExam} className="w-full mt-4 bg-titeh-primary hover:bg-blue-600">
              Start Mock Test
            </Button>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-start">
              <Info className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Why Take a Mock Test?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Taking a full-length mock test helps you:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-2">
                  <li>Build exam endurance</li>
                  <li>Identify knowledge gaps</li>
                  <li>Practice time management</li>
                  <li>Reduce test anxiety</li>
                  <li>Get comfortable with the exam format</li>
                </ul>
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
            <h1 className="text-2xl font-bold text-titeh-primary">Mock Test Results</h1>
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
                  <p className="text-sm">80% (40 correct answers)</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-semibold">Time Taken</p>
                  <p className="text-sm">{Math.floor((3600 - timeLeft) / 60)} minutes</p>
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
          
          <Card className="p-6">
            <div className="flex items-start">
              <AlertTriangle className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Areas to Improve</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Based on your performance, we recommend focusing on the following areas:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-2">
                  <li>Traffic rules and regulations</li>
                  <li>Road signs and signals</li>
                  <li>Defensive driving techniques</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  Review these topics in our Question Bank or take another Mock Test to track your improvement.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // Main exam interface
  const currentQuestion = currentQuestions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/rto-exam" className="mr-2">
              <ChevronLeft className="text-titeh-primary" />
            </Link>
            <h1 className="text-2xl font-bold text-titeh-primary">Mock Test</h1>
          </div>
          <Card className="p-6 mb-6">
            <p>Loading questions...</p>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/rto-exam" className="mr-2">
              <ChevronLeft className="text-titeh-primary" />
            </Link>
            <h1 className="text-2xl font-bold text-titeh-primary">Mock Test</h1>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md">
            <Clock className="text-titeh-primary h-4 w-4" />
            <span className={`font-medium ${timeLeft < 300 ? 'text-red-500' : ''}`}>
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
            {currentQuestion.options.map((option: string, index: number) => (
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

export default MockTest;
