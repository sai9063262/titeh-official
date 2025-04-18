
import { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FloatingTHelper = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-titeh-primary hover:bg-titeh-primary/90"
              onClick={() => navigate("/t-helper")}
            >
              <Bot className="h-6 w-6 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ask T-Helper</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingTHelper;
