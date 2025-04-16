
import { useState } from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminLoginDialog from "@/components/admin/AdminLoginDialog";
import AuthService from "@/services/auth-service";

// Import refactored components
import AdminSection from "@/components/settings/AdminSection";
import AppVersionCard from "@/components/settings/AppVersionCard";
import SettingsItems from "@/components/settings/SettingsItems";
import DeviceConnectivityItems from "@/components/settings/DeviceConnectivityItems";
import UpdateNotes from "@/components/settings/UpdateNotes";

const Settings = () => {
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isAdminLoggedIn = AuthService.isLoggedIn();
  const adminEmail = AuthService.getAdminEmail();
  
  const handleAdminLogin = () => {
    if (isAdminLoggedIn) {
      // If already logged in, go to admin dashboard
      navigate("/admin-dashboard");
    } else {
      // Open dialog or navigate to login page
      navigate("/admin-login");
    }
  };

  const handleAdminLogout = () => {
    AuthService.logout();
    toast({
      title: "Logged out",
      description: "You have been logged out of admin mode",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Settings</h1>
        
        <AdminSection 
          isAdminLoggedIn={isAdminLoggedIn}
          adminEmail={adminEmail}
          onLogout={handleAdminLogout}
        />
        
        <AppVersionCard />
        
        <h2 className="text-lg font-semibold mb-4">App Settings</h2>
        <SettingsItems />
        
        <h2 className="text-lg font-semibold mb-4">Device Connectivity & Admin</h2>
        <DeviceConnectivityItems 
          isAdminLoggedIn={isAdminLoggedIn}
          onAdminClick={handleAdminLogin}
        />
        
        <UpdateNotes />
      </div>
      
      {/* Admin Login Dialog */}
      <AdminLoginDialog 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          navigate("/admin-dashboard");
        }}
        purpose="Admin Access"
      />
    </Layout>
  );
};

export default Settings;
