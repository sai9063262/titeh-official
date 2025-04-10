
import { CreditCard, Bike, Car, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const LoansSection = () => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Loans</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <CreditCard className="text-titeh-primary mb-2" />
          <Link to="/vehicle/loans/personal" className="text-sm text-center">Personal Loan</Link>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <Bike className="text-titeh-primary mb-2" />
          <Link to="/vehicle/loans/new-bike" className="text-sm text-center">New Bike Loan</Link>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <Car className="text-titeh-primary mb-2" />
          <Link to="/vehicle/loans/used-car" className="text-sm text-center">Used Car Loan</Link>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center h-28">
          <Clock className="text-titeh-primary mb-2" />
          <Link to="/vehicle/loans/old-bike" className="text-sm text-center">Loan On Old Bike</Link>
        </Card>
      </div>
    </div>
  );
};

export default LoansSection;
