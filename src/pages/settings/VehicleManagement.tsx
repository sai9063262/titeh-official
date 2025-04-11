
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, Trash2, Car, Bike, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([
    { id: 1, type: "car", regNumber: "TS01AB1234", model: "Hyundai i20", year: "2020" },
    { id: 2, type: "bike", regNumber: "TS02CD5678", model: "Honda Activa", year: "2021" },
    { id: 3, type: "car", regNumber: "TS03EF9012", model: "Tata Nexon", year: "2022" }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  
  const handleDelete = (id) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    toast({
      title: "Vehicle Removed",
      description: "The vehicle has been removed from your account",
    });
  };
  
  const handleAddVehicle = (event) => {
    event.preventDefault();
    const form = event.target;
    const newVehicle = {
      id: vehicles.length + 1,
      type: form.type.value,
      regNumber: form.regNumber.value,
      model: form.model.value,
      year: form.year.value
    };
    
    setVehicles([...vehicles, newVehicle]);
    setShowAddForm(false);
    toast({
      title: "Vehicle Added",
      description: "The vehicle has been added to your account",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Vehicle Management</h1>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Vehicles</TabsTrigger>
            <TabsTrigger value="cars">Cars</TabsTrigger>
            <TabsTrigger value="bikes">Bikes</TabsTrigger>
            <TabsTrigger value="trucks">Trucks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 w-8">
                        {vehicle.type === "car" ? <Car className="text-titeh-primary" /> : 
                         vehicle.type === "bike" ? <Bike className="text-titeh-primary" /> : 
                         <Truck className="text-titeh-primary" />}
                      </div>
                      <div>
                        <span className="font-medium">{vehicle.regNumber}</span>
                        <p className="text-sm text-gray-600">{vehicle.model} ({vehicle.year})</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(vehicle.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="cars">
            <div className="space-y-4">
              {vehicles.filter(v => v.type === "car").map((vehicle) => (
                <Card key={vehicle.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 w-8">
                        <Car className="text-titeh-primary" />
                      </div>
                      <div>
                        <span className="font-medium">{vehicle.regNumber}</span>
                        <p className="text-sm text-gray-600">{vehicle.model} ({vehicle.year})</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(vehicle.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="bikes">
            <div className="space-y-4">
              {vehicles.filter(v => v.type === "bike").map((vehicle) => (
                <Card key={vehicle.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 w-8">
                        <Bike className="text-titeh-primary" />
                      </div>
                      <div>
                        <span className="font-medium">{vehicle.regNumber}</span>
                        <p className="text-sm text-gray-600">{vehicle.model} ({vehicle.year})</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(vehicle.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trucks">
            <div className="space-y-4">
              {vehicles.filter(v => v.type === "truck").map((vehicle) => (
                <Card key={vehicle.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 w-8">
                        <Truck className="text-titeh-primary" />
                      </div>
                      <div>
                        <span className="font-medium">{vehicle.regNumber}</span>
                        <p className="text-sm text-gray-600">{vehicle.model} ({vehicle.year})</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(vehicle.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button className="mb-6 bg-titeh-primary">
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                <select name="type" className="w-full p-2 border rounded">
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="truck">Truck</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registration Number</label>
                <Input name="regNumber" placeholder="e.g., TS01AB1234" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <Input name="model" placeholder="e.g., Hyundai i20" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <Input name="year" placeholder="e.g., 2022" required />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-titeh-primary">
                  <Save className="mr-2 h-4 w-4" /> Save Vehicle
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        
        <Card className="p-4 bg-blue-50">
          <h2 className="font-semibold mb-2">Coming Soon</h2>
          <p className="text-sm text-gray-600">Advanced vehicle management with service history tracking and documents upload will be available in the next update.</p>
        </Card>
      </div>
    </Layout>
  );
};

export default VehicleManagement;
