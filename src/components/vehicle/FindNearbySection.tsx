
import { MapPin, Building, Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const FindNearbySection = () => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Find Place Near By Me</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <MapPin className="text-titeh-primary mb-2" />
          <Link to="/vehicle/nearby/fuel" className="text-sm text-center">Fuel Station</Link>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <Building className="text-titeh-primary mb-2" />
          <Link to="/vehicle/nearby/insurance" className="text-sm text-center">Insurance Office</Link>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <Store className="text-titeh-primary mb-2" />
          <Link to="/vehicle/nearby/dealer" className="text-sm text-center">Car Dealer</Link>
        </Card>
      </div>
    </div>
  );
};

export default FindNearbySection;
