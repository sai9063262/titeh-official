
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Search, BookOpen, AlertTriangle, Bookmark, BookmarkPlus, Filter } from "lucide-react";

interface Question {
  id: number;
  category: string;
  text: string;
  options: { id: string; text: string }[];
  answer: string;
  explanation: string;
  bookmarked?: boolean;
}

const categories = [
  "Traffic Rules",
  "Road Signs",
  "Vehicle Safety",
  "Telangana Laws",
  "General Knowledge"
];

// Sample questions - in a real app, this would come from a database
const questionsData: Question[] = [
  {
    id: 1,
    category: "Traffic Rules",
    text: "What is the minimum age to apply for a learner's license to drive a motorcycle without gear in Telangana?",
    options: [
      { id: "a", text: "16 years" },
      { id: "b", text: "18 years" },
      { id: "c", text: "21 years" }
    ],
    answer: "a",
    explanation: "In Telangana, you can apply for a learner's license for a motorcycle without gear at the age of 16 years."
  },
  {
    id: 2,
    category: "Traffic Rules",
    text: "What should you do when approaching an unguarded railway crossing in Telangana?",
    options: [
      { id: "a", text: "Sound the horn and cross quickly" },
      { id: "b", text: "Stop, check for trains, and proceed safely" },
      { id: "c", text: "Wait until a train passes" }
    ],
    answer: "b",
    explanation: "Always stop at unguarded railway crossings, look in both directions for approaching trains, and proceed only when it's safe."
  },
  {
    id: 3,
    category: "Traffic Rules",
    text: "What is the maximum speed limit in urban areas of Telangana?",
    options: [
      { id: "a", text: "40 km/h" },
      { id: "b", text: "50 km/h" },
      { id: "c", text: "60 km/h" }
    ],
    answer: "b",
    explanation: "The maximum speed limit in urban areas of Telangana is 50 km/h unless otherwise specified by road signs."
  },
  {
    id: 4,
    category: "Vehicle Safety",
    text: "When turning left on a two-wheeler, what should you do?",
    options: [
      { id: "a", text: "Signal and slow down" },
      { id: "b", text: "Increase speed and turn" },
      { id: "c", text: "Turn without signaling" }
    ],
    answer: "a",
    explanation: "Always signal your intention to turn left, slow down, and check traffic before making the turn safely."
  },
  {
    id: 5,
    category: "Road Signs",
    text: "What does a red octagonal sign indicate?",
    options: [
      { id: "a", text: "Yield" },
      { id: "b", text: "Stop" },
      { id: "c", text: "No entry" }
    ],
    answer: "b",
    explanation: "A red octagonal sign means 'STOP'. You must come to a complete halt at the stop line or before entering the intersection."
  },
  {
    id: 6,
    category: "Telangana Laws",
    text: "What is the validity period of a learner's license in Telangana?",
    options: [
      { id: "a", text: "6 months" },
      { id: "b", text: "1 year" },
      { id: "c", text: "2 years" }
    ],
    answer: "a",
    explanation: "A learner's license in Telangana is valid for 6 months from the date of issue."
  },
  {
    id: 7,
    category: "Vehicle Safety",
    text: "What should you do if your vehicle breaks down on a highway?",
    options: [
      { id: "a", text: "Leave it and walk away" },
      { id: "b", text: "Place a warning triangle and inform authorities" },
      { id: "c", text: "Ignore it and continue" }
    ],
    answer: "b",
    explanation: "If your vehicle breaks down on a highway, place a warning triangle about 50 meters behind your vehicle and contact authorities for assistance."
  },
  {
    id: 8,
    category: "Telangana Laws",
    text: "What is the penalty for driving without a valid license in Telangana?",
    options: [
      { id: "a", text: "₹500 fine" },
      { id: "b", text: "₹5,000 fine or imprisonment" },
      { id: "c", text: "₹1,000 fine" }
    ],
    answer: "b",
    explanation: "Driving without a valid license in Telangana can result in a fine of ₹5,000 or imprisonment or both."
  },
  {
    id: 9,
    category: "Traffic Rules",
    text: "Which side of the road should pedestrians walk on if there is no footpath?",
    options: [
      { id: "a", text: "Right side" },
      { id: "b", text: "Left side" },
      { id: "c", text: "Either side" }
    ],
    answer: "a",
    explanation: "Pedestrians should walk on the right side of the road facing oncoming traffic when there is no footpath."
  },
  {
    id: 10,
    category: "Road Signs",
    text: "What does a triangular road sign with a red border indicate?",
    options: [
      { id: "a", text: "Mandatory instruction" },
      { id: "b", text: "Warning" },
      { id: "c", text: "Informatory sign" }
    ],
    answer: "b",
    explanation: "A triangular road sign with a red border is a warning sign, alerting drivers to potential hazards ahead."
  },
  {
    id: 11,
    category: "General Knowledge",
    text: "What should you check in your vehicle before a long journey?",
    options: [
      { id: "a", text: "Only fuel level" },
      { id: "b", text: "Oil, coolant, tires, and brakes" },
      { id: "c", text: "Just tires" }
    ],
    answer: "b",
    explanation: "Before a long journey, you should check oil levels, coolant, tire pressure, and brakes to ensure your vehicle is safe for travel."
  },
  {
    id: 12,
    category: "Telangana Laws",
    text: "What is the fine for jumping a red light in Hyderabad?",
    options: [
      { id: "a", text: "₹500" },
      { id: "b", text: "₹1,000" },
      { id: "c", text: "₹2,000" }
    ],
    answer: "b",
    explanation: "In Hyderabad and other parts of Telangana, jumping a red light will result in a fine of ₹1,000."
  },
  // Add more questions as needed
];

