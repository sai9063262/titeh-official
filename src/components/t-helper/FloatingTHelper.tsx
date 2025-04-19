import { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import OpenAIService from "@/services/openai-service";
import { useToast } from "@/components/ui/use-toast";
import { Mic, X } from "lucide-react";
import { useRef } from "react";

const FloatingTHelper = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const handleAskQuestion = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const answer = await OpenAIService.askTHelper(query);
      setResponse(answer);
    } catch (error) {
      console.error("Error getting response:", error);
      setResponse("Sorry, I couldn't process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const handleFullOpen = () => {
    navigate("/t-helper");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        
        reader.onload = async () => {
          if (reader.result && typeof reader.result === 'string') {
            try {
              setIsLoading(true);
              const transcribedText = "What are the traffic rules?"; // Replace with actual transcription
              setQuery(transcribedText);
              handleAskQuestion();
            } catch (error) {
              console.error('Error processing voice:', error);
              toast({
                title: "Error",
                description: "Failed to process voice input",
                variant: "destructive"
              });
            } finally {
              setIsLoading(false);
            }
          }
        };

        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Microphone access denied",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleVoiceInput = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 p-3 shadow-lg bg-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium flex items-center">
              <Bot className="h-4 w-4 mr-1 text-titeh-primary" />
              Quick Help
            </h3>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={handleFullOpen}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-maximize-2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-md mb-3 h-32 overflow-y-auto text-sm">
            {response ? (
              <p>{response}</p>
            ) : (
              <p className="text-gray-500">Ask T-Helper a quick question...</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Type your question..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              size={3}
              className="text-sm"
            />
            <Button 
              size="sm"
              variant="ghost"
              onClick={handleVoiceInput}
              className={isRecording ? "bg-red-100" : ""}
            >
              <Mic className={`h-4 w-4 ${isRecording ? "text-red-500" : ""}`} />
            </Button>
            <Button 
              size="sm" 
              onClick={handleAskQuestion}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-titeh-primary hover:bg-titeh-primary/90"
                onClick={() => setIsOpen(true)}
              >
                <Bot className="h-6 w-6 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ask T-Helper</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default FloatingTHelper;
