
import { useState, useEffect, useRef } from "react";
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
import { Mic, X, Loader2 } from "lucide-react";

const FloatingTHelper = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
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
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again later.",
        variant: "destructive",
      });
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
          setQuery(transcribedText);
          
          // Automatically ask the question after transcription
          setTimeout(() => {
            handleAskQuestion();
          }, 500);
        } catch (error) {
          console.error('Error processing voice:', error);
          toast({
            title: "Error",
            description: "Failed to process voice input. Please try typing your question.",
            variant: "destructive"
          });
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly...",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Microphone access denied. Please check your browser permissions.",
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

  const handleVoiceInput = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
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
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-5 w-5 animate-spin text-titeh-primary" />
                <span className="ml-2 text-gray-500">Thinking...</span>
              </div>
            ) : response ? (
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
              disabled={isLoading || isTranscribing}
            />
            <Button 
              size="sm"
              variant={isRecording ? "destructive" : "ghost"}
              onClick={handleVoiceInput}
              disabled={isLoading || isTranscribing}
              className={isRecording ? "bg-red-100 hover:bg-red-200" : ""}
            >
              {isTranscribing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className={`h-4 w-4 ${isRecording ? "text-red-500" : ""}`} />
              )}
            </Button>
            <Button 
              size="sm" 
              onClick={handleAskQuestion}
              disabled={isLoading || isTranscribing || !query.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
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
