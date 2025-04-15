
import Layout from "@/components/Layout";
import { 
  Languages, MapPin, CreditCard, Bell, RefreshCw, Cloud, 
  UserCircle, History, PlusCircle, Bluetooth, Wifi, Shield, Smartphone,
  Settings as SettingsIcon, Loader2, AlertTriangle, MessageSquare
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);
  const { toast } = useToast();
  
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
    { icon: <Smartphone className="text-blue-500 text-xl" />, label: "Admin Driver Management", link: "/admin-driver-details", badge: "Admin Only" },
    { icon: <MessageSquare className="text-blue-500 text-xl" />, label: "T-Helper AI Assistant", link: "/t-helper", badge: "New" },
  ];

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
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Settings</h1>
        
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
                    <span className={`px-2 py-1 ${item.badge === 'Admin Only' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'} text-xs rounded-full`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="space-y-4 mb-8">
          <Card className="p-4 bg-blue-50">
            <div className="flex items-start">
              <AlertTriangle className="text-blue-500 mr-2 mt-1 flex-shrink-0" size={20} />
              <div>
                <h2 className="font-semibold mb-1">What's New in v1.2.0</h2>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Added Bluetooth and Wi-Fi device connectivity</li>
                  <li>Enhanced security with AES-256 encryption</li>
                  <li>Added Admin Driver Management panel</li>
                  <li>Google Sheets integration for driver data</li>
                  <li>New T-Helper AI Assistant for answering questions</li>
                </ul>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-amber-50">
            <h2 className="font-semibold mb-2 flex items-center">
              <SettingsIcon className="text-amber-500 mr-2" size={18} />
              Coming Soon
            </h2>
            <p className="text-sm text-gray-600">Enhanced driver verification and real-time traffic alerts will be available in the next update.</p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
