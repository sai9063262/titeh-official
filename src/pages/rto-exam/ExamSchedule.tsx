
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Calendar, MapPin, Clock, Filter, Bell, BellOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Import sample RTO exam dates
import { rtoExamDates } from "@/utils/ExamData";

const ExamSchedule = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedExamType, setSelectedExamType] = useState<string>("all");
  const [reminders, setReminders] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  // Get unique districts from exam dates
  const districts = [...new Set(rtoExamDates.map(date => date.district))];
  
  // Get unique exam types from exam dates
  const examTypes = [...new Set(rtoExamDates.map(date => date.examType))];

  // Filter exam dates based on selected district and exam type
  const filteredExamDates = rtoExamDates.filter((date) => {
    const matchesDistrict = selectedDistrict === "all" || date.district === selectedDistrict;
    const matchesExamType = selectedExamType === "all" || date.examType === selectedExamType;
    return matchesDistrict && matchesExamType;
  });

  // Format date string to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle reminder for a specific exam date
  const toggleReminder = (examId: number) => {
    const newState = !reminders[examId];
    
    setReminders({
      ...reminders,
      [examId]: newState
    });
    
    toast({
      title: newState ? "Reminder Set" : "Reminder Removed",
      description: newState 
        ? "You'll be notified one day before the exam" 
        : "Notification for this exam has been cancelled",
      variant: newState ? "default" : "destructive",
    });

    // In a real app, this would connect to a notification system or calendar
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">RTO Exam Schedule</h1>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">District</label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Exam Type</label>
              <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Exam Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {examTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <div className="space-y-4 mb-6">
          {filteredExamDates.map((exam) => (
            <Card key={exam.id} className="overflow-hidden">
              <div className="p-5">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-titeh-primary mr-2" />
                      <h3 className="font-medium">{formatDate(exam.date)}</h3>
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{exam.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{exam.location}, {exam.district}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50">
                        {exam.examType}
                      </Badge>
                      <Badge variant="outline" className={exam.availableSlots > 5 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                        {exam.availableSlots} slots available
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center">
                    <Button
                      variant={reminders[exam.id] ? "default" : "outline"}
                      className={reminders[exam.id] ? "bg-titeh-primary hover:bg-blue-600" : ""}
                      onClick={() => toggleReminder(exam.id)}
                    >
                      {reminders[exam.id] ? (
                        <>
                          <BellOff className="h-4 w-4 mr-1" />
                          Cancel Reminder
                        </>
                      ) : (
                        <>
                          <Bell className="h-4 w-4 mr-1" />
                          Set Reminder
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredExamDates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No exam dates found for your selected criteria.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSelectedDistrict('all');
                  setSelectedExamType('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        <Card className="p-6">
          <div className="flex items-start">
            <Calendar className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">How to Prepare for Your RTO Exam</h3>
              <p className="text-sm text-gray-600 mt-1">
                Make sure to arrive at least 30 minutes before your scheduled exam time and bring all required documents:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-2">
                <li>Original ID proof (Aadhaar, PAN, Passport)</li>
                <li>Address proof</li>
                <li>Two passport-sized photographs</li>
                <li>Learner's license</li>
                <li>Fee payment receipt</li>
              </ul>
              <Separator className="my-3" />
              <p className="text-sm text-gray-600">
                For the driving test, wear comfortable clothes and shoes. Be confident but careful, and 
                remember all traffic rules during your test.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ExamSchedule;
