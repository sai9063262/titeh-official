
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PromotionalCard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name || !mobile || !loanAmount) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Loan enquiry submitted",
      description: "Bank of Maharashtra will contact you within 24 hours",
      variant: "default",
    });
    
    setIsDialogOpen(false);
    setName("");
    setMobile("");
    setLoanAmount("");
  };

  return (
    <>
      <Card className="p-4 mb-6 bg-blue-50">
        <div className="flex items-start">
          <Info className="text-titeh-primary mr-2 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-medium">Enjoy flexible EMIs with a car loan from Bank of Maharashtra.</h3>
            <p className="text-sm text-gray-600 mt-1">Interest Rate: 7.5% p.a., Tenure: Up to 7 years, Quick approval</p>
            <Button className="mt-2" variant="outline" onClick={() => setIsDialogOpen(true)}>APPLY NOW</Button>
          </div>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bank of Maharashtra Car Loan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobile" className="text-right">
                Mobile
              </Label>
              <Input 
                id="mobile" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter your mobile number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loanAmount" className="text-right">
                Loan Amount
              </Label>
              <Input 
                id="loanAmount" 
                value={loanAmount} 
                onChange={(e) => setLoanAmount(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter required loan amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-titeh-primary hover:bg-blue-600">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PromotionalCard;
