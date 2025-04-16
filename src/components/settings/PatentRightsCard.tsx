
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ChevronRight, LockKeyhole } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PatentRightsDialog from "./PatentRightsDialog";
import AuthService from "@/services/auth-service";

interface PatentRightsCardProps {
  isAdminLoggedIn: boolean;
}

const PatentRightsCard = ({ isAdminLoggedIn }: PatentRightsCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <Card className="p-4 mb-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-titeh-primary mr-3" />
          <span className="font-medium">Patent Rights of This App</span>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {isAdminLoggedIn ? (
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                <LockKeyhole className="h-5 w-5 text-gray-400" />
              </Button>
            )}
          </DialogTrigger>
          
          <PatentRightsDialog 
            isOpen={isDialogOpen} 
            onClose={() => setIsDialogOpen(false)} 
          />
        </Dialog>
      </div>
    </Card>
  );
};

export default PatentRightsCard;
