
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Send, MessageSquare, Settings, Lock, User, Key } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import OpenAIService from "@/services/openai-service";
import AuthService from "@/services/auth-service";
import AdminLoginDialog from "@/components/admin/AdminLoginDialog";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const THelper = () => {
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add a welcome message when the component mounts
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I am T-Helper, your AI assistant for driver verification and traffic safety. How can I assist you today?',
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSendQuestion = async () => {
    if (!question.trim()) return;
    
    // Add user message to the chat
    const userMessage: Message = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsProcessing(true);
    
    try {
      // Get response from OpenAI
      const response = await OpenAIService.askTHelper(question);
      
      // Add assistant response to the chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setQuestion("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  const isAdmin = () => {
    return AuthService.isLoggedIn();
  };

  const handleApiKeyUpdate = () => {
    if (!newApiKey.trim()) {
      toast({
        title: "Error",
        description: "API key cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    // Verify admin credentials for API key changes
    setIsAdminLoginOpen(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    
    // Update the API key
    OpenAIService.setApiKey(newApiKey);
    
    toast({
      title: "Success",
      description: "API key has been updated successfully",
    });
    
    setApiKeyDialogOpen(false);
    setNewApiKey("");
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFrequentlyAskedQuestions = () => {
    return [
      "How do I verify my driver's license?",
      "What documents do I need for driver verification?",
      "How does facial recognition work in this app?",
      "Is my data secure in this application?",
      "What should I do if verification fails?",
      "How can I update my driver profile?"
    ];
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">T-Helper AI Assistant</h1>
        
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <MessageSquare className="text-titeh-primary mr-2" />
            <h2 className="text-lg font-semibold">Chat with T-Helper</h2>
          </div>
          
          {isAdmin() && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setApiKeyDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Key size={16} />
              <span>API Key</span>
            </Button>
          )}
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user' 
                        ? 'bg-titeh-primary text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="text-sm">{msg.content}</div>
                    <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="text-left mb-4">
                  <div className="inline-block max-w-[80%] rounded-lg p-3 bg-gray-200 text-gray-800">
                    <div className="flex items-center">
                      <div className="dot-typing"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask T-Helper a question..."
                className="resize-none"
                rows={2}
              />
              <Button 
                onClick={handleSendQuestion}
                disabled={isProcessing || !question.trim()}
                className="bg-titeh-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Frequently Asked Questions */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-md">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getFrequentlyAskedQuestions().map((question, index) => (
                <Button 
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-2"
                  onClick={() => {
                    setQuestion(question);
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Alert className="bg-blue-50 border-blue-200 mb-4">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">T-Helper Assistance</AlertTitle>
          <AlertDescription className="text-blue-700">
            T-Helper can answer questions about driver verification, traffic safety, app usage, and more. 
            All interactions are secure and private.
          </AlertDescription>
        </Alert>
        
        {/* API Key Update Dialog */}
        <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update OpenAI API Key</DialogTitle>
              <DialogDescription>
                This will update the API key used for T-Helper. Admin authentication is required.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="apiKey" className="text-sm font-medium">
                  New API Key
                </label>
                <Input
                  id="apiKey"
                  type="password"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder="sk-..."
                />
              </div>
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                <div className="flex items-start">
                  <Lock className="h-4 w-4 text-amber-600 mt-0.5 mr-2" />
                  <p className="text-sm text-amber-800">
                    API keys are sensitive credentials. The key will be encrypted and stored securely.
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApiKeyUpdate} className="bg-titeh-primary">
                Update Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Admin Login Dialog */}
        <AdminLoginDialog 
          isOpen={isAdminLoginOpen} 
          onClose={() => setIsAdminLoginOpen(false)}
          onSuccess={handleAdminLoginSuccess}
          purpose="API Key Update"
        />
      </div>
      
      <style jsx>{`
        .dot-typing {
          position: relative;
          left: -9999px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #6b7280;
          color: #6b7280;
          box-shadow: 9984px 0 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          animation: dot-typing 1.5s infinite linear;
        }

        @keyframes dot-typing {
          0% {
            box-shadow: 9984px 0 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          }
          16.667% {
            box-shadow: 9984px -10px 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          }
          33.333% {
            box-shadow: 9984px 0 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          }
          50% {
            box-shadow: 9984px 0 0 0 #6b7280, 9999px -10px 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          }
          66.667% {
            box-shadow: 9984px 0 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          }
          83.333% {
            box-shadow: 9984px 0 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px -10px 0 0 #6b7280;
          }
          100% {
            box-shadow: 9984px 0 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          }
        }
      `}</style>
    </Layout>
  );
};

export default THelper;
