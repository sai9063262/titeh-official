
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bluetooth, Database, Shield, Smartphone } from "lucide-react";
import PatentRightsCard from "./PatentRightsCard";

interface DeviceConnectivityItemsProps {
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
}

const DeviceConnectivityItems = ({ isAdminLoggedIn, onAdminClick }: DeviceConnectivityItemsProps) => {
  return (
    <div className="space-y-4 mb-8">
      <Link to="/device-settings">
        <Card className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center">
            <Bluetooth className="h-5 w-5 text-titeh-primary mr-3" />
            <span className="font-medium">Bluetooth & Device Settings</span>
          </div>
        </Card>
      </Link>
      
      <Link to="/device-settings?tab=database">
        <Card className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-titeh-primary mr-3" />
            <span className="font-medium">Database Connection</span>
          </div>
        </Card>
      </Link>
      
      <PatentRightsCard isAdminLoggedIn={isAdminLoggedIn} />
      
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Smartphone className="h-5 w-5 text-titeh-primary mr-3" />
            <span className="font-medium">Admin Panel</span>
          </div>
          
          <Button onClick={onAdminClick} variant="outline" size="sm">
            {isAdminLoggedIn ? "Dashboard" : "Login"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DeviceConnectivityItems;
