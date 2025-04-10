
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Search, BookOpen, Filter, Check, ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Sample question bank
const allQuestions = [
  // Traffic Rules Category
  {
    id: 1,
    question: "What is the maximum speed limit in urban areas of Telangana?",
    answer: "50 km/h unless otherwise specified",
    category: "Traffic Rules",
    difficulty: "Easy"
  },
  {
    id: 2,
    question: "When can you overtake a vehicle in Telangana?",
    answer: "From the right side when it is safe to do so and not prohibited by signs",
    category: "Traffic Rules",
    difficulty: "Medium"
  },
  {
    id: 3,
    question: "What should you do when an ambulance approaches?",
    answer: "Slow down and pull over to the side to give way",
    category: "Traffic Rules",
    difficulty: "Easy"
  },
  {
    id: 4,
    question: "What is the penalty for driving without a valid license in Telangana?",
    answer: "Fine of ₹5,000 or imprisonment, or both",
    category: "Traffic Rules",
    difficulty: "Medium"
  },
  {
    id: 5,
    question: "What is the minimum following distance to maintain in normal conditions?",
    answer: "Two-second gap from the vehicle ahead",
    category: "Traffic Rules",
    difficulty: "Easy"
  },
  
  // Road Signs Category
  {
    id: 6,
    question: "What does a triangular sign with a red border indicate?",
    answer: "Warning or caution for a potential hazard ahead",
    category: "Road Signs",
    difficulty: "Easy"
  },
  {
    id: 7,
    question: "What does a circular sign with a red border indicate?",
    answer: "Prohibitory sign - indicates an action that is not allowed",
    category: "Road Signs",
    difficulty: "Medium"
  },
  {
    id: 8,
    question: "What does a blue circular sign indicate?",
    answer: "Mandatory sign - indicates an action that must be taken",
    category: "Road Signs",
    difficulty: "Medium"
  },
  {
    id: 9,
    question: "What does a yellow diamond-shaped sign indicate?",
    answer: "Warning sign for specific conditions ahead",
    category: "Road Signs",
    difficulty: "Easy"
  },
  {
    id: 10,
    question: "What does an octagonal red sign indicate?",
    answer: "Stop sign - requires a complete stop",
    category: "Road Signs",
    difficulty: "Easy"
  },
  
  // Vehicle Safety Category
  {
    id: 11,
    question: "How often should you check your tire pressure?",
    answer: "At least once a month and before long trips",
    category: "Vehicle Safety",
    difficulty: "Medium"
  },
  {
    id: 12,
    question: "What should you do if your vehicle's brake fails while driving?",
    answer: "Pump the brake pedal rapidly, shift to lower gear, use handbrake gradually, and steer to safety",
    category: "Vehicle Safety",
    difficulty: "Hard"
  },
  {
    id: 13,
    question: "Why is it important to use a child safety seat?",
    answer: "It protects children from serious injury in case of a collision",
    category: "Vehicle Safety",
    difficulty: "Easy"
  },
  {
    id: 14,
    question: "When should you replace your vehicle's wiper blades?",
    answer: "When they leave streaks, skip areas, or make noise during operation",
    category: "Vehicle Safety",
    difficulty: "Medium"
  },
  {
    id: 15,
    question: "What are the components that should be checked regularly in a vehicle?",
    answer: "Brakes, tires, lights, oil, coolant, windshield wipers, and battery",
    category: "Vehicle Safety",
    difficulty: "Medium"
  },
  
  // Telangana-Specific Laws Category
  {
    id: 16,
    question: "What is the legal blood alcohol concentration (BAC) limit for driving in Telangana?",
    answer: "0.00% (zero tolerance)",
    category: "Telangana-Specific Laws",
    difficulty: "Medium"
  },
  {
    id: 17,
    question: "What is the penalty for using a mobile phone while driving in Telangana?",
    answer: "₹1,000 fine for first offense, ₹5,000 for subsequent offenses",
    category: "Telangana-Specific Laws",
    difficulty: "Medium"
  },
  {
    id: 18,
    question: "What is the helmet law in Telangana for two-wheeler riders?",
    answer: "Both rider and pillion passenger must wear helmets; fine of ₹1,000 and license suspension for violations",
    category: "Telangana-Specific Laws",
    difficulty: "Easy"
  },
  {
    id: 19,
    question: "What is the validity period of a PUC (Pollution Under Control) certificate in Telangana?",
    answer: "6 months for all vehicles",
    category: "Telangana-Specific Laws",
    difficulty: "Easy"
  },
  {
    id: 20,
    question: "What is the rule for parking in no-parking zones in Hyderabad?",
    answer: "Fine of ₹500 and possible towing of the vehicle",
    category: "Telangana-Specific Laws",
    difficulty: "Medium"
  },
  
  // Additional categories can be added as needed
];

