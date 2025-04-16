
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface OtpFormProps {
  email: string;
  otpValue: string;
  setOtpValue: (otp: string) => void;
  onSubmit: () => void;
  onResendOtp: () => void;
  onGoBack: () => void;
  isVerifying: boolean;
}

const OtpForm = ({ 
  email, 
  otpValue, 
  setOtpValue, 
  onSubmit, 
  onResendOtp, 
  onGoBack, 
  isVerifying 
}: OtpFormProps) => {
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
          onClick={onSubmit} 
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
          onClick={onResendOtp}
          disabled={isVerifying}
        >
          Resend OTP
        </Button>
        <Button 
          variant="link" 
          className="w-full"
          onClick={onGoBack}
          disabled={isVerifying}
        >
          Go back
        </Button>
      </CardFooter>
    </>
  );
};

export default OtpForm;
