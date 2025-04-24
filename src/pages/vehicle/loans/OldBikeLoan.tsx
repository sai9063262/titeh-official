
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Bike, Calculator, ArrowRight, Info } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const OldBikeLoan = () => {
  const [bikeValue, setBikeValue] = useState(50000);
  const [bikeAge, setBikeAge] = useState(3);
  const [loanAmount, setLoanAmount] = useState(35000);
  const [interestRate, setInterestRate] = useState(14);
  const [tenure, setTenure] = useState(24);
  const [loanType, setLoanType] = useState("secured");
  const { toast } = useToast();

  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const time = tenure;
    
    if (principal <= 0) return "0.00";
    
    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, time) / (Math.pow(1 + ratePerMonth, time) - 1);
    
    return emi.toFixed(2);
  };

  const handleApply = () => {
    toast({
      title: "Application Submitted",
      description: "Your loan application against your bike has been submitted successfully. Our team will contact you soon.",
    });
  };

  // Max loan amount based on bike value and type
  const maxLoanAmount = loanType === "secured" ? bikeValue * 0.7 : bikeValue * 0.5;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Loan Against Old Bike</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bike className="mr-2 h-5 w-5 text-titeh-primary" />
                Apply for Loan Against Bike
              </CardTitle>
              <CardDescription>
                Use your existing bike as collateral for a quick loan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loanType">Loan Type</Label>
                <RadioGroup value={loanType} onValueChange={setLoanType} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="secured" id="secured" />
                    <Label htmlFor="secured">Secured (Mortgage)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hypothecation" id="hypothecation" />
                    <Label htmlFor="hypothecation">Hypothecation</Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-gray-500">
                  {loanType === "secured" 
                    ? "Secured loan requires depositing your bike's original RC book with the lender." 
                    : "Hypothecation allows you to keep using the bike while the lender's name is added to the RC book."}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bikeValue">Current Bike Value (₹)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="bikeValue" 
                    type="number" 
                    value={bikeValue}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setBikeValue(value);
                      // Adjust loan amount if it exceeds the max
                      if (loanAmount > value * (loanType === "secured" ? 0.7 : 0.5)) {
                        setLoanAmount(Math.floor(value * (loanType === "secured" ? 0.7 : 0.5)));
                      }
                    }}
                    min={10000}
                    max={200000}
                  />
                </div>
                <Slider 
                  value={[bikeValue]} 
                  min={10000} 
                  max={200000}
                  step={5000}
                  onValueChange={(value) => {
                    setBikeValue(value[0]);
                    // Adjust loan amount if it exceeds the max
                    if (loanAmount > value[0] * (loanType === "secured" ? 0.7 : 0.5)) {
                      setLoanAmount(Math.floor(value[0] * (loanType === "secured" ? 0.7 : 0.5)));
                    }
                  }}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹10,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bikeAge">Bike Age (years)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="bikeAge" 
                    type="number" 
                    value={bikeAge}
                    onChange={(e) => setBikeAge(Number(e.target.value))}
                    min={1}
                    max={10}
                  />
                </div>
                <Slider 
                  value={[bikeAge]} 
                  min={1} 
                  max={10}
                  step={1}
                  onValueChange={(value) => setBikeAge(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 year</span>
                  <span>10 years</span>
                </div>
                {bikeAge > 8 && (
                  <div className="flex items-center gap-2 text-xs text-amber-600 mt-1">
                    <Info className="h-3 w-3" />
                    <span>Bikes older than 8 years may have limited loan eligibility</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="loanAmount" 
                    type="number" 
                    value={loanAmount}
                    onChange={(e) => {
                      const value = Math.min(Number(e.target.value), maxLoanAmount);
                      setLoanAmount(value);
                    }}
                    min={5000}
                    max={maxLoanAmount}
                  />
                </div>
                <Slider 
                  value={[loanAmount]} 
                  min={5000} 
                  max={maxLoanAmount}
                  step={1000}
                  onValueChange={(value) => setLoanAmount(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹5,000</span>
                  <span>₹{maxLoanAmount.toLocaleString()} (Max {loanType === "secured" ? "70%" : "50"}%)</span>
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
                    min={12}
                    max={24}
                    step={0.1}
                  />
                </div>
                <Slider 
                  value={[interestRate]} 
                  min={12} 
                  max={24}
                  step={0.5}
                  onValueChange={(value) => setInterestRate(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>12%</span>
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
                    max={36}
                  />
                </div>
                <Slider 
                  value={[tenure]} 
                  min={6} 
                  max={36}
                  step={6}
                  onValueChange={(value) => setTenure(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>6 months</span>
                  <span>36 months</span>
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
                    <p className="text-sm text-gray-500">Bike Value</p>
                    <p className="text-lg font-semibold">₹{bikeValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bike Age</p>
                    <p className="text-lg font-semibold">{bikeAge} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loan Amount</p>
                    <p className="text-lg font-semibold">₹{loanAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loan Type</p>
                    <p className="text-lg font-semibold capitalize">{loanType}</p>
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
                    <p className="text-lg font-semibold">₹{(calculateEMI() * tenure - loanAmount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount Payable</p>
                    <p className="text-lg font-semibold">₹{(calculateEMI() * tenure).toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p className="font-medium mb-1">Required Documents</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>PAN Card</li>
                    <li>Aadhaar Card</li>
                    <li>Address Proof</li>
                    <li>Bike Registration Certificate (RC Book)</li>
                    <li>Bike Insurance Policy</li>
                    <li>2 Passport size photographs</li>
                    <li>Bank Statement (3 months)</li>
                    <li>Existing loan NOC (if applicable)</li>
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
              Interest rates are subject to bike condition, age, and your credit profile assessment.
              Loan approval is subject to verification of documents and bike inspection.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OldBikeLoan;
