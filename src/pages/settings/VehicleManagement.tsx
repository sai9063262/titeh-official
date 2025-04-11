
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Car, Plus, Edit2, Trash2, UploadCloud, FileText, AlertTriangle, CornerDownRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VehicleManagement = () => {
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const { toast } = useToast();
  
  const vehicles = [
    { id: '1', regNumber: 'TS07AB1234', type: 'Car', model: 'Hyundai i20', year: '2022' },
    { id: '2', regNumber: 'TS09CD5678', type: 'Bike', model: 'Honda CB Shine', year: '2021' },
    { id: '3', regNumber: 'TS12EF9012', type: 'Car', model: 'Maruti Swift', year: '2020' },
  ];
  
  const openDeleteDialog = (id: string) => {
    setSelectedVehicle(id);
    setDeleteDialogOpen(true);
  };
  
  const deleteVehicle = () => {
    setDeleteDialogOpen(false);
    
    toast({
      title: "Vehicle Removed",
      description: "The vehicle has been removed from your profile",
      variant: "default",
    });
  };
  
  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    setAddVehicleOpen(false);
    
    toast({
      title: "Vehicle Added",
      description: "The new vehicle has been added to your profile",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/settings" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Vehicle Management</h1>
        </div>
        
        <div className="flex justify-end mb-6">
          <Button 
            onClick={() => setAddVehicleOpen(true)}
            className="bg-titeh-primary hover:bg-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
        
        <div className="space-y-4 mb-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="p-4">
              <div className="md:flex justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  {vehicle.type === 'Car' ? (
                    <Car className="h-8 w-8 text-titeh-primary mr-3" />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.5 17.5c0 0.3-0.1 0.6-0.3 0.8C10 18.6 9.7 18.7 9.3 18.7 9 18.7 8.7 18.6 8.5 18.4 8.2 18.1 8.1 17.8 8.1 17.5c0-0.3 0.1-0.6 0.4-0.8 0.2-0.2 0.5-0.3 0.8-0.3 0.3 0 0.6 0.1 0.8 0.3C10.4 16.9 10.5 17.2 10.5 17.5z" />
                      <path d="M3 17.5c0 0.3-0.1 0.6-0.3 0.8C2.4 18.6 2.1 18.7 1.8 18.7c-0.4 0-0.7-0.1-0.9-0.3C0.6 18.1 0.5 17.8 0.5 17.5c0-0.3 0.1-0.6 0.4-0.8 0.2-0.2 0.5-0.3 0.9-0.3 0.3 0 0.6 0.1 0.8 0.3C2.9 16.9 3 17.2 3 17.5z" />
                      <path d="M15 5l-3-3H7.5l-0.5 3" />
                      <path d="M5 11l-3 4h13l-3-4" />
                      <path d="M8 14v3" />
                      <path d="M2 14v3" />
                      <path d="M12 9V5H7v4" />
                    </svg>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{vehicle.regNumber}</h3>
                    <p className="text-gray-600">{vehicle.model} ({vehicle.year})</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => openDeleteDialog(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" size="sm" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Documents
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Upload RC
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Check Challan
                </Button>
              </div>
            </Card>
          ))}
        </Card>
        
        <Card className="p-6 mb-6">
          <div className="flex items-center mb-4">
            <UploadCloud className="text-titeh-primary mr-2" />
            <h2 className="text-lg font-semibold">Vehicle Documents</h2>
          </div>
          
          <p className="text-gray-600 mb-4">Upload and manage your vehicle documents in one place.</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-titeh-primary mr-3" />
                <div>
                  <span className="font-medium">Registration Certificate</span>
                  <div className="text-xs text-gray-500">Uploaded for 2 vehicles</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-titeh-primary mr-3" />
                <div>
                  <span className="font-medium">Insurance Documents</span>
                  <div className="text-xs text-gray-500">Uploaded for 3 vehicles</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-titeh-primary mr-3" />
                <div>
                  <span className="font-medium">PUC Certificate</span>
                  <div className="text-xs text-gray-500">Uploaded for 2 vehicles</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-blue-50 mb-6">
          <div className="flex items-center">
            <Car className="text-titeh-primary mr-2" />
            <h2 className="font-semibold">Vehicle Management Tips</h2>
          </div>
          <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-6">
            <li className="flex items-start">
              <CornerDownRight className="h-3 w-3 mr-1 mt-1 flex-shrink-0" />
              <span>Keep your vehicle documents up to date by uploading the latest versions.</span>
            </li>
            <li className="flex items-start">
              <CornerDownRight className="h-3 w-3 mr-1 mt-1 flex-shrink-0" />
              <span>You can add up to 5 vehicles to your profile.</span>
            </li>
            <li className="flex items-start">
              <CornerDownRight className="h-3 w-3 mr-1 mt-1 flex-shrink-0" />
              <span>Regular PUC checks help keep your vehicle compliant and reduce pollution.</span>
            </li>
          </ul>
        </Card>
        
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Vehicle</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this vehicle from your profile? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={deleteVehicle}
              >
                Yes, Remove Vehicle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>
                Enter your vehicle details below. You'll be able to add documents later.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddVehicle}>
              <div className="space-y-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="regNumber">Registration Number</Label>
                  <Input id="regNumber" placeholder="e.g., TS07AB1234" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select defaultValue="car">
                    <SelectTrigger id="vehicleType">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="auto">Auto Rickshaw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="e.g., Hyundai i20" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year of Manufacture</Label>
                  <Input id="year" placeholder="e.g., 2022" required />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddVehicleOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-titeh-primary hover:bg-blue-600">
                  Add Vehicle
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default VehicleManagement;
