
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Check, X, AlertTriangle, Clock, Award, BookOpen, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  image?: string;
  category: string;
}

const allQuestions: Question[] = [
  {
    id: 1,
    text: "What does a red traffic light indicate?",
    options: [
      "Slow down",
      "Stop completely",
      "Proceed with caution",
      "Accelerate to cross quickly"
    ],
    correctAnswer: 1,
    explanation: "A red traffic light indicates that you must stop completely behind the stop line.",
    category: "Traffic Signs"
  },
  {
    id: 2,
    text: "What is the maximum speed limit in residential areas?",
    options: [
      "30 km/h",
      "40 km/h",
      "50 km/h",
      "60 km/h"
    ],
    correctAnswer: 1,
    explanation: "The maximum speed limit in residential areas is typically 40 km/h unless otherwise posted.",
    category: "Traffic Rules"
  },
  {
    id: 3,
    text: "When should you use the horn in a residential area?",
    options: [
      "Regularly to alert pedestrians",
      "Only in emergency situations",
      "When passing another vehicle",
      "To greet other drivers"
    ],
    correctAnswer: 1,
    explanation: "You should only use the horn in residential areas in emergency situations to avoid unnecessary noise pollution.",
    category: "Traffic Rules"
  },
  {
    id: 4,
    text: "What does a triangular traffic sign with a red border indicate?",
    options: [
      "Information",
      "Warning",
      "Mandatory instruction",
      "Prohibition"
    ],
    correctAnswer: 1,
    explanation: "A triangular traffic sign with a red border is a warning sign that alerts drivers to potential hazards ahead.",
    category: "Traffic Signs"
  },
  {
    id: 5,
    text: "What is the minimum age to obtain a permanent driving license for a car in India?",
    options: [
      "16 years",
      "18 years",
      "20 years",
      "21 years"
    ],
    correctAnswer: 1,
    explanation: "In India, the minimum age to obtain a permanent driving license for a car (Light Motor Vehicle) is 18 years.",
    category: "License Rules"
  },
  {
    id: 6,
    text: "How long is a learner's license valid?",
    options: [
      "3 months",
      "6 months",
      "1 year",
      "2 years"
    ],
    correctAnswer: 2,
    explanation: "A learner's license is valid for 6 months from the date of issue.",
    category: "License Rules"
  },
  {
    id: 7,
    text: "What should you do if your vehicle breaks down on a highway?",
    options: [
      "Leave it and seek help",
      "Stay inside with hazard lights on",
      "Turn on hazard lights and place warning triangles",
      "Push it to the side of the road yourself"
    ],
    correctAnswer: 2,
    explanation: "If your vehicle breaks down on a highway, you should turn on the hazard lights and place warning triangles behind your vehicle to alert other drivers.",
    category: "Vehicle Safety"
  },
  {
    id: 8,
    text: "What is the validity period of a Pollution Under Control (PUC) certificate?",
    options: [
      "3 months",
      "6 months",
      "1 year",
      "2 years"
    ],
    correctAnswer: 1,
    explanation: "The validity period of a Pollution Under Control (PUC) certificate is 6 months for most vehicles.",
    category: "Vehicle Safety"
  },
  {
    id: 9,
    text: "When approaching a pedestrian crossing with people waiting to cross, you should:",
    options: [
      "Speed up to pass quickly",
      "Stop and allow them to cross",
      "Honk to make them wait",
      "Drive around them"
    ],
    correctAnswer: 1,
    explanation: "When approaching a pedestrian crossing with people waiting to cross, you should stop and allow them to cross safely.",
    category: "Traffic Rules"
  },
  {
    id: 10,
    text: "What does a solid yellow line on the road indicate?",
    options: [
      "Overtaking is allowed",
      "No overtaking from either direction",
      "Overtaking is allowed with caution",
      "Lane change is required"
    ],
    correctAnswer: 1,
    explanation: "A solid yellow line on the road indicates that overtaking or crossing the line is not allowed from either direction.",
    category: "Traffic Rules"
  },
  {
    id: 11,
    text: "Which of these is NOT a valid document that must be carried while driving?",
    options: [
      "Driving License",
      "Vehicle Registration Certificate",
      "Insurance Certificate",
      "Aadhaar Card"
    ],
    correctAnswer: 3,
    explanation: "Aadhaar Card is not mandatory to carry while driving. The essential documents are Driving License, Vehicle Registration Certificate, and Insurance Certificate.",
    category: "License Rules"
  },
  {
    id: 12,
    text: "What is the blood alcohol concentration (BAC) limit for driving in India?",
    options: [
      "0.03%",
      "0.05%",
      "0.08%",
      "0.00%"
    ],
    correctAnswer: 3,
    explanation: "In India, the legal blood alcohol concentration (BAC) limit for driving is 0.00%, which means zero tolerance for drinking and driving.",
    category: "Traffic Rules"
  },
  {
    id: 13,
    text: "What does a round traffic sign with a red border indicate?",
    options: [
      "Warning",
      "Information",
      "Prohibition",
      "Direction"
    ],
    correctAnswer: 2,
    explanation: "A round traffic sign with a red border indicates a prohibition or restriction, such as 'No Entry' or 'No Parking'.",
    category: "Traffic Signs"
  },
  {
    id: 14,
    text: "In case of an accident causing only property damage, within how many days should you report it to the nearest police station?",
    options: [
      "24 hours",
      "48 hours",
      "7 days",
      "30 days"
    ],
    correctAnswer: 0,
    explanation: "In case of an accident causing only property damage, you should report it to the nearest police station within 24 hours.",
    category: "Traffic Rules"
  },
  {
    id: 15,
    text: "When is it appropriate to use high beam headlights?",
    options: [
      "At all times for better visibility",
      "Only on highways with no oncoming traffic",
      "In foggy conditions",
      "When following another vehicle closely"
    ],
    correctAnswer: 1,
    explanation: "High beam headlights should only be used on highways or poorly lit roads when there is no oncoming traffic that could be blinded by the bright light.",
    category: "Vehicle Safety"
  }
];

