
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

const UsedCarLoan = () => {
  const [carPrice, setCarPrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(100000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(48);
  const [carModel, setCarModel] = useState("");
  const [carAge, setCarAge] = useState(4);
  const { toast } = useToast();

  // Calculate loan amount after down payment
  const loanAmount = carPrice - downPayment;

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
      description: `Your used car loan application for ₹${loanAmount.toLocaleString()} has been submitted successfully. Our team will contact you soon.`,
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Used Car Loan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-titeh-primary" />
                Apply for Used Car Loan
              </CardTitle>
              <CardDescription>
                Financing solutions for pre-owned cars with competitive rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="carModel">Car Make & Model</Label>
                <Select value={carModel} onValueChange={setCarModel}>
                  <SelectTrigger id="carModel">
                    <SelectValue placeholder="Select car model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maruti_swift">Maruti Suzuki Swift</SelectItem>
                    <SelectItem value="hyundai_i20">Hyundai i20</SelectItem>
                    <SelectItem value="honda_city">Honda City</SelectItem>
                    <SelectItem value="tata_nexon">Tata Nexon</SelectItem>
                    <SelectItem value="toyota_innova">Toyota Innova</SelectItem>
                    <SelectItem value="mahindra_xuv">Mahindra XUV</SelectItem>
                    <SelectItem value="kia_seltos">Kia Seltos</SelectItem>
                    <SelectItem value="other">Other (Specify)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="carAge">Car Age (years)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="carAge" 
                    type="number" 
                    value={carAge}
                    onChange={(e) => setCarAge(Number(e.target.value))}
                    min={1}
                    max={12}
                  />
                </div>
                <Slider 
                  value={[carAge]} 
                  min={1}
                  max={12}
                  step={1}
                  onValueChange={(value) => setCarAge(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 year</span>
                  <span>12 years</span>
                </div>
                <p className="text-xs text-gray-500">Cars up to 12 years old are eligible</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="carPrice">Current Car Value (₹)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="carPrice" 
                    type="number" 
                    value={carPrice}
                    onChange={(e) => setCarPrice(Number(e.target.value))}
                    min={100000}
                    max={2000000}
                  />
                </div>
                <Slider 
                  value={[carPrice]} 
                  min={100000}
                  max={2000000}
                  step={50000}
                  onValueChange={(value) => setCarPrice(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹1,00,000</span>
                  <span>₹20,00,000</span>
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
                    min={carPrice * 0.1}
                    max={carPrice * 0.5}
                  />
                </div>
                <Slider 
                  value={[downPayment]} 
                  min={carPrice * 0.1}
                  max={carPrice * 0.5}
                  step={10000}
                  onValueChange={(value) => setDownPayment(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹{(carPrice * 0.1).toLocaleString()}</span>
                  <span>₹{(carPrice * 0.5).toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">Minimum required: 10% of car value</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="interestRate" 
                    type="number" 
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    min={8.5}
                    max={15}
                    step={0.1}
                  />
                </div>
                <Slider 
                  value={[interestRate]} 
                  min={8.5}
                  max={15}
                  step={0.5}
                  onValueChange={(value) => setInterestRate(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>8.5%</span>
                  <span>15%</span>
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
                    max={84}
                  />
                </div>
                <Slider 
                  value={[tenure]} 
                  min={12}
                  max={84}
                  step={12}
                  onValueChange={(value) => setTenure(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>12 months</span>
                  <span>84 months</span>
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
                    <p className="text-sm text-gray-500">Car Value</p>
                    <p className="text-lg font-semibold">₹{carPrice.toLocaleString()}</p>
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
                    <li>Car Registration Certificate (RC)</li>
                    <li>Insurance Certificate</li>
                    <li>PAN Card & Aadhaar Card</li>
                    <li>Income Proof (Salary Slips/IT Returns)</li>
                    <li>Bank Statement (6 months)</li>
                    <li>Valid Driving License</li>
                    <li>Car Valuation Certificate</li>
                    <li>NOC from existing financier (if applicable)</li>
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
              <strong>Note:</strong> The above EMI calculation is approximate and may vary based on actual car condition assessment and credit profile.
              Final approval is subject to physical verification of the car condition, RTO clearance, and insurance status.
              Older cars typically attract higher interest rates.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UsedCarLoan;
