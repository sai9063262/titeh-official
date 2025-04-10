
import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, Calculator, Plus, History, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface TripRecord {
  id: string;
  date: string;
  startOdometer: number;
  endOdometer: number;
  fuelAdded: number;
  fuelCost: number;
  distance: number;
  mileage: number;
  costPerKm: number;
}

const MileageCalculator = () => {
  const [activeTab, setActiveTab] = useState("logger");
  const [startOdometer, setStartOdometer] = useState<number | "">("");
  const [endOdometer, setEndOdometer] = useState<number | "">("");
  const [fuelAdded, setFuelAdded] = useState<number | "">("");
  const [fuelCost, setFuelCost] = useState<number | "">("");
  const [tripRecords, setTripRecords] = useState<TripRecord[]>([
    {
      id: "1",
      date: "2025-04-08",
      startOdometer: 10000,
      endOdometer: 10120,
      fuelAdded: 8,
      fuelCost: 800,
      distance: 120,
      mileage: 15,
      costPerKm: 6.67
    },
    {
      id: "2",
      date: "2025-04-01",
      startOdometer: 9850,
      endOdometer: 10000,
      fuelAdded: 10,
      fuelCost: 1000,
      distance: 150,
      mileage: 15,
      costPerKm: 6.67
    }
  ]);

  const { toast } = useToast();

  const calculateMileage = () => {
    if (typeof startOdometer !== "number" || typeof endOdometer !== "number" || 
        typeof fuelAdded !== "number" || typeof fuelCost !== "number") {
      toast({
        title: "Validation Error",
        description: "Please enter valid numbers for all fields",
        variant: "destructive",
      });
      return;
    }

    if (startOdometer >= endOdometer) {
      toast({
        title: "Validation Error",
        description: "End odometer reading must be greater than start odometer reading",
        variant: "destructive",
      });
      return;
    }

    const distance = endOdometer - startOdometer;
    const mileage = distance / fuelAdded;
    const costPerKm = fuelCost / distance;
    const gst = fuelCost * 0.28; // 28% GST on fuel
    const totalCost = fuelCost + gst;

    const newRecord: TripRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      startOdometer,
      endOdometer,
      fuelAdded,
      fuelCost,
      distance,
      mileage,
      costPerKm
    };

    setTripRecords([newRecord, ...tripRecords]);

    toast({
      title: "Mileage Calculated",
      description: `Distance: ${distance} km, Mileage: ${mileage.toFixed(2)} km/l, Cost: ₹${costPerKm.toFixed(2)}/km, Total (with GST): ₹${totalCost.toFixed(2)}`,
      variant: "default",
    });

    // Reset form
    setStartOdometer("");
    setEndOdometer("");
    setFuelAdded("");
    setFuelCost("");
  };

  const getAverageMileage = () => {
    if (tripRecords.length === 0) return 0;
    const totalMileage = tripRecords.reduce((sum, record) => sum + record.mileage, 0);
    return (totalMileage / tripRecords.length).toFixed(2);
  };

  const getTotalDistance = () => {
    return tripRecords.reduce((sum, record) => sum + record.distance, 0);
  };

  const getTotalFuelCost = () => {
    return tripRecords.reduce((sum, record) => sum + record.fuelCost, 0);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/vehicle" className="mr-4">
            <ArrowLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Mileage Tracking</h1>
        </div>

        <Tabs defaultValue="logger" onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="logger">Trip Logger</TabsTrigger>
            <TabsTrigger value="history">Trip History</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="logger">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Log New Trip</CardTitle>
                <CardDescription>
                  Enter your odometer readings and fuel details to calculate mileage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startOdometer">Start Odometer (km)</Label>
                    <Input
                      id="startOdometer"
                      type="number"
                      placeholder="e.g., 10000"
                      value={startOdometer}
                      onChange={(e) => setStartOdometer(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endOdometer">End Odometer (km)</Label>
                    <Input
                      id="endOdometer"
                      type="number"
                      placeholder="e.g., 10150"
                      value={endOdometer}
                      onChange={(e) => setEndOdometer(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fuelAdded">Fuel Added (liters)</Label>
                    <Input
                      id="fuelAdded"
                      type="number"
                      placeholder="e.g., 10"
                      value={fuelAdded}
                      onChange={(e) => setFuelAdded(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fuelCost">Fuel Cost (₹)</Label>
                    <Input
                      id="fuelCost"
                      type="number"
                      placeholder="e.g., 1000"
                      value={fuelCost}
                      onChange={(e) => setFuelCost(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-titeh-primary hover:bg-blue-600"
                  onClick={calculateMileage}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Mileage
                </Button>

                <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm">
                  <p className="font-medium mb-2">The calculator will provide:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Distance traveled</li>
                    <li>Fuel efficiency (km/l)</li>
                    <li>Cost per kilometer</li>
                    <li>GST calculation (28% in Telangana)</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <a 
                  href="https://www.niti.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-titeh-primary hover:underline text-xs flex items-center"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Learn more about fuel policy on NITI Aayog
                </a>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trip History</CardTitle>
                <CardDescription>
                  View your recent trips and mileage records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left">Date</th>
                        <th className="py-2 text-right">Distance</th>
                        <th className="py-2 text-right">Fuel</th>
                        <th className="py-2 text-right">Mileage</th>
                        <th className="py-2 text-right">Cost/km</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tripRecords.map((record) => (
                        <tr key={record.id} className="border-b">
                          <td className="py-2">{record.date}</td>
                          <td className="py-2 text-right">{record.distance} km</td>
                          <td className="py-2 text-right">{record.fuelAdded} L</td>
                          <td className="py-2 text-right">{record.mileage.toFixed(2)} km/L</td>
                          <td className="py-2 text-right">₹{record.costPerKm.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mileage Statistics</CardTitle>
                <CardDescription>
                  Analysis of your fuel efficiency and costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-sm text-gray-500 mb-1">Average Mileage</h3>
                    <p className="text-2xl font-bold">{getAverageMileage()} km/L</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md">
                    <h3 className="text-sm text-gray-500 mb-1">Total Distance</h3>
                    <p className="text-2xl font-bold">{getTotalDistance()} km</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-md">
                    <h3 className="text-sm text-gray-500 mb-1">Total Fuel Cost</h3>
                    <p className="text-2xl font-bold">₹{getTotalFuelCost()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Maintenance Alert</h3>
                  <p className="text-sm">Based on your current mileage, your next service is recommended at 15,000 km (in approximately 4,730 km).</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Fuel Efficiency Tips</h3>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    <li>Maintain proper tire pressure</li>
                    <li>Avoid aggressive acceleration and braking</li>
                    <li>Service your vehicle regularly</li>
                    <li>Remove excess weight from the vehicle</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <a 
                  href="https://www.niti.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-titeh-primary hover:underline text-xs"
                >
                  Learn more about fuel efficiency standards
                </a>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MileageCalculator;
