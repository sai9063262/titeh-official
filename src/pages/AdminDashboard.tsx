
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Shield, UserPlus, Bell, Newspaper, Settings2, FileEdit, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AuthService from "@/services/auth-service";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!AuthService.isLoggedIn()) {
      navigate("/admin-login");
      return;
    }
    
    setAdminEmail(AuthService.getAdminEmail());
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of admin mode",
    });
    navigate("/settings");
  };

  const adminFeatures = [
    {
      title: "Admin Dashboard",
      icon: <Shield className="h-5 w-5 text-purple-500" />,
      description: "View system statistics and traffic data",
      path: "/admin/dashboard",
      badge: "Admin Only"
    },
    {
      title: "Manage Drivers",
      icon: <UserPlus className="h-5 w-5 text-purple-500" />,
      description: "Add, edit, or remove driver records",
      path: "/admin-driver-details",
      badge: "Admin Only"
    },
    {
      title: "Edit Content",
      icon: <FileEdit className="h-5 w-5 text-purple-500" />,
      description: "Modify app content, text and information",
      path: "/admin/content",
      badge: "Admin Only"
    },
    {
      title: "Update Features",
      icon: <Settings2 className="h-5 w-5 text-purple-500" />,
      description: "Enable or disable app features",
      path: "/admin/features",
      badge: "Admin Only"
    },
    {
      title: "Breaking News",
      icon: <Newspaper className="h-5 w-5 text-purple-500" />,
      description: "Publish important announcements",
      path: "/admin/news",
      badge: "Admin Only"
    },
    {
      title: "Alert Management",
      icon: <Bell className="h-5 w-5 text-purple-500" />,
      description: "Configure and send system alerts",
      path: "/admin/alerts",
      badge: "Admin Only"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-purple-600 mr-2" />
              <div>
                <h2 className="font-semibold text-purple-800">Admin Mode Active</h2>
                <p className="text-sm text-purple-600">
                  Logged in as {adminEmail}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-bold">Admin Features</h1>

        <div className="grid grid-cols-1 gap-4">
          {adminFeatures.map((feature, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 rounded-none"
                  onClick={() => navigate(feature.path)}
                >
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-purple-50 rounded-full">
                      {feature.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{feature.title}</div>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {feature.badge && (
                      <span className="mr-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {feature.badge}
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-8">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Admin Access Information</h3>
              <p className="text-sm text-blue-600 mt-1">
                As an administrator, you have full access to modify app content and manage driver records. 
                All changes you make will be permanently saved to the system database.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
