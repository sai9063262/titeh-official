
import Layout from "@/components/Layout";
import { 
  Languages, MapPin, CreditCard, Bell, RefreshCw, Cloud, 
  UserCircle, History, PlusCircle, Bluetooth, Wifi, Shield, Smartphone
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Settings = () => {
  const settingsItems = [
    { icon: <Languages className="text-titeh-primary text-xl" />, label: "Language", link: "/settings/language" },
    { icon: <MapPin className="text-titeh-primary text-xl" />, label: "Location Mode", link: "/settings/location" },
    { icon: <CreditCard className="text-titeh-primary text-xl" />, label: "Payment Methods", link: "/settings/payment" },
    { icon: <Bell className="text-titeh-primary text-xl" />, label: "Alert Preferences", link: "/settings/alerts" },
    { icon: <RefreshCw className="text-titeh-primary text-xl" />, label: "Data Sync", link: "/settings/sync" },
    { icon: <Cloud className="text-titeh-primary text-xl" />, label: "Backup Options", link: "/settings/backup" },
    { icon: <UserCircle className="text-titeh-primary text-xl" />, label: "User Roles", link: "/settings/roles" },
    { icon: <History className="text-titeh-primary text-xl" />, label: "History Management", link: "/settings/history" },
    { icon: <PlusCircle className="text-titeh-primary text-xl" />, label: "Vehicle Management", link: "/settings/vehicle" },
  ];
  
  const connectivityItems = [
    { icon: <Bluetooth className="text-blue-500 text-xl" />, label: "Bluetooth Settings", link: "/device-settings", badge: "New" },
    { icon: <Wifi className="text-blue-500 text-xl" />, label: "Wi-Fi Settings", link: "/device-settings?tab=wifi", badge: "New" },
    { icon: <Smartphone className="text-blue-500 text-xl" />, label: "Admin Driver Management", link: "/admin-driver-details", badge: "New" },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Settings</h1>
        
        <h2 className="text-lg font-semibold mb-4">App Settings</h2>
        <div className="space-y-4 mb-8">
          {settingsItems.map((item, index) => (
            <Link to={item.link} key={index}>
              <Card className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="mr-4 w-8">{item.icon}</div>
                  <span className="font-medium">{item.label}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        <h2 className="text-lg font-semibold mb-4">Device Connectivity & Admin</h2>
        <div className="space-y-4 mb-8">
          {connectivityItems.map((item, index) => (
            <Link to={item.link} key={index}>
              <Card className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 w-8">{item.icon}</div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        <Card className="p-4 bg-blue-50">
          <h2 className="font-semibold mb-2">Coming Soon</h2>
          <p className="text-sm text-gray-600">Support for user registration and OTP verification will be available in the next update.</p>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
