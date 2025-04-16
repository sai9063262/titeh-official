
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CaptchaFormProps {
  captchaText: string;
  captchaValue: string;
  setCaptchaValue: (value: string) => void;
  onSubmit: () => void;
  onRefreshCaptcha: () => void;
  onGoBack: () => void;
  isVerifying: boolean;
}

const CaptchaForm = ({ 
  captchaText,
  captchaValue, 
  setCaptchaValue,
  onSubmit, 
  onRefreshCaptcha, 
  onGoBack, 
  isVerifying 
}: CaptchaFormProps) => {
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
          onClick={onSubmit} 
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
          onClick={onRefreshCaptcha}
          disabled={isVerifying}
        >
          Refresh CAPTCHA
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

export default CaptchaForm;
