
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Bike, Calculator, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NewBikeLoan = () => {
  const [bikePrice, setBikePrice] = useState(100000);
  const [downPayment, setDownPayment] = useState(20000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(36);
  const [bikeModel, setBikeModel] = useState("");
  const { toast } = useToast();

  const calculateEMI = () => {
    const principal = bikePrice - downPayment;
    const ratePerMonth = interestRate / 12 / 100;
    const time = tenure;
    
    if (principal <= 0) return "0.00";
    
    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, time) / (Math.pow(1 + ratePerMonth, time) - 1);
    
    return emi.toFixed(2);
  };

  const handleApply = () => {
    if (!bikeModel) {
      toast({
        title: "Please Select a Bike Model",
        description: "You need to select a bike model to proceed with the application.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Application Submitted",
      description: `Your loan application for ${bikeModel} has been submitted successfully. Our team will contact you soon.`,
    });
  };

  const popularBikes = [
    "Honda Activa 6G",
    "TVS Jupiter",
    "Bajaj Pulsar 150",
    "Hero Splendor Plus",
    "Royal Enfield Classic 350",
    "Yamaha MT-15",
    "Suzuki Access 125",
    "KTM Duke 200",
    "Hero HF Deluxe",
    "Honda Shine"
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">New Bike Loan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bike className="mr-2 h-5 w-5 text-titeh-primary" />
                Apply for New Bike Loan
              </CardTitle>
              <CardDescription>
                Quick financing options for your dream bike
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bikeModel">Bike Model</Label>
                <Select value={bikeModel} onValueChange={setBikeModel}>
                  <SelectTrigger id="bikeModel">
                    <SelectValue placeholder="Select Bike Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularBikes.map((bike) => (
                      <SelectItem key={bike} value={bike}>{bike}</SelectItem>
                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bikePrice">Bike Price (₹)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="bikePrice" 
                    type="number" 
                    value={bikePrice}
                    onChange={(e) => setBikePrice(Number(e.target.value))}
                    min={30000}
                    max={500000}
                  />
                </div>
                <Slider 
                  value={[bikePrice]} 
                  min={30000} 
                  max={500000}
                  step={10000}
                  onValueChange={(value) => setBikePrice(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹30,000</span>
                  <span>₹5,00,000</span>
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
                    max={bikePrice * 0.7}
                  />
                </div>
                <Slider 
                  value={[downPayment]} 
                  min={0} 
                  max={bikePrice * 0.7}
                  step={5000}
                  onValueChange={(value) => setDownPayment(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹0</span>
                  <span>₹{(bikePrice * 0.7).toLocaleString()}</span>
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
                    min={7}
                    max={18}
                    step={0.1}
                  />
                </div>
                <Slider 
                  value={[interestRate]} 
                  min={7} 
                  max={18}
                  step={0.5}
                  onValueChange={(value) => setInterestRate(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>7%</span>
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
                    <p className="text-sm text-gray-500">Bike Price</p>
                    <p className="text-lg font-semibold">₹{bikePrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Down Payment</p>
                    <p className="text-lg font-semibold">₹{downPayment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loan Amount</p>
                    <p className="text-lg font-semibold">₹{(bikePrice - downPayment).toLocaleString()}</p>
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
                    <p className="text-lg font-semibold">₹{(calculateEMI() * tenure - (bikePrice - downPayment)).toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p className="font-medium mb-1">Required Documents</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>PAN Card</li>
                    <li>Aadhaar Card</li>
                    <li>Income Proof (Salary Slips/IT Returns)</li>
                    <li>3 months Bank Statement</li>
                    <li>Address Proof</li>
                    <li>Bike quotation from dealer</li>
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
              Interest rates are subject to credit profile assessment. Processing fee and other charges may apply.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NewBikeLoan;
