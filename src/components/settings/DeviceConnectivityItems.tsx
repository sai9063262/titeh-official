
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Bluetooth, Wifi, Smartphone, MessageSquare, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeviceConnectivityItemsProps {
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
}

const DeviceConnectivityItems = ({ isAdminLoggedIn, onAdminClick }: DeviceConnectivityItemsProps) => {
  const { toast } = useToast();
  
  const connectivityItems = [
    { icon: <Bluetooth className="text-blue-500 text-xl" />, label: "Bluetooth Settings", link: "/device-settings", badge: "New" },
    { icon: <Wifi className="text-blue-500 text-xl" />, label: "Wi-Fi Settings", link: "/device-settings?tab=wifi", badge: "New" },
    { 
      icon: <Smartphone className="text-blue-500 text-xl" />, 
      label: "Admin Driver Management", 
      link: "/admin-driver-details", 
      badge: "Admin Only",
      adminRequired: true
    },
    { icon: <MessageSquare className="text-blue-500 text-xl" />, label: "T-Helper AI Assistant", link: "/t-helper", badge: "New" },
  ];

  return (
    <div className="space-y-4 mb-8">
      {connectivityItems.map((item, index) => (
        <Link 
          to={!item.adminRequired || isAdminLoggedIn ? item.link : "#"} 
          onClick={(e) => {
            if (item.adminRequired && !isAdminLoggedIn) {
              e.preventDefault();
              toast({
                title: "Admin Access Required",
                description: "Please login as administrator to access this feature",
                variant: "destructive",
              });
            }
          }}
          key={index}
        >
          <Card className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 w-8">{item.icon}</div>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-1 ${item.badge === 'Admin Only' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'} text-xs rounded-full`}>
                  {item.badge}
                </span>
              )}
            </div>
          </Card>
        </Link>
      ))}
      
      {/* Admin Login Card */}
      <Card 
        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" 
        onClick={onAdminClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4 w-8">
              <Lock className="text-purple-500 text-xl" />
            </div>
            <span className="font-medium">Admin Login</span>
          </div>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            Secure Access
          </span>
        </div>
      </Card>
    </div>
  );
};

export default DeviceConnectivityItems;
