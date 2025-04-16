
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AppVersionCard = () => {
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);
  const { toast } = useToast();

  const handleCheckForUpdates = () => {
    setIsUpdatingApp(true);
    
    // Simulate checking for updates
    setTimeout(() => {
      setIsUpdatingApp(false);
      
      toast({
        title: "App is up to date",
        description: "You're running the latest version (v1.2.0)",
      });
    }, 2000);
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">TITEH App</h2>
          <p className="text-sm text-gray-500">Version 1.2.0</p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          disabled={isUpdatingApp}
          onClick={handleCheckForUpdates}
        >
          {isUpdatingApp ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Check for Updates
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AppVersionCard;
