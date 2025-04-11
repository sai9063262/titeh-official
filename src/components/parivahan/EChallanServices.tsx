
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Search, Award, FileWarning } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input"; 
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const EChallanServices = () => {
  const { toast } = useToast();
  const [challanNumber, setChallanNumber] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  const handleSubmit = () => {
    if (!challanNumber.trim()) {
      toast({
        title: "Please enter challan number",
        variant: "destructive",
      });
      return;
    }
    
    setIsPaymentDialogOpen(true);
  };
  
  const handlePayment = () => {
    toast({
      title: "Payment successful",
      description: `Challan ${challanNumber} has been paid successfully`,
      variant: "default",
    });
    setIsPaymentDialogOpen(false);
    setChallanNumber("");
  };

  const eServices = [
    { 
      icon: <Search className="h-5 w-5 text-titeh-primary" />, 
      title: "Check Challan Status", 
      description: "Check status of your e-Challan"
    },
    { 
      icon: <Award className="h-5 w-5 text-titeh-primary" />, 
      title: "Fancy Number Allocation", 
      description: "Apply for a fancy registration number"
    },
    { 
      icon: <FileWarning className="h-5 w-5 text-titeh-primary" />, 
      title: "Vehicle Recall Portal", 
      description: "Report vehicle defects or recalls"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-titeh-primary mb-4">e-Challan Services</h2>
      
      <Card className="mb-6 bg-blue-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-titeh-primary" />
            <CardTitle className="text-base">Pay e-Challan</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">Pay your traffic violation challan online. Enter the challan number below.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input 
              placeholder="Enter Challan Number (e.g., TG12345678)" 
              className="flex-1"
              value={challanNumber}
              onChange={(e) => setChallanNumber(e.target.value)}
            />
            <Button onClick={handleSubmit} className="bg-titeh-primary hover:bg-blue-600">
              Pay Now
            </Button>
          </div>
          <p className="mt-2 text-xs text-red-500">Avoid late fees! Pay your challan on time.</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {eServices.map((service, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {service.icon}
                <CardTitle className="text-base">{service.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-2">{service.description}</CardDescription>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature will be available shortly",
                    variant: "default",
                  });
                }}
              >
                Access
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pay e-Challan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-gray-50 p-4 mb-4">
              <h4 className="font-medium text-sm mb-2">Challan Details</h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Challan Number:</span> {challanNumber}</p>
                <p><span className="font-medium">Violation:</span> Speeding</p>
                <p><span className="font-medium">Date:</span> 10/04/2025</p>
                <p><span className="font-medium">Amount:</span> ₹1,000</p>
                <p><span className="font-medium">Late Fee:</span> ₹0</p>
                <p><span className="font-medium">Total:</span> ₹1,000</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm">Select payment method:</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">UPI</Button>
                <Button variant="outline" size="sm" className="flex-1">Card</Button>
                <Button variant="outline" size="sm" className="flex-1">Net Banking</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePayment} className="bg-titeh-primary hover:bg-blue-600">Pay ₹1,000</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EChallanServices;