const QuestionBank = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);
  
  // Filter questions based on search term and category
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || question.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Toggle question expansion
  const toggleExpand = (id: number) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };
  
  // Toggle bookmark
  const toggleBookmark = (id: number) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, bookmarked: !q.bookmarked } : q
    ));
  };
  
  // Get bookmarked questions
  const bookmarkedQuestions = questions.filter(q => q.bookmarked);
  
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
        
        <Tabs defaultValue="all" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Questions</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select 
                className="border rounded px-2 py-1 text-sm"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <TabsContent value="all">
            {filteredQuestions.length > 0 ? (
              <div className="space-y-4">
                {filteredQuestions.map(question => (
                  <Card key={question.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{question.category}</span>
                        </div>
                        <p className="font-medium mb-2">{question.text}</p>
                      </div>
                      <button 
                        onClick={() => toggleBookmark(question.id)}
                        className="ml-2 text-gray-400 hover:text-titeh-primary"
                      >
                        {question.bookmarked ? (
                          <Bookmark className="h-5 w-5 fill-titeh-primary text-titeh-primary" />
                        ) : (
                          <BookmarkPlus className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleExpand(question.id)}
                      className="mt-2"
                    >
                      {expandedQuestionId === question.id ? "Hide Answer" : "Show Answer"}
                    </Button>
                    
                    {expandedQuestionId === question.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-2 mb-4">
                          {question.options.map(option => (
                            <div 
                              key={option.id}
                              className={`p-2 border rounded ${
                                option.id === question.answer ? 'bg-green-100 border-green-500' : ''
                              }`}
                            >
                              <span className="font-medium mr-2">{option.id})</span>
                              <span>{option.text}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-3">
                          <h4 className="font-medium mb-2">Explanation:</h4>
                          <p className="text-sm text-gray-600">{question.explanation}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                <p className="text-lg font-medium">No questions found</p>
                <p className="text-sm text-gray-600">Try changing your search term or category filter</p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="bookmarked">
            {bookmarkedQuestions.length > 0 ? (
              <div className="space-y-4">
                {bookmarkedQuestions.map(question => (
                  <Card key={question.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{question.category}</span>
                        </div>
                        <p className="font-medium mb-2">{question.text}</p>
                      </div>
                      <button 
                        onClick={() => toggleBookmark(question.id)}
                        className="ml-2 text-gray-400 hover:text-titeh-primary"
                      >
                        <Bookmark className="h-5 w-5 fill-titeh-primary text-titeh-primary" />
                      </button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleExpand(question.id)}
                      className="mt-2"
                    >
                      {expandedQuestionId === question.id ? "Hide Answer" : "Show Answer"}
                    </Button>
                    
                    {expandedQuestionId === question.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-2 mb-4">
                          {question.options.map(option => (
                            <div 
                              key={option.id}
                              className={`p-2 border rounded ${
                                option.id === question.answer ? 'bg-green-100 border-green-500' : ''
                              }`}
                            >
                              <span className="font-medium mr-2">{option.id})</span>
                              <span>{option.text}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-3">
                          <h4 className="font-medium mb-2">Explanation:</h4>
                          <p className="text-sm text-gray-600">{question.explanation}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <BookOpen className="h-10 w-10 text-titeh-primary mx-auto mb-2" />
                <p className="text-lg font-medium">No bookmarked questions</p>
                <p className="text-sm text-gray-600">Bookmark questions to save them for later</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <Card className="p-4 bg-blue-50 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Study Tips</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mt-2">
                <li>Bookmark important questions for quick access later</li>
                <li>Review explanations to understand the reasoning behind each answer</li>
                <li>Focus on categories where you're less confident</li>
                <li>Take the practice exam when you feel ready</li>
              </ul>
            </div>
          </div>
        </Card>
        
        <div className="text-center">
          <Button asChild>
            <Link to="/rto-exam/practice">Take Practice Exam</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default QuestionBank;
