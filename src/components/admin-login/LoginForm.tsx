
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeOff, Eye, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AuthService from "@/services/auth-service";
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: () => void;
  isVerifying: boolean;
}

const LoginForm = ({ email, setEmail, password, setPassword, onSubmit, isVerifying }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

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
          onClick={onSubmit} 
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
};

export default LoginForm;
