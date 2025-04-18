
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  BarChart, 
  FileText, 
  Plus, 
  Download,
  FileCheck,
  Calendar as CalendarIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LearnersLogbook = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  
  const handleAddPractice = () => {
    toast({
      title: "Practice Session Added",
      description: "Your driving practice has been recorded in your logbook.",
    });
    setShowForm(false);
  };
  
  const totalHours = 24;
  const targetHours = 50;
  const progressPercentage = Math.min((totalHours / targetHours) * 100, 100);
  
  const practiceEntries = [
    {
      id: 1,
      date: "April 15, 2025",
      duration: "1 hour 30 minutes",
      location: "Hitech City Area",
      supervisor: "Instructor Ramesh",
      skills: "Lane changing, Parallel parking",
      notes: "Made good progress with parallel parking. Need more practice with lane changing in heavy traffic."
    },
    {
      id: 2,
      date: "April 12, 2025",
      duration: "2 hours",
      location: "Gachibowli Main Roads",
      supervisor: "Father",
      skills: "Traffic signals, Right turns",
      notes: "Handled traffic signals well. Need to work on smooth gear transitions when turning."
    },
    {
      id: 3,
      date: "April 10, 2025",
      duration: "1 hour",
      location: "Practice Ground",
      supervisor: "Instructor Ramesh",
      skills: "Reverse parking, Three-point turn",
      notes: "Completed multiple successful three-point turns. Need more practice with reverse parking."
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-titeh-primary">Learner's Logbook</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-titeh-primary" />
                <span>Practice Progress</span>
              </div>
              <Button 
                onClick={() => setShowForm(!showForm)} 
                className="bg-titeh-primary"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Practice
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>{totalHours} hours completed</span>
                <span>{targetHours} hours target</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-titeh-primary h-2.5 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">{progressPercentage.toFixed(0)}% completed</p>
            </div>
            
            {showForm && (
              <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Add New Practice Session</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="practice-date" className="block text-sm font-medium mb-1">Date</label>
                        <Input
                          id="practice-date"
                          type="date"
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="practice-duration" className="block text-sm font-medium mb-1">Duration</label>
                        <Input
                          id="practice-duration"
                          placeholder="e.g., 1 hour 30 minutes"
                          className="bg-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="practice-location" className="block text-sm font-medium mb-1">Location</label>
                      <Input
                        id="practice-location"
                        placeholder="Where did you practice?"
                        className="bg-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="practice-supervisor" className="block text-sm font-medium mb-1">Supervisor</label>
                      <Input
                        id="practice-supervisor"
                        placeholder="Who supervised your practice?"
                        className="bg-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="practice-skills" className="block text-sm font-medium mb-1">Skills Practiced</label>
                      <Input
                        id="practice-skills"
                        placeholder="e.g., Parking, Lane changing"
                        className="bg-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="practice-notes" className="block text-sm font-medium mb-1">Notes</label>
                      <Textarea
                        id="practice-notes"
                        placeholder="Any observations or areas for improvement?"
                        className="bg-white resize-none"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddPractice}
                        className="bg-titeh-primary"
                      >
                        Save Entry
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Recent Practice Sessions</h3>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export Logbook
                </Button>
              </div>
              
              {practiceEntries.map((entry) => (
                <Card key={entry.id} className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <CalendarIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between mb-2">
                        <h4 className="font-medium">{entry.date}</h4>
                        <span className="text-sm text-gray-500">{entry.duration}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mb-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                          <span>{entry.location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Car className="h-3 w-3 text-gray-500 mr-1" />
                          <span>Supervisor: {entry.supervisor}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-2 rounded-md text-sm mb-2">
                        <strong>Skills Practiced:</strong> {entry.skills}
                      </div>
                      
                      <p className="text-sm text-gray-600">{entry.notes}</p>
                      
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
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
              <FileCheck className="mr-2 h-5 w-5 text-titeh-primary" />
              Logbook Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                  <Check size={12} className="text-green-600" />
                </div>
                <span>Complete a minimum of 50 hours of supervised driving practice</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                  <Check size={12} className="text-green-600" />
                </div>
                <span>Include at least 10 hours of night driving practice</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                  <Check size={12} className="text-green-600" />
                </div>
                <span>Practice in diverse conditions (rain, heavy traffic, highways)</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                  <Check size={12} className="text-green-600" />
                </div>
                <span>Maintain accurate records of all practice sessions</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                  <Check size={12} className="text-green-600" />
                </div>
                <span>Have your supervisor sign off on each practice session</span>
              </li>
            </ul>
            <div className="mt-4 text-sm text-gray-600">
              <p>Your completed logbook must be presented when applying for your permanent driving license. Ensure all entries are accurate and verifiable.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

// Define the missing Check component since it's used in the code
const Check = ({ size, className }: { size: number, className: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};

export default LearnersLogbook;
