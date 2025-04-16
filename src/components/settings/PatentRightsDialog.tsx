
import { useState, useEffect } from "react";
import { 
  DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, Eye, EyeOff, RefreshCw, KeyRound, Check, 
  X, LockKeyhole, Calendar, User
} from "lucide-react";
import AuthService from "@/services/auth-service";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { format } from "date-fns";
import { secureAdminCredentials } from "@/lib/adminConfig";

interface PatentRightsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type VerificationStep = "login" | "otp" | "puzzle" | "display";

const PatentRightsDialog = ({ isOpen, onClose }: PatentRightsDialogProps) => {
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState<VerificationStep>("login");
  const [puzzlePosition, setPuzzlePosition] = useState(0);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [verificationTimestamp, setVerificationTimestamp] = useState<Date | null>(null);
  
  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      if (currentStep !== "display") {
        setEmail("");
        setPassword("");
        setOtpValue("");
        setCurrentStep("login");
        setPuzzlePosition(0);
        setPuzzleComplete(false);
      }
    }
  }, [isOpen, currentStep]);
  
  const handleCredentialSubmit = () => {
    setIsVerifying(true);
    
    // Small delay to show loading state
    setTimeout(() => {
      // Check if email is one of the admin emails
      if (email !== "saikumarpanchagiri058@gmail.com" && email !== "nallarahuladmin057@gmail.com") {
        toast({
          title: "Access Denied",
          description: "Only authorized patent holders can access this section",
          variant: "destructive",
        });
        setIsVerifying(false);
        return;
      }
      
      // Verify credentials using the secureAdminCredentials
      if (secureAdminCredentials.validateCredentials(email, password)) {
        // Generate OTP
        const otp = AuthService.generateOTP();
        
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${email}. For demo: ${otp}`,
        });
        
        setCurrentStep("otp");
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
      
      setIsVerifying(false);
    }, 1000);
  };
  
  const handleOtpSubmit = () => {
    setIsVerifying(true);
    
    setTimeout(() => {
      if (otpValue.length !== 6) {
        toast({
          title: "Invalid OTP",
          description: "Please enter all 6 digits of the OTP",
          variant: "destructive",
        });
        setIsVerifying(false);
        return;
      }
      
      const isOtpValid = AuthService.verifyOTP(otpValue);
      
      if (isOtpValid) {
        setCurrentStep("puzzle");
        toast({
          title: "OTP Verified",
          description: "Please complete the security puzzle to continue",
        });
      } else {
        if (AuthService.isAccountLocked()) {
          toast({
            title: "Account Locked",
            description: `Too many failed attempts. Account locked for ${AuthService.getLockedTimeRemaining()} minutes.`,
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
      
      setIsVerifying(false);
    }, 1000);
  };
  
  const handlePuzzleComplete = () => {
    setIsVerifying(true);
    
    setTimeout(() => {
      setVerificationTimestamp(new Date());
      setCurrentStep("display");
      setIsVerifying(false);
      
      toast({
        title: "Verification Complete",
        description: "Patent rights information is now available",
      });
    }, 1000);
  };
  
  const handlePuzzleChange = (value: number) => {
    setPuzzlePosition(value);
    if (value >= 95) {
      setPuzzleComplete(true);
    } else {
      setPuzzleComplete(false);
    }
  };
  
  const handleResendOTP = () => {
    const generatedOtp = AuthService.generateOTP();
    
    toast({
      title: "OTP Resent",
      description: `New verification code sent to ${email}. For demo: ${generatedOtp}`,
    });
  };
  
  const renderVerificationStep = () => {
    switch (currentStep) {
      case "login":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Patent Rights Verification</DialogTitle>
              <DialogDescription>
                Please verify your identity to access patent information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Patent Holder Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
            </div>
            
            <DialogFooter>
              <Button
                onClick={handleCredentialSubmit}
                className="w-full bg-titeh-primary"
                disabled={!email || !password || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    Verify Identity
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        );
        
      case "otp":
        return (
          <>
            <DialogHeader>
              <DialogTitle>OTP Verification</DialogTitle>
              <DialogDescription>
                A verification code has been sent to {email}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter the verification code</Label>
                <div className="flex justify-center py-4">
                  <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col space-y-2">
              <Button 
                onClick={handleOtpSubmit} 
                className="w-full bg-titeh-primary"
                disabled={otpValue.length !== 6 || isVerifying}
              >
                {isVerifying ? (
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
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleResendOTP}
                disabled={isVerifying}
              >
                Resend OTP
              </Button>
            </DialogFooter>
          </>
        );
        
      case "puzzle":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Security Verification</DialogTitle>
              <DialogDescription>
                Complete the security puzzle to continue
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="text-center mb-4">
                <h3 className="font-medium">Slide the puzzle piece to the target</h3>
                <p className="text-sm text-gray-500">Drag the slider all the way to the right</p>
              </div>
              
              <div className="h-32 bg-white rounded-md border relative">
                <div 
                  className={`absolute left-0 top-0 h-8 w-8 bg-green-500 rounded transition-all duration-300`}
                  style={{ left: `${puzzlePosition}%` }}
                ></div>
                <div className="absolute right-0 top-0 h-8 w-8 bg-gray-200 rounded border-2 border-dashed border-green-500"></div>
                
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={puzzlePosition}
                  className="absolute bottom-4 left-0 right-0 mx-auto w-4/5"
                  onChange={(e) => handlePuzzleChange(parseInt(e.target.value))}
                />
              </div>
              
              {puzzleComplete && (
                <div className="mt-4 text-center text-green-600 flex items-center justify-center">
                  <Check className="mr-1 h-4 w-4" />
                  Puzzle completed successfully
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                onClick={handlePuzzleComplete}
                className="w-full bg-titeh-primary"
                disabled={!puzzleComplete || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Continue to Patent Rights
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        );
        
      case "display":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center text-titeh-primary">
                <Shield className="mr-2 h-5 w-5" />
                Patent Rights Information
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="text-sm text-gray-500 flex items-center justify-center mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  Verified on: {verificationTimestamp 
                    ? format(verificationTimestamp, "PPpp") 
                    : format(new Date(), "PPpp")}
                </span>
              </div>
              
              {/* First Patent Holder */}
              <div className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row items-center mb-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 sm:mb-0 sm:mr-4 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">PANCHAGIRI SAIKUMAR</h3>
                    <p className="text-gray-600">Lead Developer and Primary Innovator</p>
                  </div>
                </div>
              </div>
              
              {/* Second Patent Holder */}
              <div className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row items-center mb-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 sm:mb-0 sm:mr-4 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">NALLA RAHUL</h3>
                    <p className="text-gray-600">Co-Developer and Key Contributor</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Patent Rights Declaration</h4>
                <p className="text-sm">
                  The primary patent rights of this app belong to PANCHAGIRI SAIKUMAR, followed by NALLA RAHUL. 
                  Both have complete patent rights to this app, including intellectual property ownership, 
                  modification rights, and distribution authority, effective as of April 16, 2025.
                </p>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setVerificationTimestamp(new Date());
                  toast({
                    title: "Verification Refreshed",
                    description: "Patent rights information has been verified again",
                  });
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Verification
              </Button>
              
              <Button onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        );
    }
  };
  
  return (
    <DialogContent className="sm:max-w-md">
      {renderVerificationStep()}
    </DialogContent>
  );
};

export default PatentRightsDialog;
