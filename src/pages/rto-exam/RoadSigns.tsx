
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Search, Filter, AlertTriangle, Info, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Import sample road signs from ExamData utility
import { roadSigns } from "@/utils/ExamData";

const RoadSigns = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Filter signs based on search query and category
  const filteredSigns = roadSigns.filter((sign) => {
    const matchesSearch = sign.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || sign.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Generate quiz questions from the road signs
  const quizQuestions = roadSigns.map((sign) => ({
    signId: sign.id,
    question: `What does this road sign mean?`,
    options: [
      sign.name,
      ...roadSigns
        .filter(s => s.id !== sign.id && s.category === sign.category)
        .slice(0, 3)
        .map(s => s.name)
    ].sort(() => Math.random() - 0.5),
    correctAnswer: sign.name,
    imageUrl: sign.imageUrl
  }));

  // Get current quiz question
  const currentQuestion = quizMode ? quizQuestions[currentQuizQuestion] : null;
  
  // Handle answering a quiz question
  const handleAnswerSelection = (answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuizQuestion]: answer
    });
    
    // Move to next question or complete quiz
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuizQuestion(currentQuizQuestion + 1);
      }, 1000);
    } else {
      setQuizCompleted(true);
    }
  };
  
  // Calculate quiz score
  const calculateScore = () => {
    let correct = 0;
    Object.keys(userAnswers).forEach(questionIndex => {
      const index = parseInt(questionIndex);
      if (userAnswers[index] === quizQuestions[index].correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: Object.keys(userAnswers).length,
      percentage: Math.round((correct / Object.keys(userAnswers).length) * 100)
    };
  };
  
  // Reset quiz
  const resetQuiz = () => {
    setQuizMode(true);
    setCurrentQuizQuestion(0);
    setUserAnswers({});
    setQuizCompleted(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/rto-exam" className="mr-2">
              <ChevronLeft className="text-titeh-primary" />
            </Link>
            <h1 className="text-2xl font-bold text-titeh-primary">Road Sign Recognition</h1>
          </div>
          {!quizMode && (
            <Button onClick={() => setQuizMode(true)} className="bg-titeh-primary hover:bg-blue-600">
              <Zap className="h-4 w-4 mr-1" />
              Take Quiz
            </Button>
          )}
          {quizMode && (
            <Button onClick={() => setQuizMode(false)} variant="outline">
              Back to Signs
            </Button>
          )}
        </div>

        {!quizMode ? (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search road signs..."
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
                  <option value="regulatory">Regulatory</option>
                  <option value="warning">Warning</option>
                  <option value="information">Information</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredSigns.map((sign) => (
                <Card key={sign.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-center mb-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <img 
                          src={sign.imageUrl} 
                          alt={sign.name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="font-medium text-center mb-2">{sign.name}</h3>
                    <Badge className={`mb-2 ${
                      sign.category === 'regulatory' ? 'bg-red-100 text-red-800' : 
                      sign.category === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {sign.category.charAt(0).toUpperCase() + sign.category.slice(1)}
                    </Badge>
                    <p className="text-sm text-gray-600 mb-3">{sign.description}</p>
                    <Button variant="outline" className="w-full text-xs">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6">
              <div className="flex items-start">
                <AlertTriangle className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Why Road Signs Matter</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Road signs are critical for traffic management and safety. Not recognizing 
                    these signs can result in penalties and dangerous situations on the road.
                  </p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium mb-1">Did you know?</h4>
                    <p className="text-xs text-gray-600">
                      Missing a mandatory road sign can result in penalties ranging from ₹300 to ₹5,000 
                      depending on the severity of the violation.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </>
        ) : quizCompleted ? (
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-1">Quiz Completed!</h2>
              <p className="text-gray-600">You've completed the road sign recognition quiz.</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-center">Your Score</h3>
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-bold">{calculateScore().percentage}%</span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600">
                You got {calculateScore().correct} out of {calculateScore().total} questions correct
              </p>
              <Progress value={calculateScore().percentage} className="h-2 mt-3" />
            </div>
            
            <div className="flex justify-center gap-3">
              <Button onClick={resetQuiz} className="bg-titeh-primary hover:bg-blue-600">
                Try Again
              </Button>
              <Button onClick={() => setQuizMode(false)} variant="outline">
                Review Signs
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium">Question {currentQuizQuestion + 1} of {quizQuestions.length}</h2>
              <Badge variant="outline" className="bg-blue-50">
                {Math.round(((currentQuizQuestion + 1) / quizQuestions.length) * 100)}% Complete
              </Badge>
            </div>
            
            <Progress 
              value={((currentQuizQuestion + 1) / quizQuestions.length) * 100} 
              className="h-2 mb-6" 
            />
            
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <img 
                  src={currentQuestion?.imageUrl} 
                  alt="Road Sign"
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-center mb-6">{currentQuestion?.question}</h3>
            
            <div className="space-y-3 mb-6">
              {currentQuestion?.options.map((option, index) => {
                const isSelected = userAnswers[currentQuizQuestion] === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const showResult = isSelected;
                
                return (
                  <button
                    key={index}
                    className={`w-full p-3 rounded-md border text-left transition-colors ${
                      !showResult ? 'hover:bg-gray-50' : ''
                    } ${
                      showResult && isCorrect ? 'bg-green-100 border-green-300' : 
                      showResult && !isCorrect ? 'bg-red-100 border-red-300' : 
                      'border-gray-300'
                    }`}
                    onClick={() => !userAnswers[currentQuizQuestion] && handleAnswerSelection(option)}
                    disabled={userAnswers[currentQuizQuestion] !== undefined}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {userAnswers[currentQuizQuestion] && (
              <div className={`p-3 rounded-md ${
                userAnswers[currentQuizQuestion] === currentQuestion?.correctAnswer ? 
                'bg-green-50 border border-green-200' : 
                'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start">
                  <Info className={`h-5 w-5 mt-0.5 mr-2 ${
                    userAnswers[currentQuizQuestion] === currentQuestion?.correctAnswer ? 
                    'text-green-500' : 'text-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">
                      {userAnswers[currentQuizQuestion] === currentQuestion?.correctAnswer ? 
                        'Correct!' : 'Incorrect!'}
                    </p>
                    <p className="text-sm">
                      {userAnswers[currentQuizQuestion] === currentQuestion?.correctAnswer ? 
                        'Well done! You correctly identified this road sign.' : 
                        `The correct answer is: ${currentQuestion?.correctAnswer}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default RoadSigns;
