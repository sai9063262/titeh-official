
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Calculator, ArrowRight, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OldBikeLoan = () => {
  const [bikePrice, setBikePrice] = useState(40000);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(11.5);
  const [tenure, setTenure] = useState(24);
  const [bikeModel, setBikeModel] = useState("");
  const [bikeAge, setBikeAge] = useState(3);
  const { toast } = useToast();

  // Calculate loan amount after down payment
  const loanAmount = bikePrice - downPayment;

  // Calculate EMI using the formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const time = tenure;
    
    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, time) / (Math.pow(1 + ratePerMonth, time) - 1);
    
    return emi.toFixed(2);
  };

  // Calculate total interest payable
  const calculateTotalInterest = () => {
    const emi = parseFloat(calculateEMI());
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - loanAmount;
    return totalInterest.toFixed(2);
  };

  const handleApply = () => {
    toast({
      title: "Application Submitted",
      description: `Your old bike loan application for ₹${loanAmount.toLocaleString()} has been submitted successfully. Our team will contact you soon.`,
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Loan for Old Bike</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-titeh-primary" />
                Apply for Old Bike Loan
              </CardTitle>
              <CardDescription>
                Get financing for your pre-owned bike with minimal documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bikeModel">Bike Model</Label>
                <Select value={bikeModel} onValueChange={setBikeModel}>
                  <SelectTrigger id="bikeModel">
                    <SelectValue placeholder="Select bike model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero_splendor">Hero Splendor+</SelectItem>
                    <SelectItem value="honda_shine">Honda Shine</SelectItem>
                    <SelectItem value="bajaj_pulsar">Bajaj Pulsar</SelectItem>
                    <SelectItem value="tvs_apache">TVS Apache</SelectItem>
                    <SelectItem value="yamaha_fz">Yamaha FZ</SelectItem>
                    <SelectItem value="royal_enfield">Royal Enfield Classic</SelectItem>
                    <SelectItem value="ktm_duke">KTM Duke</SelectItem>
                    <SelectItem value="other">Other (Specify)</SelectItem>
                  </SelectContent>
                </Select>
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
                <p className="text-xs text-gray-500">Bikes up to 10 years old are eligible</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bikePrice">Current Bike Value (₹)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="bikePrice" 
                    type="number" 
                    value={bikePrice}
                    onChange={(e) => setBikePrice(Number(e.target.value))}
                    min={10000}
                    max={200000}
                  />
                </div>
                <Slider 
                  value={[bikePrice]} 
                  min={10000}
                  max={200000}
                  step={5000}
                  onValueChange={(value) => setBikePrice(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹10,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment (₹)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="downPayment" 
                    type="number" 
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    min={0}
                    max={bikePrice * 0.4}
                  />
                </div>
                <Slider 
                  value={[downPayment]} 
                  min={0}
                  max={bikePrice * 0.4}
                  step={1000}
                  onValueChange={(value) => setDownPayment(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹0</span>
                  <span>₹{(bikePrice * 0.4).toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">Recommended: At least 10% of bike value</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="interestRate" 
                    type="number" 
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    min={9}
                    max={20}
                    step={0.1}
                  />
                </div>
                <Slider 
                  value={[interestRate]} 
                  min={9}
                  max={20}
                  step={0.5}
                  onValueChange={(value) => setInterestRate(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>9%</span>
                  <span>20%</span>
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
                    min={12}
                    max={48}
                  />
                </div>
                <Slider 
                  value={[tenure]} 
                  min={12}
                  max={48}
                  step={6}
                  onValueChange={(value) => setTenure(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>12 months</span>
                  <span>48 months</span>
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
                    <p className="text-lg font-semibold">₹{bikePrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Down Payment</p>
                    <p className="text-lg font-semibold">₹{downPayment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loan Amount</p>
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
                    <li>Bike Registration Certificate (RC)</li>
                    <li>Insurance Certificate</li>
                    <li>PAN Card & Aadhaar Card</li>
                    <li>Income Proof (Salary Slips/IT Returns)</li>
                    <li>Bank Statement (3 months)</li>
                    <li>Bike Condition Certificate from Authorized Service Center</li>
                  </ul>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2 flex items-center justify-center"
                  onClick={() => {
                    toast({
                      title: "Information Downloaded",
                      description: "Loan details and required documents have been downloaded.",
                    });
                  }}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Download Information
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6 bg-blue-50 border-0">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> The above EMI calculation is approximate and may vary based on actual bike condition assessment and credit profile.
              Interest rates are typically higher for older bikes. Final approval is subject to physical verification of the bike condition.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OldBikeLoan;
