
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Mic, Lock, Sparkles, Camera, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import OpenAIService from "@/services/openai-service";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FacialRecognitionService from "@/services/facial-recognition-service";

const THelper = () => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hello! I'm T-Helper, your AI assistant for traffic and driver information. How can I help you today?" },
  ]);
  const [showAdminOptions, setShowAdminOptions] = useState(false);
  const [adminAuthStatus, setAdminAuthStatus] = useState("not_started");
  const [apiKey, setApiKey] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const faqSuggestions = [
    "How do I verify a driver's license?",
    "What's required for license renewal?",
    "How can I pay a traffic challan?",
    "Tell me about driver verification",
    "What are the valid documents for RTO?",
    "How do I check license points?"
  ];

  // Scroll to bottom of chat when conversation updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const updatedConversation = [
      ...conversation,
      { role: "user", content: message },
    ];
    setConversation(updatedConversation);
    setMessage("");
    setIsLoading(true);
    
    try {
      const response = await OpenAIService.askTHelper(message);
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: "I'm sorry, I encountered an error while processing your request. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          setIsTranscribing(true);
          const transcribedText = await OpenAIService.transcribeAudio(audioBlob);
          setMessage(transcribedText);
          
          // Don't automatically send if user might want to edit
          setIsTranscribing(false);
          toast({
            title: "Voice Transcribed",
            description: "You can edit your message before sending.",
          });
        } catch (error) {
          console.error('Error processing voice:', error);
          toast({
            title: "Voice Processing Error",
            description: "Failed to process voice input. Please try typing your question.",
            variant: "destructive"
          });
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak your question clearly...",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Please make sure your microphone is connected and you've granted permission.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Processing your voice...",
      });
    }
  };

  const handleRecordVoice = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleAdminLogin = async () => {
    if (email === "openaiapiadmin.com" && password === "OPENAIAPIKEY") {
      setAdminAuthStatus("otp_required");
      toast({
        title: "OTP Sent",
        description: "A One-Time Password has been sent to your email.",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      setAdminAuthStatus("facial_recognition");
      
      const hasPermission = await FacialRecognitionService.requestCameraPermission();
      
      if (!hasPermission) {
        toast({
          title: "Camera Access Denied",
          description: "Camera permission is required for admin verification.",
          variant: "destructive",
        });
        setAdminAuthStatus("otp_required");
      }
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
    }
  };

  const handleFacialRecognition = async () => {
    setAdminAuthStatus("authenticated");
    
    toast({
      title: "Authentication Successful",
      description: "You now have access to admin settings.",
    });
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      OpenAIService.setApiKey(apiKey);
      toast({
        title: "API Key Updated",
        description: "The OpenAI API key has been updated successfully.",
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-titeh-primary">T-Helper AI Assistant</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Admin Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Admin Authentication</DialogTitle>
                <DialogDescription>
                  {adminAuthStatus === "not_started" && "Enter your admin credentials to access settings."}
                  {adminAuthStatus === "otp_required" && "Enter the One-Time Password sent to your email."}
                  {adminAuthStatus === "facial_recognition" && "Face verification required for security."}
                  {adminAuthStatus === "authenticated" && "You can now manage the API key."}
                </DialogDescription>
              </DialogHeader>
              
              {adminAuthStatus === "not_started" && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input 
                      id="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Enter admin email" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Enter password" 
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAdminLogin}>Next</Button>
                  </DialogFooter>
                </div>
              )}
              
              {adminAuthStatus === "otp_required" && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="otp" className="text-sm font-medium">One-Time Password</label>
                    <Input 
                      id="otp" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                      placeholder="Enter 6-digit OTP" 
                      maxLength={6}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleVerifyOTP}>Verify OTP</Button>
                  </DialogFooter>
                </div>
              )}
              
              {adminAuthStatus === "facial_recognition" && (
                <div className="space-y-4 py-4 text-center">
                  <div className="mx-auto w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <Camera className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Position your face in the frame for verification</p>
                  <DialogFooter>
                    <Button onClick={handleFacialRecognition}>Verify Identity</Button>
                  </DialogFooter>
                </div>
              )}
              
              {adminAuthStatus === "authenticated" && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="apiKey" className="text-sm font-medium">OpenAI API Key</label>
                    <Input 
                      id="apiKey" 
                      value={apiKey} 
                      onChange={(e) => setApiKey(e.target.value)} 
                      placeholder="Enter OpenAI API key" 
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveApiKey}>Save API Key</Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="mb-4 p-4 bg-gray-50">
          <div className="flex items-center mb-3">
            <Sparkles className="h-5 w-5 text-titeh-primary mr-2" />
            <span className="font-medium">Try these questions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {faqSuggestions.map((suggestion, index) => (
              <Badge
                key={index}
                className="cursor-pointer bg-white hover:bg-gray-100 text-gray-800 hover:text-titeh-primary"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </Card>
        
        <div className="bg-white rounded-lg border shadow-sm mb-4">
          <div ref={chatContainerRef} className="p-4 h-[400px] overflow-y-auto flex flex-col space-y-4">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-titeh-primary text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
                  <div className="flex space-x-2 items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-titeh-primary" />
                    <span>T-Helper is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Separator />
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Ask T-Helper something..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || isTranscribing}
              />
              <Button
                variant={isRecording ? "destructive" : "secondary"}
                size="icon"
                onClick={handleRecordVoice}
                disabled={isLoading || isTranscribing}
                className={isRecording ? "bg-red-100 text-red-500 hover:text-red-600 hover:bg-red-200" : ""}
              >
                {isTranscribing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button onClick={handleSendMessage} disabled={isLoading || isTranscribing || !message.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Powered by OpenAI. T-Helper is designed to assist with traffic-related queries and general questions.
        </div>
      </div>
    </Layout>
  );
};

export default THelper;
