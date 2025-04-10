
import { useState } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

// Import the refactored components
import LocationSelector from "@/components/vehicle/LocationSelector";
import PucStatusCard from "@/components/vehicle/PucStatusCard";
import PromotionalCard from "@/components/vehicle/PromotionalCard";
import VehicleTabs from "@/components/vehicle/VehicleTabs";
import GovernmentLinks from "@/components/vehicle/GovernmentLinks";

const Vehicle = () => {
  const [location, setLocation] = useState("HYDERABAD");
  const { toast } = useToast();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Vehicle Management</h1>
        
        {/* Location Dropdown */}
        <LocationSelector location={location} setLocation={setLocation} />
        
        {/* PUC Status Card */}
        <PucStatusCard />
        
        {/* Promotional Card */}
        <PromotionalCard />
        
        {/* Vehicle Tabs Component */}
        <VehicleTabs defaultValue="cars" />
        
        {/* Government Links Section */}
        <GovernmentLinks />
      </div>
    </Layout>
  );
};

export default Vehicle;
