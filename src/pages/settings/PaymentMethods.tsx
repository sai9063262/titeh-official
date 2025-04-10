
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, CreditCard, Smartphone, Banknote, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentMethods = () => {
  const { toast } = useToast();
  
  const addPaymentMethod = (type: string) => {
    toast({
      title: "Payment Method",
      description: `${type} payment method will be added soon`,
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/settings" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Payment Methods</h1>
        </div>
        
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Saved Payment Methods</h2>
          
          <div className="space-y-4">
            <p className="text-gray-500 italic">You don't have any saved payment methods yet.</p>
            
            <Button className="w-full bg-titeh-primary hover:bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              Add New Payment Method
            </Button>
          </div>
        </Card>
        
        <h2 className="text-lg font-semibold mb-3">Available Payment Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card 
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => addPaymentMethod("Credit/Debit Card")}
          >
            <div className="flex flex-col items-center">
              <CreditCard className="text-titeh-primary mb-2" size={32} />
              <span className="font-medium">Credit/Debit Card</span>
            </div>
          </Card>
          
          <Card 
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => addPaymentMethod("UPI")}
          >
            <div className="flex flex-col items-center">
              <Smartphone className="text-titeh-primary mb-2" size={32} />
              <span className="font-medium">UPI Payment</span>
            </div>
          </Card>
          
          <Card 
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => addPaymentMethod("Cash")}
          >
            <div className="flex flex-col items-center">
              <Banknote className="text-titeh-primary mb-2" size={32} />
              <span className="font-medium">Cash Payment</span>
            </div>
          </Card>
        </div>
        
        <Card className="p-4 bg-blue-50">
          <h2 className="font-semibold mb-2">Secure Payments</h2>
          <p className="text-sm text-gray-600">All payment information is securely encrypted and processed according to PCI DSS standards.</p>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentMethods;
