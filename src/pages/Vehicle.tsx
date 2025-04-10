
import { useState } from "react";
import Layout from "@/components/Layout";
import { Check, Search, Info, Car, Gavel, DollarSign, FileText, Shield, Bike, CreditCard, Zap, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Vehicle = () => {
  const [location, setLocation] = useState("HYDERABAD");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const { toast } = useToast();

  const handleSearch = () => {
    toast({
      title: "PUC Status",
      description: "PUC is valid until 30/09/2025",
      variant: "default",
    });
  };

  const handlePayChallan = () => {
    toast({
      title: "Challan Payment",
      description: "No pending challans found for this vehicle",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Vehicle Management</h1>
        
        {/* Location Dropdown */}
        <div className="flex items-center mb-6">
          <select 
            className="border border-gray-300 rounded-md p-2 w-full md:w-60"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="HYDERABAD">HYDERABAD</option>
            <option value="NEW DELHI">NEW DELHI</option>
            <option value="MUMBAI">MUMBAI</option>
          </select>
          
          <Button className="ml-4 bg-titeh-primary hover:bg-blue-600">
            My Garage
          </Button>
        </div>
        
        {/* PUC Status Card */}
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <Check className="text-green-500 mr-2" />
            Verify PUC Status
          </h2>
          <div className="flex flex-col md:flex-row gap-2">
            <Input 
              placeholder="Enter Vehicle Number (e.g., GJ 05 AB 0000)" 
              className="flex-1"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
            />
            <Button onClick={handleSearch} className="bg-titeh-primary hover:bg-blue-600">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </Card>
        
        {/* Promotional Card */}
        <Card className="p-4 mb-6 bg-blue-50">
          <div className="flex items-start">
            <Info className="text-titeh-primary mr-2 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-medium">Enjoy flexible EMIs with a car loan from Bank of Maharashtra.</h3>
              <Button className="mt-2" variant="outline">OPEN</Button>
            </div>
          </div>
        </Card>
        
        {/* Top Features Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Top Features</h2>
          <Tabs defaultValue="cars">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="cars" className="w-1/3">Cars</TabsTrigger>
              <TabsTrigger value="bikes" className="w-1/3">Bikes</TabsTrigger>
              <TabsTrigger value="trucks" className="w-1/3">Trucks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cars" className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <Search className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Search Owner Details</span>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <Gavel className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Check Challan Details</span>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <DollarSign className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Sell Your Car</span>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <FileHistory className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Car History Report</span>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <Shield className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Car Insurance</span>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <Bike className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Bike Insurance</span>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <CreditCard className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Pay Challan</span>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <Zap className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Get Quick Loan</span>
              </Card>
            </TabsContent>
            
            <TabsContent value="bikes" className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <Search className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Search Owner Details</span>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <Gavel className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Check Challan Details</span>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <FileHistory className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Bike History Report</span>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <Shield className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Bike Insurance</span>
              </Card>
            </TabsContent>
            
            <TabsContent value="trucks" className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <Search className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Commercial Vehicle Search</span>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <Clock className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Permit Status</span>
              </Card>
              
              <Card className="p-4 flex flex-col items-center justify-center h-28">
                <Gavel className="text-titeh-primary mb-2" />
                <span className="text-sm text-center">Commercial Challans</span>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Quick Pay Challan Card */}
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Quick Pay Challan</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <Input 
              placeholder="Enter Vehicle Number" 
              className="flex-1"
            />
            <Button onClick={handlePayChallan} className="bg-titeh-primary hover:bg-blue-600">
              Pay Challan &gt;&gt;
            </Button>
          </div>
          <p className="text-blue-600 mt-2 text-sm">Avoid Late Fees!</p>
        </Card>
        
        {/* Government Links Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Government Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="https://transport.telangana.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-titeh-primary hover:bg-blue-600 text-white rounded-md py-2 px-4 text-center"
            >
              Transport Telangana
            </a>
            
            <a 
              href="https://parivahan.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-titeh-primary hover:bg-blue-600 text-white rounded-md py-2 px-4 text-center"
            >
              Parivahan
            </a>
            
            <a 
              href="https://ts-iic.telangana.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-titeh-primary hover:bg-blue-600 text-white rounded-md py-2 px-4 text-center"
            >
              TS Industrial Infra
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Vehicle;
