
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, EyeOff, Eye, Lock, KeyRound, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AuthService from "@/services/auth-service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<"credentials" | "otp" | "captcha">("credentials");
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  // Check if already logged in
  useEffect(() => {
    if (AuthService.isLoggedIn()) {
      navigate("/settings");
    }
    
    // Check if account is locked
    if (AuthService.isAccountLocked()) {
      setIsLocked(true);
      setLockTimeRemaining(AuthService.getLockedTimeRemaining());
      
      // Set up timer to update remaining time
      const timer = setInterval(() => {
        const remaining = AuthService.getLockedTimeRemaining();
        setLockTimeRemaining(remaining);
        
        if (remaining <= 0) {
          setIsLocked(false);
          clearInterval(timer);
        }
      }, 60000); // Update every minute
      
      return () => clearInterval(timer);
    }
  }, [navigate]);

  const generateCaptcha = () => {
    // Simple captcha generator
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(captcha);
    return captcha;
  };

  useEffect(() => {
    if (step === "captcha") {
      generateCaptcha();
    }
  }, [step]);

  const handleCredentialSubmit = () => {
    setIsVerifying(true);
    
    setTimeout(() => {
      const isValid = AuthService.verifyCredentials(email, password);
      
      if (isValid) {
        // Generate OTP
        const generatedOtp = AuthService.generateOTP();
        
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${email}. For demo: ${generatedOtp}`,
        });
        
        setStep("otp");
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
      
      setIsVerifying(false);
    }, 800);
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
        // Move to CAPTCHA verification as final step
        setStep("captcha");
      } else {
        if (AuthService.isAccountLocked()) {
          setIsLocked(true);
          setLockTimeRemaining(AuthService.getLockedTimeRemaining());
          
          toast({
            title: "Account Locked",
            description: `Too many failed attempts. Account locked for ${AuthService.getLockedTimeRemaining()} minutes.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Invalid OTP",
            description: "The verification code is incorrect or expired",
            variant: "destructive",
          });
        }
      }
      
      setIsVerifying(false);
    }, 800);
  };

  const handleCaptchaSubmit = () => {
    setIsVerifying(true);
    
    setTimeout(() => {
      if (captchaValue.toLowerCase() === captchaText.toLowerCase()) {
        // Complete authentication
        AuthService.completeAuthentication();
        
        toast({
          title: "Login Successful",
          description: "You are now logged in as administrator",
        });
        
        // Redirect to settings page
        navigate("/settings");
      } else {
        toast({
          title: "CAPTCHA Failed",
          description: "Incorrect CAPTCHA. Please try again.",
          variant: "destructive",
        });
        
        // Generate a new CAPTCHA
        generateCaptcha();
      }
      
      setCaptchaValue("");
      setIsVerifying(false);
    }, 800);
  };

  const handleResendOTP = () => {
    const generatedOtp = AuthService.generateOTP();
    
    toast({
      title: "OTP Resent",
      description: `New verification code sent to ${email}. For demo: ${generatedOtp}`,
    });
  };

  const renderStepContent = () => {
    if (isLocked) {
      return (
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <Lock className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold">Account Locked</h2>
          <p className="text-gray-600">
            Too many failed login attempts. Please try again in {lockTimeRemaining} minutes.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Return to Home
          </Button>
        </div>
      );
    }

    switch (step) {
      case "credentials":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access admin features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
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
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mt-4">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Demo credentials:</span> Email: saikumarpanchagiri058@gmail.com
                  <br />
                  Password: $@!|&lt;u|\/|@r
                </p>
              </div>
            </CardContent>
            <CardFooter>
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
                ) : "Continue"}
              </Button>
            </CardFooter>
          </>
        );
      case "otp":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-center">OTP Sent</CardTitle>
              <CardDescription className="text-center">
                A verification code has been sent to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter the verification code sent to your email</Label>
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
            </CardContent>
            <CardFooter className="flex-col space-y-4">
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
                ) : "Verify OTP"}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={handleResendOTP}
                disabled={isVerifying}
              >
                Resend OTP
              </Button>
              <Button 
                variant="link" 
                className="w-full"
                onClick={() => {
                  setStep("credentials");
                  setOtpValue("");
                }}
                disabled={isVerifying}
              >
                Go back
              </Button>
            </CardFooter>
          </>
        );
      case "captcha":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-center">CAPTCHA Verification</CardTitle>
              <CardDescription className="text-center">
                Complete the CAPTCHA verification to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="captcha">CAPTCHA Verification</Label>
                <div className="flex justify-center py-4">
                  <div 
                    className="text-blue-600 font-bold text-xl bg-gray-100 px-4 py-3 rounded w-full text-center"
                    style={{ letterSpacing: "0.25em", position: "relative" }}
                  >
                    {captchaText}
                    {/* Add some random lines for security */}
                    <svg height="50" width="100%" style={{ position: "absolute", top: 0, left: 0 }}>
                      <line x1="0" y1="15" x2="100%" y2="30" style={{ stroke: "rgb(200,100,150)", strokeWidth: 1 }} />
                      <line x1="20%" y1="0" x2="80%" y2="100%" style={{ stroke: "rgb(100,200,50)", strokeWidth: 1 }} />
                      <line x1="50%" y1="0" x2="50%" y2="100%" style={{ stroke: "rgb(50,100,200)", strokeWidth: 1 }} />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <Input
                    id="captchaInput"
                    type="text"
                    placeholder="Enter CAPTCHA"
                    value={captchaValue}
                    onChange={(e) => setCaptchaValue(e.target.value)}
                    className="text-center"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button 
                onClick={handleCaptchaSubmit} 
                className="w-full bg-titeh-primary"
                disabled={!captchaValue || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : "Complete Login"}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => generateCaptcha()}
                disabled={isVerifying}
              >
                Refresh CAPTCHA
              </Button>
              <Button 
                variant="link" 
                className="w-full"
                onClick={() => {
                  setStep("otp");
                  setCaptchaValue("");
                }}
                disabled={isVerifying}
              >
                Go back
              </Button>
            </CardFooter>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          {renderStepContent()}
          
          <div className="mt-8 text-center border-t border-gray-100 pt-4">
            <div className="flex items-center justify-center text-sm text-green-600 mb-4">
              <Shield className="h-4 w-4 mr-1" />
              <span>Secured admin access</span>
            </div>
          </div>
        </Card>
      </div>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>&copy; 2025 Telangana Government</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Contact Us</a>
          <a href="#" className="hover:underline">Feedback</a>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
