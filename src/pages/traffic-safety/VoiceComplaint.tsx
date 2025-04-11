
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, RefreshCw, MessageSquare, X, File, PlayCircle, PauseCircle, MapPin, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const VoiceComplaint = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Request location permission on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationGranted(true);
          toast({
            title: "Location Access Granted",
            description: "Your location will be included with the complaint",
          });
        },
        (error) => {
          toast({
            title: "Location Access Denied",
            description: "Location data helps authorities respond better",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);
  
  // Start recording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        
        // Simulate transcription
        setTimeout(() => {
          const complaints = [
            "There's a broken traffic light at the junction near City Hospital that's causing congestion.",
            "I want to report a vehicle with license plate TN-09-AB-1234 that was driving recklessly on the highway.",
            "The road near Jubilee Hills has large potholes that are dangerous for two-wheelers.",
            "There's a truck parked illegally blocking the entire street in Banjara Hills area."
          ];
          
          setComplaintText(complaints[Math.floor(Math.random() * complaints.length)]);
          
          toast({
            title: "Voice Transcribed",
            description: "Your complaint has been transcribed successfully."
          });
        }, 1500);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly to record your complaint"
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Access Failed",
        description: "Please check permissions and try again",
        variant: "destructive",
      });
    }
  };
  
  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      toast({
        title: "Recording Stopped",
        description: "Processing your audio..."
      });
    }
  };
  
  // Play recorded audio
  const playAudio = () => {
    if (audioRef.current && recordedAudio) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
      }
    }
  };
  
  // Delete recording
  const deleteRecording = () => {
    setRecordedAudio(null);
    setIsPlaying(false);
    setComplaintText("");
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    
    toast({
      title: "Recording Deleted",
      description: "Your voice recording has been removed"
    });
  };
  
  // Submit complaint
  const submitComplaint = () => {
    if (!complaintText) {
      toast({
        title: "Missing Details",
        description: "Please provide complaint details",
        variant: "destructive",
      });
      return;
    }
    
    if (!complaintType) {
      toast({
        title: "Select Complaint Type",
        description: "Please select the type of complaint",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been recorded. Reference #TC-" + Math.floor(10000 + Math.random() * 90000),
      });
      
      // Reset form
      setComplaintText("");
      setComplaintType("");
      setRecordedAudio(null);
      
    }, 2000);
  };
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold text-titeh-primary mb-2">Voice Complaint</h1>
        <p className="text-gray-500 mb-6">Record and submit traffic violations or road safety concerns</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Record Your Complaint</CardTitle>
              <CardDescription>
                Use your voice to report traffic violations or road safety concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Recording UI */}
                <div className={`border ${isRecording ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-md p-6 flex flex-col items-center justify-center`}>
                  {isRecording ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 relative">
                        <Mic className="h-8 w-8 text-red-500" />
                        <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-pulse"></div>
                      </div>
                      <p className="text-sm text-red-600 font-medium mb-2">Recording in progress...</p>
                      <p className="text-lg font-semibold mb-4">{formatTime(recordingTime)}</p>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={stopRecording}
                      >
                        <MicOff className="h-4 w-4 mr-1" />
                        Stop Recording
                      </Button>
                    </>
                  ) : recordedAudio ? (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-center">
                        <audio ref={audioRef} src={recordedAudio} className="hidden" />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={playAudio}
                          className="mr-2"
                        >
                          {isPlaying ? (
                            <>
                              <PauseCircle className="h-4 w-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Play
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={deleteRecording}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="text-sm text-gray-700 italic">
                          "{complaintText || "Transcribing your audio..."}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Mic className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Click the button below to start recording your complaint
                      </p>
                      <Button 
                        onClick={startRecording}
                        className="bg-titeh-primary"
                      >
                        <Mic className="h-4 w-4 mr-1" />
                        Start Recording
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Complaint Details */}
                <div>
                  <Label htmlFor="complaint-type" className="mb-1 block">Complaint Type</Label>
                  <Select 
                    value={complaintType} 
                    onValueChange={setComplaintType}
                  >
                    <SelectTrigger id="complaint-type" className="mb-4">
                      <SelectValue placeholder="Select type of complaint" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traffic-violation">Traffic Violation</SelectItem>
                      <SelectItem value="road-condition">Bad Road Condition</SelectItem>
                      <SelectItem value="signal-malfunction">Traffic Signal Malfunction</SelectItem>
                      <SelectItem value="illegal-parking">Illegal Parking</SelectItem>
                      <SelectItem value="reckless-driving">Reckless Driving</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Label htmlFor="complaint-text" className="mb-1 block">Complaint Details</Label>
                  <Textarea 
                    id="complaint-text"
                    placeholder="Describe your complaint in detail"
                    className="h-32"
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                  />
                  
                  {/* Location info */}
                  <div className={`mt-4 p-3 rounded-lg ${locationGranted ? 'bg-green-50' : 'bg-yellow-50'}`}>
                    <div className="flex items-center">
                      <MapPin className={`h-4 w-4 mr-2 ${locationGranted ? 'text-green-600' : 'text-yellow-600'}`} />
                      <p className="text-sm">
                        {locationGranted 
                          ? 'Your location data will be included with this complaint' 
                          : 'Location data not available. Please enable location access.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full mt-6 bg-titeh-primary"
                    onClick={submitComplaint}
                    disabled={isSubmitting || (!complaintText && !recordedAudio) || !complaintType}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Complaint
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guidelines</CardTitle>
                <CardDescription>How to file an effective voice complaint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <MessageSquare className="h-5 w-5 text-titeh-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Be Clear and Specific</h3>
                      <p className="text-sm text-gray-600">
                        Mention the exact location, time, and nature of the incident
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <File className="h-5 w-5 text-titeh-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Provide Details</h3>
                      <p className="text-sm text-gray-600">
                        Include vehicle numbers, distinguishing features, or other relevant information
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-titeh-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Report Urgency</h3>
                      <p className="text-sm text-gray-600">
                        Clearly mention if the situation requires immediate attention
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Complaint Status</CardTitle>
                <CardDescription>Track the status of your submitted complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Ref# TC-45672</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        In Progress
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Signal malfunction at Banjara Hills Road No. 12</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Submitted: 09 Apr 2025</span>
                      <span>Updated: 10 Apr 2025</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Ref# TC-45601</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        Resolved
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Illegal parking near Jubilee Hills Check Post</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Submitted: 05 Apr 2025</span>
                      <span>Resolved: 08 Apr 2025</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={100} className="h-1" />
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View All Complaints
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VoiceComplaint;
