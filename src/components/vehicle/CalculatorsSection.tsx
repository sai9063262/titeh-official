
import { Gauge, Calculator, Percent, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const CalculatorsSection = () => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Calculators</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <Gauge className="text-titeh-primary mb-2" />
          <Link to="/vehicle/calculators/mileage" className="text-sm text-center">Mileage Tracking</Link>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <Calculator className="text-titeh-primary mb-2" />
          <Link to="/vehicle/calculators/loan" className="text-sm text-center">Loan Calculate</Link>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <Percent className="text-titeh-primary mb-2" />
          <Link to="/vehicle/calculators/gst" className="text-sm text-center">GST Calculate</Link>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <Clock className="text-titeh-primary mb-2" />
          <Link to="/vehicle/calculators/vehicle-age" className="text-sm text-center">Vehicle Age Calculate</Link>
        </Card>
      </div>
    </div>
  );
};

export default CalculatorsSection;
