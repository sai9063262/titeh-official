
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Search, Filter, Check, X, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Import road sign data
import { roadSigns } from "@/utils/ExamData";

const RoadSigns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quizMode, setQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  // Filter road signs by search term and category
  const filteredSigns = roadSigns.filter(sign => {
    const matchesSearch = sign.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        sign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || sign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from road signs
  const categories = ["all", ...Array.from(new Set(roadSigns.map(sign => sign.category)))];

  // Start quiz with 10 random signs
  const startQuiz = () => {
    const shuffled = [...roadSigns].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizQuestions(shuffled);
    setQuizMode(true);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setQuizComplete(false);
  };

  // Handle answer selection in quiz
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    
    if (answer === quizQuestions[currentQuestionIndex].name) {
      setQuizScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  // Reset quiz
  const resetQuiz = () => {
    setQuizMode(false);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setQuizComplete(false);
    setQuizQuestions([]);
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
            <Button onClick={startQuiz} className="bg-titeh-primary hover:bg-blue-600">
              Take Quiz
            </Button>
          )}
          
          {quizMode && (
            <Button onClick={resetQuiz} variant="outline">
              Exit Quiz
            </Button>
          )}
        </div>
        
        {!quizMode ? (
          <>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search road signs..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Tabs value={selectedCategory} className="mb-6">
              <TabsList className="mb-4 flex flex-wrap">
                {categories.map((category, index) => (
                  <TabsTrigger 
                    key={index} 
                    value={category}
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category === "all" ? "All Signs" : category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSigns.map((sign, index) => (
                  <SignCard key={index} sign={sign} />
                ))}
              </div>
              
              {filteredSigns.length === 0 && (
                <Card className="p-6 text-center">
                  <HelpCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-lg font-medium">No signs found</p>
                  <p className="text-sm text-gray-600">Try a different search term or category</p>
                </Card>
              )}
            </Tabs>
          </>
        ) : (
          <Card className="p-6 mb-6">
            {!quizComplete ? (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                    <p className="text-sm text-gray-600">Score: {quizScore}/{currentQuestionIndex}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center mb-6">
                  <img 
                    src={quizQuestions[currentQuestionIndex].imageUrl} 
                    alt="Road Sign" 
                    className="w-40 h-40 object-contain mb-4"
                  />
                  <h2 className="text-lg font-medium text-center mb-6">What does this sign mean?</h2>
                </div>
                
                <div className="space-y-3">
                  {/* Generate 4 options including the correct one */}
                  {[...Array(4)].map((_, i) => {
                    // Get random sign names for wrong answers
                    const options = [
                      quizQuestions[currentQuestionIndex].name,
                      ...roadSigns
                        .filter(s => s.name !== quizQuestions[currentQuestionIndex].name)
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 3)
                        .map(s => s.name)
                    ].sort(() => 0.5 - Math.random());
                    
                    return (
                      <div
                        key={i}
                        onClick={() => handleAnswerSelect(options[i])}
                        className={`p-4 border rounded-md cursor-pointer transition-colors ${
                          selectedAnswer === options[i] && options[i] === quizQuestions[currentQuestionIndex].name
                            ? 'bg-green-100 border-green-300'
                            : selectedAnswer === options[i]
                            ? 'bg-red-100 border-red-300'
                            : selectedAnswer && options[i] === quizQuestions[currentQuestionIndex].name
                            ? 'bg-green-100 border-green-300'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          {selectedAnswer && options[i] === quizQuestions[currentQuestionIndex].name && (
                            <Check className="text-green-500 mr-2 h-5 w-5" />
                          )}
                          {selectedAnswer === options[i] && options[i] !== quizQuestions[currentQuestionIndex].name && (
                            <X className="text-red-500 mr-2 h-5 w-5" />
                          )}
                          <span>{options[i]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Quiz Complete!</h2>
                <p className="text-lg mb-4">Your Score: {quizScore} out of {quizQuestions.length}</p>
                <Button onClick={startQuiz} className="mr-2 bg-titeh-primary hover:bg-blue-600">
                  Try Again
                </Button>
                <Button onClick={resetQuiz} variant="outline">
                  Return to Signs
                </Button>
              </div>
            )}
          </Card>
        )}
        
        <Card className="p-4 bg-blue-50">
          <div className="flex items-start">
            <Filter className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Tips for Learning Road Signs</h3>
              <p className="text-sm text-gray-600 mt-1">
                Group similar signs together. Focus on understanding the shapes and colors of signs, 
                as they often indicate the type of message (red for prohibition, yellow for warning, etc.). 
                Take the quiz regularly to reinforce your memory.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

// Road Sign Card Component
const SignCard = ({ sign }: { sign: any }) => {
  return (
    <Card className="overflow-hidden">
      <Dialog>
        <DialogTrigger asChild>
          <div className="p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex flex-col items-center">
              <img 
                src={sign.imageUrl || "/placeholder.svg"} 
                alt={sign.name} 
                className="w-24 h-24 object-contain mb-2"
              />
              <h3 className="font-medium text-center">{sign.name}</h3>
              <Badge 
                variant="outline" 
                className="mt-2 capitalize"
              >
                {sign.category}
              </Badge>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">{sign.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <img 
              src={sign.imageUrl || "/placeholder.svg"} 
              alt={sign.name} 
              className="w-32 h-32 object-contain mb-4"
            />
            <div className="space-y-4 w-full">
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Description:</h4>
                <p>{sign.description}</p>
              </div>
              {sign.penalty && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Penalty for Violation:</h4>
                  <p>{sign.penalty}</p>
                </div>
              )}
              {sign.example && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Example:</h4>
                  <p>{sign.example}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Category:</h4>
                <Badge variant="outline" className="capitalize">
                  {sign.category}
                </Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RoadSigns;