const QuestionBank = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleAnswers, setVisibleAnswers] = useState<number[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  
  const toggleAnswer = (id: number) => {
    if (visibleAnswers.includes(id)) {
      setVisibleAnswers(visibleAnswers.filter(answerId => answerId !== id));
    } else {
      setVisibleAnswers([...visibleAnswers, id]);
    }
  };
  
  const filterByDifficulty = (questions: typeof allQuestions) => {
    if (!selectedDifficulty) return questions;
    return questions.filter(q => q.difficulty === selectedDifficulty);
  };
  
  const sortQuestions = (questions: typeof allQuestions) => {
    if (!sortAlphabetically) return questions;
    return [...questions].sort((a, b) => a.question.localeCompare(b.question));
  };
  
  // Filter questions by search term and category
  const getFilteredQuestions = (category: string | null) => {
    let filtered = allQuestions;
    
    if (category && category !== "All") {
      filtered = filtered.filter(q => q.category === category);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filtered = filterByDifficulty(filtered);
    return sortQuestions(filtered);
  };
  
  const trafficRulesQuestions = getFilteredQuestions("Traffic Rules");
  const roadSignsQuestions = getFilteredQuestions("Road Signs");
  const vehicleSafetyQuestions = getFilteredQuestions("Vehicle Safety");
  const telanganaLawsQuestions = getFilteredQuestions("Telangana-Specific Laws");
  const allFilteredQuestions = getFilteredQuestions(null);
  
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDifficulty(null);
    setSortAlphabetically(false);
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Question Bank</h1>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search questions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          <Button 
            variant={selectedDifficulty === "Easy" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSelectedDifficulty(selectedDifficulty === "Easy" ? null : "Easy")}
          >
            Easy
          </Button>
          <Button 
            variant={selectedDifficulty === "Medium" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSelectedDifficulty(selectedDifficulty === "Medium" ? null : "Medium")}
          >
            Medium
          </Button>
          <Button 
            variant={selectedDifficulty === "Hard" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSelectedDifficulty(selectedDifficulty === "Hard" ? null : "Hard")}
          >
            Hard
          </Button>
          <Button 
            variant={sortAlphabetically ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSortAlphabetically(!sortAlphabetically)}
            className="ml-auto"
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            Sort A-Z
          </Button>
          {(searchTerm || selectedDifficulty || sortAlphabetically) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
            >
              Reset
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({allFilteredQuestions.length})</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Rules ({trafficRulesQuestions.length})</TabsTrigger>
            <TabsTrigger value="signs">Road Signs ({roadSignsQuestions.length})</TabsTrigger>
            <TabsTrigger value="safety">Vehicle Safety ({vehicleSafetyQuestions.length})</TabsTrigger>
            <TabsTrigger value="laws">Telangana Laws ({telanganaLawsQuestions.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-4">
            {allFilteredQuestions.length > 0 ? (
              allFilteredQuestions.map(q => (
                <QuestionCard 
                  key={q.id} 
                  question={q} 
                  isAnswerVisible={visibleAnswers.includes(q.id)} 
                  toggleAnswer={() => toggleAnswer(q.id)} 
                />
              ))
            ) : (
              <Card className="p-6 text-center">
                <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-medium">No questions found</p>
                <p className="text-sm text-gray-600">Try a different search term or filter</p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="traffic" className="space-y-4 mt-4">
            {trafficRulesQuestions.length > 0 ? (
              trafficRulesQuestions.map(q => (
                <QuestionCard 
                  key={q.id} 
                  question={q} 
                  isAnswerVisible={visibleAnswers.includes(q.id)} 
                  toggleAnswer={() => toggleAnswer(q.id)} 
                />
              ))
            ) : (
              <Card className="p-6 text-center">
                <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-medium">No traffic rule questions found</p>
                <p className="text-sm text-gray-600">Try a different search term or filter</p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="signs" className="space-y-4 mt-4">
            {roadSignsQuestions.length > 0 ? (
              roadSignsQuestions.map(q => (
                <QuestionCard 
                  key={q.id} 
                  question={q} 
                  isAnswerVisible={visibleAnswers.includes(q.id)} 
                  toggleAnswer={() => toggleAnswer(q.id)} 
                />
              ))
            ) : (
              <Card className="p-6 text-center">
                <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-medium">No road sign questions found</p>
                <p className="text-sm text-gray-600">Try a different search term or filter</p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="safety" className="space-y-4 mt-4">
            {vehicleSafetyQuestions.length > 0 ? (
              vehicleSafetyQuestions.map(q => (
                <QuestionCard 
                  key={q.id} 
                  question={q} 
                  isAnswerVisible={visibleAnswers.includes(q.id)} 
                  toggleAnswer={() => toggleAnswer(q.id)} 
                />
              ))
            ) : (
              <Card className="p-6 text-center">
                <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-medium">No vehicle safety questions found</p>
                <p className="text-sm text-gray-600">Try a different search term or filter</p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="laws" className="space-y-4 mt-4">
            {telanganaLawsQuestions.length > 0 ? (
              telanganaLawsQuestions.map(q => (
                <QuestionCard 
                  key={q.id} 
                  question={q} 
                  isAnswerVisible={visibleAnswers.includes(q.id)} 
                  toggleAnswer={() => toggleAnswer(q.id)} 
                />
              ))
            ) : (
              <Card className="p-6 text-center">
                <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-medium">No Telangana law questions found</p>
                <p className="text-sm text-gray-600">Try a different search term or filter</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <Card className="p-4 bg-blue-50">
          <div className="flex items-start">
            <Filter className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Study Tips</h3>
              <p className="text-sm text-gray-600 mt-1">
                Focus on understanding concepts rather than memorizing answers. 
                Practice regularly with different question categories. 
                Take the Practice Exam after studying to test your knowledge.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

// Question Card Component
const QuestionCard = ({ 
  question, 
  isAnswerVisible, 
  toggleAnswer 
}: { 
  question: typeof allQuestions[0], 
  isAnswerVisible: boolean, 
  toggleAnswer: () => void 
}) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{question.question}</h3>
        <Badge variant={
          question.difficulty === "Easy" ? "outline" : 
          question.difficulty === "Medium" ? "secondary" : 
          "destructive"
        }>
          {question.difficulty}
        </Badge>
      </div>
      
      <div className="mt-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleAnswer}
          className="w-full flex justify-between items-center"
        >
          <span>{isAnswerVisible ? "Hide Answer" : "Show Answer"}</span>
          <Check className={`h-4 w-4 ${isAnswerVisible ? 'opacity-100' : 'opacity-0'}`} />
        </Button>
        
        {isAnswerVisible && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md">
            <p className="text-sm">{question.answer}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuestionBank;
