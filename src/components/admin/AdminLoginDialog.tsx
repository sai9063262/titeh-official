
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, User, Lock, KeyRound, AlertCircle, Check, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthService from "@/services/auth-service";
import FacialRecognitionService from "@/services/facial-recognition-service";

interface AdminLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  purpose?: string;
}

const AdminLoginDialog = ({ isOpen, onClose, onSuccess, purpose = "Admin Login" }: AdminLoginDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [currentStep, setCurrentStep] = useState<"credentials" | "otp" | "security-task" | "facial-recognition">("credentials");
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityTask, setSecurityTask] = useState<"puzzle" | "sound">("puzzle");
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [soundSequence, setSoundSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Clear states when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep("credentials");
      setEmail("");
      setPassword("");
      setOtpCode("");
      setPuzzleCompleted(false);
      setSoundSequence([]);
      setUserSequence([]);
    } else {
      // Clean up camera stream if active
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setIsCameraOpen(false);
    }
  }, [isOpen]);

  // Generate sound sequence when security task is sound
  useEffect(() => {
    if (currentStep === "security-task" && securityTask === "sound") {
      generateSoundSequence();
    }
  }, [currentStep, securityTask]);

  const handleCredentialsSubmit = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const isValid = AuthService.verifyCredentials(email, password);
      
      if (isValid) {
        // Generate OTP for next step
        const otp = AuthService.generateOTP();
        
        toast({
          title: "OTP Sent",
          description: `A verification code has been sent to ${email}. For demo purposes, the OTP is: ${otp}`,
        });
        
        setCurrentStep("otp");
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
      
      setIsProcessing(false);
    }, 1000);
  };

  const handleOTPSubmit = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const isOTPValid = AuthService.verifyOTP(otpCode);
      
      if (isOTPValid) {
        // Randomly select security task
        setSecurityTask(Math.random() > 0.5 ? "puzzle" : "sound");
        setCurrentStep("security-task");
      } else {
        if (AuthService.isAccountLocked()) {
          const minutes = AuthService.getLockedTimeRemaining();
          toast({
            title: "Account Locked",
            description: `Too many failed attempts. Account locked for ${minutes} minutes.`,
            variant: "destructive",
          });
          onClose();
        } else {
          toast({
            title: "Invalid OTP",
            description: "The verification code is incorrect or expired",
            variant: "destructive",
          });
        }
      }
      
      setIsProcessing(false);
    }, 1000);
  };

  const handleSecurityTaskComplete = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setCurrentStep("facial-recognition");
      setIsProcessing(false);
    }, 1000);
  };

  const handleVerificationComplete = () => {
    AuthService.completeAuthentication();
    toast({
      title: "Authentication Successful",
      description: "You are now logged in as an administrator",
    });
    onSuccess();
  };

  // Security task: Puzzle simulation
  const handlePuzzleSlide = () => {
    // Simulate puzzle completion
    setPuzzleCompleted(true);
  };

  // Security task: Sound sequence
  const generateSoundSequence = () => {
    // Generate a random 4-tone sequence
    const sequence = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
    setSoundSequence(sequence);
    setUserSequence([]);
    
    // Play the sequence
    playSequence(sequence);
  };

  const playSequence = (sequence: number[]) => {
    // Play each tone in the sequence with delay
    sequence.forEach((tone, index) => {
      setTimeout(() => {
        playTone(tone);
      }, index * 700);
    });
  };

  const playTone = (toneIndex: number) => {
    const frequencies = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequencies[toneIndex];
      gainNode.gain.value = 0.5;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      // Stop after 500ms
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 500);
    } catch (error) {
      console.error("Error playing tone:", error);
    }
  };

  const handleToneClick = (toneIndex: number) => {
    playTone(toneIndex);
    
    const newSequence = [...userSequence, toneIndex];
    setUserSequence(newSequence);
    
    // Check if sequence is complete and correct
    if (newSequence.length === soundSequence.length) {
      const isCorrect = newSequence.every((tone, index) => tone === soundSequence[index]);
      
      if (isCorrect) {
        setPuzzleCompleted(true);
        toast({
          title: "Sequence Correct",
          description: "Sound sequence verified successfully",
        });
      } else {
        toast({
          title: "Sequence Incorrect",
          description: "The sequence does not match. Try again.",
          variant: "destructive",
        });
        setUserSequence([]);
        setTimeout(() => {
          playSequence(soundSequence);
        }, 1000);
      }
    }
  };

  // Facial recognition
  const enableCamera = async () => {
    try {
      setCameraError(null);
      setIsCameraOpen(true);
      
      const hasPermission = await FacialRecognitionService.requestCameraPermission();
      
      if (!hasPermission) {
        setCameraError("Camera permission denied");
        return;
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Use front camera for admin verification
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError("Could not access camera");
    }
  };

  const verifyFace = async () => {
    if (!videoRef.current || !canvasRef.current || !stream) return;
    
    setIsProcessing(true);
    
    try {
      // Capture image
      const imageData = await FacialRecognitionService.captureImage(
        videoRef.current,
        canvasRef.current
      );
      
      if (!imageData) {
        throw new Error("Failed to capture image");
      }
      
      // Verify admin face
      const result = await FacialRecognitionService.verifyAdmin(imageData);
      
      if (result.matched) {
        toast({
          title: "Verification Successful",
          description: `Face verified with ${result.confidence}% confidence`,
        });
        
        handleVerificationComplete();
      } else {
        toast({
          title: "Verification Failed",
          description: `Face not recognized (${result.confidence}% confidence)`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying face:", error);
      toast({
        title: "Verification Error",
        description: "An error occurred during facial verification",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Administrator Authentication</DialogTitle>
          <DialogDescription>
            {purpose} requires administrator authentication.
          </DialogDescription>
        </DialogHeader>
        
        {currentStep === "credentials" && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 mr-2" />
                <p className="text-sm text-amber-800">
                  For demo purposes: Admin email is saikumarpanchagiri058@gmail.com and password is $@!|&lt;u|\/|@r
                </p>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === "otp" && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter Verification Code</Label>
              <Input
                id="otp"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-start">
                <KeyRound className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
                <p className="text-sm text-blue-800">
                  A 6-digit verification code has been sent to your email. 
                  The code is valid for 5 minutes.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === "security-task" && (
          <div className="space-y-4 py-4">
            <Tabs defaultValue={securityTask} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="puzzle">Puzzle Challenge</TabsTrigger>
                <TabsTrigger value="sound">Sound Challenge</TabsTrigger>
              </TabsList>
              
              <TabsContent value="puzzle" className="mt-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <h3 className="font-medium">Complete the Puzzle</h3>
                    <p className="text-sm text-gray-500">Slide the puzzle piece to the target</p>
                  </div>
                  
                  <div className="h-32 bg-white rounded-md border relative">
                    <div 
                      className={`absolute left-0 top-0 h-8 w-8 bg-green-500 rounded transition-all duration-300 ${
                        puzzleCompleted ? 'left-[calc(100%-32px)]' : ''
                      }`}
                    ></div>
                    <div className="absolute right-0 top-0 h-8 w-8 bg-gray-200 rounded border-2 border-dashed border-green-500"></div>
                    
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      className="absolute bottom-4 left-0 right-0 mx-auto w-4/5"
                      onChange={(e) => {
                        if (parseInt(e.target.value) > 95) {
                          handlePuzzleSlide();
                        }
                      }}
                    />
                  </div>
                  
                  {puzzleCompleted && (
                    <div className="mt-4 text-center text-green-600 flex items-center justify-center">
                      <Check className="mr-1 h-4 w-4" />
                      Puzzle completed successfully
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="sound" className="mt-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <h3 className="font-medium">Repeat the Sound Sequence</h3>
                    <p className="text-sm text-gray-500">
                      Listen to the 4-tone sequence and repeat it
                    </p>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => playSequence(soundSequence)}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Play Sequence Again
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="h-16 bg-red-50 hover:bg-red-100"
                      onClick={() => handleToneClick(0)}
                    >
                      Tone 1
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-16 bg-blue-50 hover:bg-blue-100"
                      onClick={() => handleToneClick(1)}
                    >
                      Tone 2
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-16 bg-green-50 hover:bg-green-100"
                      onClick={() => handleToneClick(2)}
                    >
                      Tone 3
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-16 bg-yellow-50 hover:bg-yellow-100"
                      onClick={() => handleToneClick(3)}
                    >
                      Tone 4
                    </Button>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <div className="flex gap-2">
                      {soundSequence.map((_, index) => (
                        <div 
                          key={index}
                          className={`w-4 h-4 rounded-full ${
                            index < userSequence.length 
                              ? 'bg-green-500' 
                              : 'bg-gray-300'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {currentStep === "facial-recognition" && (
          <div className="space-y-4 py-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-center mb-4">
                <h3 className="font-medium">Facial Recognition</h3>
                <p className="text-sm text-gray-500">Verify your identity using facial recognition</p>
              </div>
              
              {!isCameraOpen ? (
                <div className="flex justify-center">
                  <Button onClick={enableCamera} className="bg-titeh-primary">
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden h-64">
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline
                      className="w-full h-full object-cover"
                      onLoadedMetadata={() => {
                        if (videoRef.current) {
                          videoRef.current.play();
                        }
                      }}
                    />
                    
                    <canvas ref={canvasRef} className="hidden" width="640" height="480" />
                    
                    {cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                        <div className="text-white text-center p-4">
                          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-400" />
                          <p>{cameraError}</p>
                          <Button 
                            onClick={enableCamera} 
                            variant="outline" 
                            className="mt-2 text-white border-white"
                          >
                            Retry
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-2 right-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white bg-opacity-20 text-white"
                        onClick={closeCamera}
                      >
                        Close Camera
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={verifyFace} 
                      className="bg-titeh-primary"
                      disabled={isProcessing || !stream}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <User className="mr-2 h-4 w-4" />
                          Verify Identity
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          {currentStep === "credentials" && (
            <Button 
              type="submit" 
              onClick={handleCredentialsSubmit} 
              className="bg-titeh-primary w-full sm:w-auto"
              disabled={!email || !password || isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Continue
                </>
              )}
            </Button>
          )}
          
          {currentStep === "otp" && (
            <Button 
              type="submit" 
              onClick={handleOTPSubmit} 
              className="bg-titeh-primary w-full sm:w-auto"
              disabled={otpCode.length !== 6 || isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Verify OTP
                </>
              )}
            </Button>
          )}
          
          {currentStep === "security-task" && (
            <Button 
              type="submit" 
              onClick={handleSecurityTaskComplete} 
              className="bg-titeh-primary w-full sm:w-auto"
              disabled={!puzzleCompleted || isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Continue
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginDialog;
