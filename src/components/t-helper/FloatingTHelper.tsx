
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
import { Send, Mic, MicOff, X, Loader2, Volume2 } from "lucide-react";
import OpenAIService from "@/services/openai-service";
import { useToast } from "@/components/ui/use-toast";

const FloatingTHelper = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const durationTimerRef = useRef<number | null>(null);
  
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

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        try {
          setIsTranscribing(true);
          const transcribedText = await OpenAIService.transcribeAudio(audioBlob);
          setQuery(transcribedText);
          
          if (transcribedText.includes("transcribe accurately") || transcribedText.includes("couldn't transcribe")) {
            toast({
              title: "Transcription Notice",
              description: "Voice service is currently running in offline mode.",
            });
          } else {
            // Automatically ask the question after transcription
            setTimeout(() => {
              handleAskQuestion();
            }, 500);
          }
        } catch (error) {
          console.error('Error processing voice:', error);
          toast({
            title: "Error",
            description: "Failed to process voice input. Please try typing your question.",
            variant: "destructive"
          });
        } finally {
          setIsTranscribing(false);
          setRecordingDuration(0);
          if (durationTimerRef.current) {
            window.clearInterval(durationTimerRef.current);
            durationTimerRef.current = null;
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer for recording duration
      durationTimerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
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

  const handlePlayAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      if (durationTimerRef.current) {
        window.clearInterval(durationTimerRef.current);
      }
    };
  }, [isRecording, audioUrl]);

  // Handle audio ended event
  useEffect(() => {
    const audioElement = audioRef.current;
    
    const handleAudioEnded = () => {
      setIsPlaying(false);
    };
    
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnded);
    }
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [audioRef.current]);

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
          
          {audioUrl && (
            <div className="p-2 bg-gray-50 flex items-center gap-2 mb-2 rounded-md">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 p-0" 
                onClick={handlePlayAudio}
              >
                {isPlaying ? <X className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </Button>
              <div className="text-xs text-gray-500">Voice recording</div>
              <audio ref={audioRef} src={audioUrl} className="hidden" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-red-500 h-5 text-xs p-0"
                onClick={() => {
                  if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                    setAudioUrl(null);
                  }
                }}
              >
                Clear
              </Button>
            </div>
          )}
          
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
              className={`relative ${isRecording ? "bg-red-100 hover:bg-red-200" : ""}`}
            >
              {isTranscribing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isRecording ? (
                <>
                  <MicOff className={`h-4 w-4 text-red-500`} />
                  <span className="absolute -top-1 -right-1 text-[8px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {recordingDuration < 60 ? recordingDuration : '59+'}
                  </span>
                </>
              ) : (
                <Mic className={`h-4 w-4`} />
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
