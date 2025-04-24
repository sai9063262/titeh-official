
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Car, Calculator, ArrowRight, Info } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UsedCarLoan = () => {
  const [carPrice, setCarPrice] = useState(300000);
  const [carAge, setCarAge] = useState(3);
  const [downPayment, setDownPayment] = useState(60000);
  const [interestRate, setInterestRate] = useState(11.5);
  const [tenure, setTenure] = useState(48);
  const { toast } = useToast();

  const calculateEMI = () => {
    const principal = carPrice - downPayment;
    const ratePerMonth = interestRate / 12 / 100;
    const time = tenure;
    
    if (principal <= 0) return "0.00";
    
    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, time) / (Math.pow(1 + ratePerMonth, time) - 1);
    
    return emi.toFixed(2);
  };

  const handleApply = () => {
    toast({
      title: "Application Submitted",
      description: "Your used car loan application has been submitted successfully. Our team will contact you soon.",
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
                <Car className="mr-2 h-5 w-5 text-titeh-primary" />
                Apply for Used Car Loan
              </CardTitle>
              <CardDescription>
                Finance a pre-owned car with flexible terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="carPrice">Car Price (₹)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="carPrice" 
                    type="number" 
                    value={carPrice}
                    onChange={(e) => setCarPrice(Number(e.target.value))}
                    min={100000}
                    max={1500000}
                  />
                </div>
                <Slider 
                  value={[carPrice]} 
                  min={100000} 
                  max={1500000}
                  step={50000}
                  onValueChange={(value) => setCarPrice(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹1,00,000</span>
                  <span>₹15,00,000</span>
                </div>
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
                    max={10}
                  />
                </div>
                <Slider 
                  value={[carAge]} 
                  min={1} 
                  max={10}
                  step={1}
                  onValueChange={(value) => setCarAge(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 year</span>
                  <span>10 years</span>
                </div>
                {carAge > 7 && (
                  <div className="flex items-center gap-2 text-xs text-amber-600 mt-1">
                    <Info className="h-3 w-3" />
                    <span>Cars older than 7 years may have higher interest rates or reduced loan eligibility</span>
                  </div>
                )}
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
                    max={carPrice * 0.7}
                  />
                </div>
                <Slider 
                  value={[downPayment]} 
                  min={carPrice * 0.1} 
                  max={carPrice * 0.7}
                  step={10000}
                  onValueChange={(value) => setDownPayment(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹{(carPrice * 0.1).toLocaleString()}</span>
                  <span>₹{(carPrice * 0.7).toLocaleString()}</span>
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
                    min={9}
                    max={18}
                    step={0.1}
                  />
                </div>
                <Slider 
                  value={[interestRate]} 
                  min={9} 
                  max={18}
                  step={0.5}
                  onValueChange={(value) => setInterestRate(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>9%</span>
                  <span>18%</span>
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
                    max={60}
                  />
                </div>
                <Slider 
                  value={[tenure]} 
                  min={12} 
                  max={60}
                  step={12}
                  onValueChange={(value) => setTenure(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>12 months</span>
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
                    <p className="text-sm text-gray-500">Car Price</p>
                    <p className="text-lg font-semibold">₹{carPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Car Age</p>
                    <p className="text-lg font-semibold">{carAge} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Down Payment</p>
                    <p className="text-lg font-semibold">₹{downPayment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loan Amount</p>
                    <p className="text-lg font-semibold">₹{(carPrice - downPayment).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="text-lg font-semibold">{interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tenure</p>
                    <p className="text-lg font-semibold">{tenure} months</p>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p className="font-medium mb-1">Required Documents</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>PAN Card</li>
                    <li>Aadhaar Card</li>
                    <li>Income Proof (Salary Slips/IT Returns)</li>
                    <li>6 months Bank Statement</li>
                    <li>Address Proof</li>
                    <li>RC Book of the vehicle</li>
                    <li>Insurance policy</li>
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
              Interest rates are subject to vehicle condition, age, and credit profile assessment.
              The loan amount and tenure may be adjusted based on the valuation of the used car.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UsedCarLoan;
