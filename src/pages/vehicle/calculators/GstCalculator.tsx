
import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, Calculator, PercentSquare, Plus, ExternalLink, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface GstCalculation {
  id: string;
  productName: string;
  category: string;
  baseAmount: number;
  gstRate: number;
  cessRate: number;
  itc: number;
  gstAmount: number;
  cessAmount: number;
  netGst: number;
  totalAmount: number;
  date: string;
}

const GstCalculator = () => {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("vehicle");
  const [baseAmount, setBaseAmount] = useState<number | "">("");
  const [gstRate, setGstRate] = useState<number>(28);
  const [cessRate, setCessRate] = useState<number | "">(1);
  const [itc, setItc] = useState<number | "">(0);
  const [calculations, setCalculations] = useState<GstCalculation[]>([]);
  
  const { toast } = useToast();

  const calculateGST = () => {
    if (!productName || typeof baseAmount !== "number") {
      toast({
        title: "Validation Error",
        description: "Please enter product name and base amount",
        variant: "destructive",
      });
      return;
    }

    const gstAmount = (baseAmount * gstRate) / 100;
    const cessAmount = typeof cessRate === "number" ? (baseAmount * cessRate) / 100 : 0;
    const totalTax = gstAmount + cessAmount;
    const netGst = totalTax - (typeof itc === "number" ? itc : 0);
    const totalAmount = baseAmount + netGst;

    const newCalculation: GstCalculation = {
      id: Date.now().toString(),
      productName,
      category,
      baseAmount,
      gstRate,
      cessRate: typeof cessRate === "number" ? cessRate : 0,
      itc: typeof itc === "number" ? itc : 0,
      gstAmount,
      cessAmount,
      netGst,
      totalAmount,
      date: new Date().toISOString().split('T')[0]
    };

    setCalculations([newCalculation, ...calculations]);

    toast({
      title: "GST Calculation Completed",
      description: `Base: ₹${baseAmount}, GST: ₹${gstAmount.toFixed(2)}, Cess: ₹${cessAmount.toFixed(2)}, Net GST: ₹${netGst.toFixed(2)}, Total: ₹${totalAmount.toFixed(2)}`,
      variant: "default",
    });

    // Reset form for new entry
    setProductName("");
    setBaseAmount("");
    setCessRate(1);
    setItc(0);
  };

  const getCategoryOptions = () => {
    return [
      { value: "vehicle", label: "Vehicles (28%)", rate: 28 },
      { value: "vehicle-small", label: "Small Vehicles (18%)", rate: 18 },
      { value: "parts", label: "Vehicle Parts (18%)", rate: 18 },
      { value: "services", label: "Services (18%)", rate: 18 },
      { value: "insurance", label: "Insurance (18%)", rate: 18 },
      { value: "transport", label: "Transport Services (5%)", rate: 5 },
    ];
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    
    // Update GST rate based on category
    const option = getCategoryOptions().find(opt => opt.value === selectedCategory);
    if (option) {
      setGstRate(option.rate);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/vehicle" className="mr-4">
            <ArrowLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">GST Calculator</h1>
        </div>

        <Tabs defaultValue="calculator" className="mb-8">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="history">Calculation History</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">GST & Cess Calculator</CardTitle>
                <CardDescription>
                  Calculate GST, cess, and input tax credit eligibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="productName">Product/Service Name</Label>
                    <Input
                      id="productName"
                      placeholder="e.g., Maruti Swift"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select 
                      id="category"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={category}
                      onChange={handleCategoryChange}
                    >
                      {getCategoryOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="baseAmount">Base Amount (₹)</Label>
                    <Input
                      id="baseAmount"
                      type="number"
                      placeholder="e.g., 100000"
                      value={baseAmount}
                      onChange={(e) => setBaseAmount(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gstRate">GST Rate (%)</Label>
                    <Input
                      id="gstRate"
                      type="number"
                      value={gstRate}
                      onChange={(e) => setGstRate(Number(e.target.value))}
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-selected based on category</p>
                  </div>

                  <div>
                    <Label htmlFor="cessRate">Cess Rate (%) - if applicable</Label>
                    <Input
                      id="cessRate"
                      type="number"
                      placeholder="e.g., 1"
                      value={cessRate}
                      onChange={(e) => setCessRate(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="itc">Input Tax Credit (₹) - if applicable</Label>
                    <Input
                      id="itc"
                      type="number"
                      placeholder="e.g., 5000"
                      value={itc}
                      onChange={(e) => setItc(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-titeh-primary hover:bg-blue-600"
                  onClick={calculateGST}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate GST
                </Button>

                {typeof baseAmount === "number" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Calculation Preview</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Base Amount:</span>
                        <span>₹{baseAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST ({gstRate}%):</span>
                        <span>₹{((baseAmount * gstRate) / 100).toFixed(2)}</span>
                      </div>
                      {cessRate && (
                        <div className="flex justify-between">
                          <span>Cess ({cessRate}%):</span>
                          <span>₹{((baseAmount * Number(cessRate)) / 100).toFixed(2)}</span>
                        </div>
                      )}
                      {itc && (
                        <div className="flex justify-between">
                          <span>Input Tax Credit:</span>
                          <span>-₹{Number(itc).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold border-t pt-1 mt-1">
                        <span>Total Amount:</span>
                        <span>₹{(baseAmount + 
                          (baseAmount * gstRate / 100) + 
                          (cessRate ? (baseAmount * Number(cessRate) / 100) : 0) - 
                          (itc ? Number(itc) : 0)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <div className="flex flex-col space-y-2">
                    <a 
                      href="https://www.cbec.gov.in/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-titeh-primary hover:underline text-xs flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      GST rules on Central Board of Indirect Taxes and Customs
                    </a>
                    <div className="text-xs text-gray-500">
                      GST Rates: Vehicles (28%), Small Vehicles (18%), Services (18%), Transport (5%)
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calculation History</CardTitle>
                <CardDescription>
                  View your recent GST calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {calculations.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No calculations yet. Use the calculator to create some.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {calculations.map((calc) => (
                      <div key={calc.id} className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium">{calc.productName}</h3>
                          <span className="text-sm text-gray-500">{calc.date}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Category:</span> {calc.category}
                          </div>
                          <div>
                            <span className="text-gray-500">Base Amount:</span> ₹{calc.baseAmount}
                          </div>
                          <div>
                            <span className="text-gray-500">GST Rate:</span> {calc.gstRate}%
                          </div>
                          <div>
                            <span className="text-gray-500">Cess Rate:</span> {calc.cessRate}%
                          </div>
                          <div>
                            <span className="text-gray-500">ITC:</span> ₹{calc.itc}
                          </div>
                          <div>
                            <span className="text-gray-500">Total:</span> ₹{calc.totalAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button disabled={calculations.length === 0} variant="outline" className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Export Calculations
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">GST Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Vehicle GST Rates</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Cars with engine capacity over 1500cc: 28% GST + 15% Cess</li>
                <li>Cars with engine capacity under 1500cc: 28% GST + 1% Cess</li>
                <li>Two-wheelers: 28% GST</li>
                <li>Electric vehicles: 5% GST</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Services GST Rates</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Vehicle servicing & repair: 18% GST</li>
                <li>Insurance services: 18% GST</li>
                <li>Transport of passengers: 5% GST</li>
                <li>Renting of vehicles: 18% GST</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GstCalculator;
