
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Languages, MapPin, CreditCard, Bell, RefreshCw, Cloud, UserCircle, History, PlusCircle } from "lucide-react";

const SettingsItems = () => {
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

  return (
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
  );
};

export default SettingsItems;
