
import { useState } from "react";
import { Car, Gavel, DollarSign, FileText, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const FourWheelersSection = () => {
  const { toast } = useToast();

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Four Wheelers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <Car className="text-titeh-primary mb-2" />
          <Link to="/vehicle/insurance" className="text-sm text-center">Renew Car Insurance</Link>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <Gavel className="text-titeh-primary mb-2" />
          <Link to="/traffic-safety/pay-challan" className="text-sm text-center">Pay Car Challan</Link>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <DollarSign className="text-titeh-primary mb-2" />
          <Link to="/vehicle/sell-car" className="text-sm text-center">Sell Your Car</Link>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <History className="text-titeh-primary mb-2" />
          <Link to="/vehicle/service-history" className="text-sm text-center">Car Service History</Link>
        </Card>
      </div>
    </div>
  );
};

export default FourWheelersSection;
