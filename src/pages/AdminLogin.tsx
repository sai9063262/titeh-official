
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthService from "@/services/auth-service";
import { Card } from "@/components/ui/card";
import LoginForm from "@/components/admin-login/LoginForm";
import OtpForm from "@/components/admin-login/OtpForm";
import CaptchaForm from "@/components/admin-login/CaptchaForm";
import AccountLockedMessage from "@/components/admin-login/AccountLockedMessage";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      navigate("/admin-dashboard");
      return;
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
      console.log("Attempting login with:", email, password);
      const isValid = AuthService.verifyCredentials(email, password);
      console.log("Authentication result:", isValid);
      
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
        
        // Redirect to admin dashboard
        navigate("/admin-dashboard");
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
      return <AccountLockedMessage lockTimeRemaining={lockTimeRemaining} />;
    }

    switch (step) {
      case "credentials":
        return (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onSubmit={handleCredentialSubmit}
            isVerifying={isVerifying}
          />
        );
      case "otp":
        return (
          <OtpForm
            email={email}
            otpValue={otpValue}
            setOtpValue={setOtpValue}
            onSubmit={handleOtpSubmit}
            onResendOtp={handleResendOTP}
            onGoBack={() => {
              setStep("credentials");
              setOtpValue("");
            }}
            isVerifying={isVerifying}
          />
        );
      case "captcha":
        return (
          <CaptchaForm
            captchaText={captchaText}
            captchaValue={captchaValue}
            setCaptchaValue={setCaptchaValue}
            onSubmit={handleCaptchaSubmit}
            onRefreshCaptcha={generateCaptcha}
            onGoBack={() => {
              setStep("otp");
              setCaptchaValue("");
            }}
            isVerifying={isVerifying}
          />
        );
      default:
        return null;
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
