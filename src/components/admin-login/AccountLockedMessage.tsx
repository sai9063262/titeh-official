
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface AccountLockedMessageProps {
  lockTimeRemaining: number;
}

const AccountLockedMessage = ({ lockTimeRemaining }: AccountLockedMessageProps) => {
  const navigate = useNavigate();

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
};

export default AccountLockedMessage;
