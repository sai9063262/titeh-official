
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  ChevronLeft, 
  Plus, 
  Clock, 
  MapPin, 
  Calendar, 
  Download, 
  BarChart3, 
  Edit2, 
  Trash2, 
  Road
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PracticeSession {
  id: string;
  date: string;
  duration: number;
  location: string;
  notes: string;
}

const LearnersLogbook = () => {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [newSession, setNewSession] = useState<Omit<PracticeSession, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    location: "",
    notes: ""
  });
  const [editingSession, setEditingSession] = useState<PracticeSession | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // For a real app, this would be loaded from Supabase
  // For now, we'll use local state as an example
  useEffect(() => {
    // This would be replaced with a Supabase fetch in a real app
    const sampleSessions: PracticeSession[] = [
      {
        id: "1",
        date: "2025-04-15",
        duration: 60,
        location: "Jubilee Hills, Hyderabad",
        notes: "Practiced parallel parking and three-point turns."
      },
      {
        id: "2",
        date: "2025-04-12",
        duration: 90,
        location: "Banjara Hills, Hyderabad",
        notes: "Highway driving practice with lane changes."
      },
      {
        id: "3",
        date: "2025-04-08",
        duration: 45,
        location: "Gachibowli, Hyderabad",
        notes: "Evening driving with focus on traffic signals."
      }
    ];
    
    setSessions(sampleSessions);
  }, []);

  const totalHours = sessions.reduce((total, session) => total + session.duration / 60, 0);
  const targetHours = 50;
  const progressPercentage = Math.min(Math.round((totalHours / targetHours) * 100), 100);

  const addSession = () => {
    // Validate inputs
    if (!newSession.location) {
      toast({
        title: "Missing information",
        description: "Please enter a location for your practice session",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would save to Supabase
    const sessionToAdd: PracticeSession = {
      id: Date.now().toString(), // This would be handled by Supabase in a real app
      ...newSession
    };

    setSessions([sessionToAdd, ...sessions]);
    setIsAddingSession(false);
    
    toast({
      title: "Session Added",
      description: "Your practice session has been recorded!",
    });

    // Reset the form
    setNewSession({
      date: new Date().toISOString().split('T')[0],
      duration: 60,
      location: "",
      notes: ""
    });
  };

  const deleteSession = (id: string) => {
    // In a real app, this would delete from Supabase
    setSessions(sessions.filter(session => session.id !== id));
    
    toast({
      title: "Session Deleted",
      description: "Your practice session has been removed",
      variant: "destructive",
    });
  };

  const updateSession = () => {
    if (!editingSession) return;
    
    // In a real app, this would update in Supabase
    setSessions(sessions.map(session => 
      session.id === editingSession.id ? editingSession : session
    ));
    
    setIsEditDialogOpen(false);
    setEditingSession(null);
    
    toast({
      title: "Session Updated",
      description: "Your practice session has been updated",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`;
  };

  const exportToPDF = () => {
    // In a real app, this would generate a PDF
    toast({
      title: "Exporting Logbook",
      description: "Your logbook will be downloaded as a PDF",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Learner's Logbook</h1>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Your Progress</h2>
              <p className="text-sm text-gray-600">
                {totalHours.toFixed(1)} hours completed of {targetHours} required hours
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button onClick={exportToPDF} variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export PDF
              </Button>
              <Button onClick={() => setIsAddingSession(true)} className="bg-titeh-primary hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-1" />
                Add Session
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-md p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-medium">Total Hours</h3>
              </div>
              <p className="text-2xl font-bold mt-2">{totalHours.toFixed(1)}</p>
            </div>
            <div className="bg-green-50 rounded-md p-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium">Total Sessions</h3>
              </div>
              <p className="text-2xl font-bold mt-2">{sessions.length}</p>
            </div>
            <div className="bg-purple-50 rounded-md p-4">
              <div className="flex items-center">
                <Road className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="font-medium">Hours Remaining</h3>
              </div>
              <p className="text-2xl font-bold mt-2">{Math.max(targetHours - totalHours, 0).toFixed(1)}</p>
            </div>
          </div>
        </Card>

        <h2 className="text-lg font-semibold mb-4">Practice Sessions</h2>

        {sessions.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500 mb-4">You haven't recorded any practice sessions yet.</p>
            <Button onClick={() => setIsAddingSession(true)} className="bg-titeh-primary hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Session
            </Button>
          </Card>
        ) : (
          <div className="space-y-4 mb-6">
            {sessions.map((session) => (
              <Card key={session.id} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-titeh-primary mr-2" />
                        <h3 className="font-medium">{new Date(session.date).toLocaleDateString()}</h3>
                      </div>
                      
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{formatDuration(session.duration)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{session.location}</span>
                        </div>
                      </div>
                      
                      {session.notes && (
                        <p className="text-sm text-gray-600 mt-2">{session.notes}</p>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSession(session);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSession(session.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="p-6">
          <div className="flex items-start">
            <BarChart3 className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Driving Log Statistics</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your practice is focused primarily on urban driving. Consider adding more highway and
                night-time driving practice for a well-rounded experience.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium mb-1">Most Common Location</h4>
                  <p className="text-xs text-gray-600">
                    Hyderabad City Roads
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium mb-1">Average Session</h4>
                  <p className="text-xs text-gray-600">
                    {formatDuration(sessions.reduce((acc, session) => acc + session.duration, 0) / Math.max(sessions.length, 1))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Add Session Dialog */}
        <Dialog open={isAddingSession} onOpenChange={setIsAddingSession}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Practice Session</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="date" className="text-right text-sm font-medium">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="duration" className="text-right text-sm font-medium">
                  Duration (min)
                </label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  step="5"
                  value={newSession.duration}
                  onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="location" className="text-right text-sm font-medium">
                  Location
                </label>
                <Input
                  id="location"
                  value={newSession.location}
                  onChange={(e) => setNewSession({...newSession, location: e.target.value})}
                  placeholder="e.g., Hyderabad City Roads"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="notes" className="text-right text-sm font-medium">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  value={newSession.notes}
                  onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                  placeholder="What did you practice?"
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingSession(false)}>Cancel</Button>
              <Button onClick={addSession} className="bg-titeh-primary hover:bg-blue-600">Save Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Session Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Practice Session</DialogTitle>
            </DialogHeader>
            
            {editingSession && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-date" className="text-right text-sm font-medium">
                    Date
                  </label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingSession.date}
                    onChange={(e) => setEditingSession({...editingSession, date: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-duration" className="text-right text-sm font-medium">
                    Duration (min)
                  </label>
                  <Input
                    id="edit-duration"
                    type="number"
                    min="5"
                    step="5"
                    value={editingSession.duration}
                    onChange={(e) => setEditingSession({...editingSession, duration: parseInt(e.target.value) || 0})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-location" className="text-right text-sm font-medium">
                    Location
                  </label>
                  <Input
                    id="edit-location"
                    value={editingSession.location}
                    onChange={(e) => setEditingSession({...editingSession, location: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-notes" className="text-right text-sm font-medium">
                    Notes
                  </label>
                  <Textarea
                    id="edit-notes"
                    value={editingSession.notes}
                    onChange={(e) => setEditingSession({...editingSession, notes: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setEditingSession(null);
              }}>
                Cancel
              </Button>
              <Button onClick={updateSession} className="bg-titeh-primary hover:bg-blue-600">Update Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default LearnersLogbook;
