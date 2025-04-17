import Layout from "@/components/Layout";
import { School, BookOpen, FileText, PlayCircle, Store, FileType, Building, ListChecks, Gavel, Clock, SignpostIcon, BookMarked, Calendar, Clipboard, HelpCircle, CarFront, AlertTriangle, Video, FileKey, MessagesSquare, Brain, Bell, UserCog } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const RtoExam = () => {
  const examItems = [
    // Existing items
    { icon: <School className="text-titeh-primary text-xl" />, label: "Practice Driving Licence Exam", link: "/rto-exam/practice" },
    { icon: <BookOpen className="text-titeh-primary text-xl" />, label: "Question Bank", link: "/rto-exam/questions" },
    { icon: <FileText className="text-titeh-primary text-xl" />, label: "DL Que. & Sign", link: "/traffic-signs" },
    { icon: <PlayCircle className="text-titeh-primary text-xl" />, label: "Exam Preparation", link: "/rto-exam/practice-exam" },
    { icon: <Store className="text-titeh-primary text-xl" />, label: "Driving Schools", link: "/rto-exam/schools" },
    { icon: <FileType className="text-titeh-primary text-xl" />, label: "License Procedure", link: "/rto-exam/license-procedure" },
    { icon: <Building className="text-titeh-primary text-xl" />, label: "RTO Offices", link: "/rto-exam/offices" },
    { icon: <ListChecks className="text-titeh-primary text-xl" />, label: "Valid Document List", link: "/rto-exam/documents" },
    { icon: <Gavel className="text-titeh-primary text-xl" />, label: "Driving Laws", link: "/rto-exam/laws" },
    
    // New items - Group 1
    { icon: <Clock className="text-titeh-primary text-xl" />, label: "Mock Test Simulator", link: "/rto-exam/mock-test", isNew: true },
    { icon: <SignpostIcon className="text-titeh-primary text-xl" />, label: "Road Sign Recognition", link: "/rto-exam/road-signs", isNew: true },
    { icon: <BookMarked className="text-titeh-primary text-xl" />, label: "Driving Tips & Techniques", link: "/rto-exam/driving-tips", isNew: true },
    { icon: <Calendar className="text-titeh-primary text-xl" />, label: "RTO Exam Schedule", link: "/rto-exam/exam-schedule", isNew: true },
    { icon: <Clipboard className="text-titeh-primary text-xl" />, label: "Learner's Logbook", link: "/rto-exam/logbook", isNew: true },
    { icon: <HelpCircle className="text-titeh-primary text-xl" />, label: "Traffic Rules Quiz", link: "/rto-exam/traffic-quiz", isNew: true },
    
    // New items - Group 2
    { icon: <CarFront className="text-titeh-primary text-xl" />, label: "Virtual Driving Simulator", link: "/rto-exam/driving-simulator", isNew: true },
    { icon: <AlertTriangle className="text-titeh-primary text-xl" />, label: "Penalty Points Tracker", link: "/rto-exam/penalty-tracker", isNew: true },
    { icon: <Video className="text-titeh-primary text-xl" />, label: "Road Safety Videos", link: "/rto-exam/safety-videos", isNew: true },
    { icon: <FileKey className="text-titeh-primary text-xl" />, label: "License Renewal Guide", link: "/rto-exam/renewal-guide", isNew: true },
    { icon: <MessagesSquare className="text-titeh-primary text-xl" />, label: "Community Discussion Forum", link: "/rto-exam/discussion-forum", isNew: true },
    
    // New items - Group 3
    { icon: <Brain className="text-titeh-primary text-xl" />, label: "Adaptive Learning Module", link: "/rto-exam/adaptive-learning", isNew: true },
    { icon: <Bell className="text-titeh-primary text-xl" />, label: "Traffic Violation Alerts", link: "/rto-exam/violation-alerts", isNew: true },
    { icon: <UserCog className="text-titeh-primary text-xl" />, label: "Driver Fitness Assessment", link: "/rto-exam/fitness-assessment", isNew: true },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">RTO Exam & Learning</h1>
        
        <div className="space-y-4">
          {examItems.map((item, index) => (
            <Link to={item.link} key={index}>
              <Card className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 w-8">{item.icon}</div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.isNew && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      New
                    </Badge>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RtoExam;
