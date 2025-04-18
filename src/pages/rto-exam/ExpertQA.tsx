
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, User, Calendar, Clock, Search, Filter, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ExpertQA = () => {
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      toast({
        title: "Question Submitted",
        description: "Your question has been sent to our experts. We'll notify you when it's answered.",
      });
      setQuestion("");
    } else {
      toast({
        title: "Empty Question",
        description: "Please enter your question before submitting.",
        variant: "destructive",
      });
    }
  };

  const upcomingSessions = [
    {
      id: 1,
      expert: "Dr. Ramesh Kumar",
      title: "License Procedures and Documentation",
      date: "April 21, 2025",
      time: "11:00 AM - 12:00 PM",
      registrationOpen: true,
      participants: 48
    },
    {
      id: 2,
      expert: "Ms. Priya Sharma",
      title: "Traffic Rules and Road Signs",
      date: "April 25, 2025",
      time: "3:00 PM - 4:00 PM",
      registrationOpen: true,
      participants: 32
    },
    {
      id: 3,
      expert: "Mr. Venkatesh Rao",
      title: "Vehicle Maintenance and Safety",
      date: "April 29, 2025",
      time: "5:30 PM - 6:30 PM",
      registrationOpen: false,
      participants: 50
    }
  ];

  const previousQuestions = [
    {
      id: 1,
      question: "What documents are needed for a learner's license in Telangana?",
      answer: "For a learner's license in Telangana, you need: 1) Identity proof (Aadhaar/Passport/Voter ID), 2) Address proof, 3) Age proof (if different from ID), 4) Two passport-sized photographs, 5) Form 2 duly filled. Apply online through the Sarathi portal or visit your local RTO office.",
      expert: "Dr. Ramesh Kumar",
      date: "April 10, 2025",
      upvotes: 24,
      downvotes: 2
    },
    {
      id: 2,
      question: "How long is the waiting period between getting a learner's license and applying for a permanent license?",
      answer: "In Telangana, after obtaining a learner's license, you must wait for a minimum of 30 days before applying for a permanent driving license. This allows sufficient time for practice. Your learner's license is valid for 6 months, so plan accordingly to apply for your permanent license within this timeframe.",
      expert: "Ms. Priya Sharma",
      date: "April 5, 2025",
      upvotes: 18,
      downvotes: 0
    },
    {
      id: 3,
      question: "What is the penalty for driving without insurance in Telangana?",
      answer: "Driving without valid insurance in Telangana can result in a fine of ₹2,000 for the first offense and ₹4,000 for subsequent offenses under the Motor Vehicles Act. Additionally, your vehicle may be impounded until valid insurance is produced. Always keep your insurance documents in the vehicle while driving.",
      expert: "Mr. Venkatesh Rao",
      date: "March 28, 2025",
      upvotes: 32,
      downvotes: 3
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-titeh-primary">Expert Q&A Sessions</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-titeh-primary" />
              Ask Your Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQuestionSubmit}>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here (max 100 characters)..."
                className="mb-4 resize-none"
                maxLength={100}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{question.length}/100 characters</p>
                <Button type="submit" className="bg-titeh-primary">Submit Question</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-titeh-primary" />
              Upcoming Live Q&A Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <Card key={session.id} className="p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{session.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <User className="h-3 w-3 mr-1" />
                        <span>Expert: {session.expert}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{session.time}</span>
                      </div>
                      <div className="text-sm mt-1">
                        <span className="text-gray-500">{session.participants} participants registered</span>
                      </div>
                    </div>
                    <div>
                      <Button 
                        disabled={!session.registrationOpen}
                        className={session.registrationOpen ? "bg-titeh-primary" : "bg-gray-300"}
                      >
                        {session.registrationOpen ? "Register Now" : "Registration Closed"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-titeh-primary" />
              Previously Answered Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4 space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
            
            <div className="space-y-4">
              {previousQuestions.map((qa) => (
                <Card key={qa.id} className="p-4">
                  <div>
                    <h3 className="font-medium text-titeh-primary">{qa.question}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <User className="h-3 w-3 mr-1" />
                      <span>Answered by: {qa.expert}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{qa.date}</span>
                    </div>
                    <p className="text-sm mt-2 bg-gray-50 p-3 rounded-md">{qa.answer}</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Button variant="ghost" size="sm" className="text-green-600">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {qa.upvotes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        {qa.downvotes}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ExpertQA;