const Practice = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [examStarted, setExamStarted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Initialize or restart exam
  const startExam = () => {
    // Shuffle questions and select a subset
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers(new Array(10).fill(null));
    setShowResult(false);
    setTimeLeft(900);
    setExamStarted(true);
    setShowExplanation(false);
  };
  
  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };
  
  // Move to next question
  const goToNextQuestion = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedOption;
      setAnswers(newAnswers);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setShowExplanation(false);
      } else {
        // End exam if it's the last question
        finishExam();
      }
    } else {
      toast({
        title: "Select an option",
        description: "Please select an answer before proceeding.",
        variant: "destructive",
      });
    }
  };
  
  // Move to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1]);
      setShowExplanation(false);
    }
  };
  
  // Toggle explanation
  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };
  
  // Finish exam
  const finishExam = () => {
    setShowResult(true);
    setExamStarted(false);
  };
  
  // Calculate score
  const calculateScore = () => {
    let score = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index]?.correctAnswer) {
        score++;
      }
    });
    return score;
  };
  
  // Determine pass or fail
  const isPassed = () => {
    const score = calculateScore();
    return score >= Math.floor(questions.length * 0.7); // 70% to pass
  };
  
  // Timer effect
  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (examStarted && timeLeft === 0) {
      // Time's up
      finishExam();
      toast({
        title: "Time's up!",
        description: "Your exam has been submitted automatically.",
        variant: "default",
      });
    }
  }, [timeLeft, examStarted]);
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Practice Driving License Exam</h1>
        </div>
        
        {!examStarted && !showResult ? (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">RTO Driving License Practice Test</h2>
            <div className="space-y-4">
              <p>This is a practice test to help you prepare for your driving license examination.</p>
              
              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium mb-2">Exam Guidelines:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>The test consists of 10 multiple-choice questions</li>
                  <li>You have 15 minutes to complete the test</li>
                  <li>You need 70% or more to pass (7 out of 10 questions)</li>
                  <li>You can review your answers before submitting</li>
                </ul>
              </div>
              
              <div className="flex justify-center">
                <Button size="lg" onClick={startExam}>
                  Start Practice Exam
                </Button>
              </div>
            </div>
          </Card>
        ) : showResult ? (
          <Card className="p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Exam Results</h2>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-4">
                <span className="text-2xl font-bold">{calculateScore()}/{questions.length}</span>
              </div>
              
              {isPassed() ? (
                <div className="flex flex-col items-center">
                  <Award className="h-12 w-12 text-green-500 mb-2" />
                  <p className="text-xl font-semibold text-green-600 mb-1">Passed!</p>
                  <p className="text-gray-600">Congratulations! You have passed the practice exam.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
                  <p className="text-xl font-semibold text-amber-600 mb-1">Not Passed</p>
                  <p className="text-gray-600">Keep practicing! You need at least 70% to pass.</p>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Question Review:</h3>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="flex items-start justify-between">
                      <span className="font-medium">Question {index + 1}:</span>
                      {answers[index] === question.correctAnswer ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <Check className="h-3 w-3 mr-1" /> Correct
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                          <X className="h-3 w-3 mr-1" /> Incorrect
                        </Badge>
                      )}
                    </div>
                    
                    <p className="my-2">{question.text}</p>
                    
                    <div className="space-y-2 mt-3">
                      {question.options.map((option, optIndex) => (
                        <div 
                          key={optIndex} 
                          className={`p-2 rounded ${
                            optIndex === question.correctAnswer
                              ? 'bg-green-100 border border-green-300'
                              : optIndex === answers[index] && optIndex !== question.correctAnswer
                                ? 'bg-red-100 border border-red-300'
                                : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          {option}
                          {optIndex === question.correctAnswer && (
                            <Check className="h-4 w-4 inline ml-2 text-green-600" />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                      <p className="font-medium">Explanation:</p>
                      <p>{question.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={startExam}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </Card>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <Badge className="px-3 py-1 text-md">
                <Clock className="h-4 w-4 mr-1" /> Time Left: {formatTime(timeLeft)}
              </Badge>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <Progress value={(currentQuestionIndex + 1) / questions.length * 100} className="w-24" />
              </div>
            </div>
            
            <Card className="p-6 mb-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="outline">
                    {questions[currentQuestionIndex]?.category}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={toggleExplanation}>
                    {showExplanation ? "Hide Hint" : "Show Hint"}
                  </Button>
                </div>
                
                <h2 className="text-xl font-semibold mb-3">{questions[currentQuestionIndex]?.text}</h2>
                
                {showExplanation && (
                  <div className="p-3 bg-yellow-50 rounded-md mb-4">
                    <p className="text-sm text-gray-700">{questions[currentQuestionIndex]?.explanation}</p>
                  </div>
                )}
                
                <RadioGroup className="space-y-3 mt-6" value={selectedOption?.toString()}>
                  {questions[currentQuestionIndex]?.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-start space-x-2">
                      <RadioGroupItem 
                        value={optIndex.toString()} 
                        id={`option-${optIndex}`} 
                        onClick={() => handleOptionSelect(optIndex)}
                      />
                      <Label 
                        htmlFor={`option-${optIndex}`} 
                        className="cursor-pointer font-normal"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button onClick={goToNextQuestion}>
                  {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish Exam"}
                </Button>
              </div>
            </Card>
            
            <Card className="p-4 bg-blue-50">
              <div className="flex items-start">
                <BookOpen className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Practice Tip</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Read each question carefully before selecting an answer. If you're unsure, use the
                    process of elimination to narrow down your options. Remember, this is practice to 
                    help you prepare for the actual exam.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Practice;
