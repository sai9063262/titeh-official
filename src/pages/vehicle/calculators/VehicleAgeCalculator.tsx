
import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, Calculator, Clock, Calendar, Car, Shield, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface AgeCalculation {
  vehicleType: string;
  registrationDate: string;
  vehicleValue: number;
  ageYears: number;
  ageMonths: number;
  roadTax: number;
  insuranceHike: number;
  totalCost: number;
}

const VehicleAgeCalculator = () => {
  const [vehicleType, setVehicleType] = useState("car");
  const [registrationDate, setRegistrationDate] = useState("");
  const [vehicleValue, setVehicleValue] = useState<number | "">("");
  const [calculations, setCalculations] = useState<AgeCalculation[]>([]);
  
  const { toast } = useToast();

  const calculateAge = () => {
    if (!registrationDate || typeof vehicleValue !== "number") {
      toast({
        title: "Validation Error",
        description: "Please enter registration date and vehicle value",
        variant: "destructive",
      });
      return;
    }

    const regDate = new Date(registrationDate);
    const today = new Date();
    
    // Calculate the difference in years and months
    let ageYears = today.getFullYear() - regDate.getFullYear();
    let ageMonths = today.getMonth() - regDate.getMonth();
    
    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }

    // Calculate tax based on vehicle age and type
    let taxRate = 0;
    if (vehicleType === "car") {
      taxRate = ageYears <= 5 ? 0.02 : ageYears <= 10 ? 0.03 : 0.04;
    } else if (vehicleType === "bike") {
      taxRate = ageYears <= 5 ? 0.01 : ageYears <= 10 ? 0.02 : 0.03;
    } else if (vehicleType === "commercial") {
      taxRate = ageYears <= 5 ? 0.03 : ageYears <= 10 ? 0.04 : 0.05;
    }
    
    const roadTax = vehicleValue * taxRate;
    
    // Calculate insurance hike based on age
    const insuranceHikeRate = ageYears <= 5 ? 0.05 : ageYears <= 10 ? 0.1 : 0.15;
    const insuranceHike = vehicleValue * insuranceHikeRate;
    
    // Calculate GST on tax
    const gst = roadTax * 0.18; // 18% GST
    
    // Total cost
    const totalCost = roadTax + gst;

    const newCalculation: AgeCalculation = {
      vehicleType,
      registrationDate,
      vehicleValue,
      ageYears,
      ageMonths,
      roadTax,
      insuranceHike,
      totalCost: roadTax + gst
    };

    setCalculations([newCalculation, ...calculations]);

    toast({
      title: "Vehicle Age Calculated",
      description: `Age: ${ageYears} years and ${ageMonths} months, Road Tax: ₹${roadTax.toFixed(2)}, GST: ₹${gst.toFixed(2)}, Total: ₹${totalCost.toFixed(2)}`,
      variant: "default",
    });
  };

  const getVehicleTypeOptions = () => {
    return [
      { value: "car", label: "Car/SUV (2% tax rate)" },
      { value: "bike", label: "Bike/Scooter (1% tax rate)" },
      { value: "commercial", label: "Commercial Vehicle (3% tax rate)" }
    ];
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/vehicle" className="mr-4">
            <ArrowLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Vehicle Age Calculator</h1>
        </div>

        <Tabs defaultValue="calculator" className="mb-8">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="history">Calculation History</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehicle Age & Tax Calculator</CardTitle>
                <CardDescription>
                  Calculate vehicle age, road tax, and insurance adjustments based on registration date
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <select 
                      id="vehicleType"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                    >
                      {getVehicleTypeOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="registrationDate">Registration Date</Label>
                    <Input
                      id="registrationDate"
                      type="date"
                      value={registrationDate}
                      onChange={(e) => setRegistrationDate(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="vehicleValue">Vehicle Value (₹)</Label>
                    <Input
                      id="vehicleValue"
                      type="number"
                      placeholder="e.g., 100000"
                      value={vehicleValue}
                      onChange={(e) => setVehicleValue(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-titeh-primary hover:bg-blue-600"
                  onClick={calculateAge}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Age & Tax
                </Button>

                {registrationDate && typeof vehicleValue === "number" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Calculation Preview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Vehicle Details</h4>
                        <p className="font-medium">Registration Date: {new Date(registrationDate).toLocaleDateString()}</p>
                        <p className="font-medium">Value: ₹{vehicleValue}</p>

                        {registrationDate && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">Vehicle Age: </span>
                            <span className="font-medium">
                              {(() => {
                                const regDate = new Date(registrationDate);
                                const today = new Date();
                                let years = today.getFullYear() - regDate.getFullYear();
                                let months = today.getMonth() - regDate.getMonth();
                                if (months < 0) {
                                  years--;
                                  months += 12;
                                }
                                return `${years} years and ${months} months`;
                              })()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Cost Estimates</h4>
                        <div className="space-y-1">
                          {(() => {
                            if (!registrationDate) return null;
                            
                            const regDate = new Date(registrationDate);
                            const today = new Date();
                            let years = today.getFullYear() - regDate.getFullYear();
                            let months = today.getMonth() - regDate.getMonth();
                            if (months < 0) {
                              years--;
                              months += 12;
                            }

                            let taxRate = 0;
                            if (vehicleType === "car") {
                              taxRate = years <= 5 ? 0.02 : years <= 10 ? 0.03 : 0.04;
                            } else if (vehicleType === "bike") {
                              taxRate = years <= 5 ? 0.01 : years <= 10 ? 0.02 : 0.03;
                            } else if (vehicleType === "commercial") {
                              taxRate = years <= 5 ? 0.03 : years <= 10 ? 0.04 : 0.05;
                            }
                            
                            const roadTax = vehicleValue * taxRate;
                            const gst = roadTax * 0.18; // 18% GST
                            const total = roadTax + gst;
                            const insuranceHike = vehicleValue * (years <= 5 ? 0.05 : years <= 10 ? 0.1 : 0.15);
                            
                            return (
                              <>
                                <div className="flex justify-between">
                                  <span>Road Tax ({(taxRate * 100).toFixed(1)}%):</span>
                                  <span>₹{roadTax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>GST (18%):</span>
                                  <span>₹{gst.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Est. Insurance Hike:</span>
                                  <span>₹{insuranceHike.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold border-t pt-1 mt-1">
                                  <span>Total Tax:</span>
                                  <span>₹{total.toFixed(2)}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <a 
                  href="https://transport.telangana.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-titeh-primary hover:underline text-xs flex items-center"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Learn more about vehicle tax rules on Telangana Transport website
                </a>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calculation History</CardTitle>
                <CardDescription>
                  View your recent vehicle age calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {calculations.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No calculations yet. Use the calculator to create some.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {calculations.map((calc, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium">{calc.vehicleType.charAt(0).toUpperCase() + calc.vehicleType.slice(1)}</h3>
                          <span className="text-sm text-gray-500">Registered: {new Date(calc.registrationDate).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Age:</span> {calc.ageYears} years, {calc.ageMonths} months
                          </div>
                          <div>
                            <span className="text-gray-500">Value:</span> ₹{calc.vehicleValue}
                          </div>
                          <div>
                            <span className="text-gray-500">Road Tax:</span> ₹{calc.roadTax.toFixed(2)}
                          </div>
                          <div>
                            <span className="text-gray-500">Insurance Hike:</span> ₹{calc.insuranceHike.toFixed(2)}
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500">Total Cost:</span> ₹{calc.totalCost.toFixed(2)} (with GST)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Age Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Tax Rates by Vehicle Age</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Cars under 5 years: 2% of value per year</li>
                <li>Cars 5-10 years: 3% of value per year</li>
                <li>Cars over 10 years: 4% of value per year</li>
                <li>Bikes under 5 years: 1% of value per year</li>
                <li>Commercial vehicles: 3-5% of value per year</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Insurance Impact</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Vehicles under 5 years: 5% annual hike</li>
                <li>Vehicles 5-10 years: 10% annual hike</li>
                <li>Vehicles over 10 years: 15% annual hike</li>
                <li>Maintaining a good claim history can get you discounts</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-md">
              <h3 className="font-medium mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-amber-600" />
                Age Restrictions
              </h3>
              <p className="text-sm">Vehicles older than 15 years may face restrictions in certain cities in Telangana. Commercial vehicles over 8 years may require fitness certificate renewal.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VehicleAgeCalculator;
