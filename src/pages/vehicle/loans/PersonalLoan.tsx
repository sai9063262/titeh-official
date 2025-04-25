
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CreditCard, Calculator, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PersonalLoan = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(24);
  const { toast } = useToast();

  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const time = tenure;
    
    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, time) / (Math.pow(1 + ratePerMonth, time) - 1);
    
    return emi.toFixed(2);
  };

  const handleApply = () => {
    toast({
      title: "Application Submitted",
      description: "Your personal loan application has been submitted successfully. Our team will contact you soon.",
    });
  };

  const calculateTotalInterest = () => {
    const emi = parseFloat(calculateEMI());
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - loanAmount;
    return totalInterest.toFixed(2);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Personal Loan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-titeh-primary" />
                Apply for Personal Loan
              </CardTitle>
              <CardDescription>
                Quick and easy personal loans with minimal documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="loanAmount" 
                    type="number" 
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    min={10000}
                    max={1000000}
                  />
                </div>
                <Slider 
                  value={[loanAmount]} 
                  min={10000} 
                  max={1000000}
                  step={5000}
                  onValueChange={(value) => setLoanAmount(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹10,000</span>
                  <span>₹10,00,000</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="interestRate" 
                    type="number" 
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    min={8}
                    max={24}
                    step={0.1}
                  />
                </div>
                <Slider 
                  value={[interestRate]} 
                  min={8} 
                  max={24}
                  step={0.5}
                  onValueChange={(value) => setInterestRate(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>8%</span>
                  <span>24%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tenure">Loan Tenure (months)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="tenure" 
                    type="number" 
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    min={6}
                    max={60}
                  />
                </div>
                <Slider 
                  value={[tenure]} 
                  min={6} 
                  max={60}
                  step={6}
                  onValueChange={(value) => setTenure(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>6 months</span>
                  <span>60 months</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-titeh-primary mt-4"
                onClick={handleApply}
              >
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-titeh-primary" />
                Loan Summary
              </CardTitle>
              <CardDescription>
                Estimated calculations based on your inputs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Monthly EMI</p>
                  <p className="text-2xl font-bold text-titeh-primary">₹{calculateEMI()}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Principal</p>
                    <p className="text-lg font-semibold">₹{loanAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="text-lg font-semibold">{interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tenure</p>
                    <p className="text-lg font-semibold">{tenure} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Interest</p>
                    <p className="text-lg font-semibold">₹{calculateTotalInterest()}</p>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p className="font-medium mb-1">Required Documents</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>PAN Card</li>
                    <li>Aadhaar Card</li>
                    <li>Income Proof (Salary Slips/IT Returns)</li>
                    <li>6 months Bank Statement</li>
                    <li>2 Passport size photographs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6 bg-blue-50 border-0">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> The above EMI calculation is approximate and may vary based on actual approval and terms.
              Interest rates are subject to credit profile assessment.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PersonalLoan;
