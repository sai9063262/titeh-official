
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import AuthService from "@/services/auth-service";
import { useToast } from "@/hooks/use-toast";

interface AdminSectionProps {
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  onLogout: () => void;
}

const AdminSection = ({ isAdminLoggedIn, adminEmail, onLogout }: AdminSectionProps) => {
  const navigate = useNavigate();

  if (!isAdminLoggedIn) return null;

  return (
    <div className="mb-6 bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-100">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-purple-800">Admin Mode Active</h2>
          <p className="text-sm text-purple-600">Logged in as {adminEmail}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/admin-dashboard")}
          >
            Admin Dashboard
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSection;
