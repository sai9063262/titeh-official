
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  UserPlus, 
  Search, 
  UserCheck, 
  MapPin, 
  FileEdit, 
  Trash2, 
  UserX, 
  Users, 
  Fingerprint,
  AlertTriangle,
  CheckCircle 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { DriverData } from "@/lib/verification-utils";
import DriverImageUploader from "@/components/driver-upload/DriverImageUploader";
import DriverFingerprintEnroller from "@/components/driver-upload/DriverFingerprintEnroller";
import { TELANGANA_DISTRICTS } from "@/types/safety";

const DriverManagement = () => {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userDistrict, setUserDistrict] = useState<string>("");
  
  // New driver form state
  const [newDriver, setNewDriver] = useState({
    name: "",
    licenseNumber: "",
    validUntil: "",
    vehicleClass: "",
    photoUrl: "",
    fingerprint_data: "",
    status: "valid" as DriverData["status"],
    address: "",
    district: "",
    city: "",
    phoneNumber: "",
    email: ""
  });
  
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          
          // Find nearest district based on coordinates (mock implementation)
          const randomDistrict = TELANGANA_DISTRICTS[Math.floor(Math.random() * TELANGANA_DISTRICTS.length)];
          setUserDistrict(randomDistrict);
          setNewDriver(prev => ({ ...prev, district: randomDistrict }));
          
          toast({
            title: "Location access granted",
            description: "We'll pre-fill your district information.",
          });
          
          // Fetch drivers for that district
          fetchDrivers();
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission(false);
          
          toast({
            title: "Location access denied",
            description: "Please select your district manually.",
            variant: "destructive",
          });
          
          // Fetch all drivers
          fetchDrivers();
        }
      );
    } else {
      setLocationPermission(false);
      
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      
      // Fetch all drivers
      fetchDrivers();
    }
  };
  
  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match DriverData interface
      const formattedDrivers = data.map(driver => ({
        id: driver.id,
        name: driver.name,
        licenseNumber: driver.license_number,
        validUntil: driver.valid_until || "",
        vehicleClass: driver.vehicle_class || "",
        photoUrl: driver.photo_url || "https://via.placeholder.com/150",
        status: (driver.status as DriverData["status"]) || "valid",
        address: driver.address || "",
        district: driver.district || "",
        city: driver.city || "",
        phoneNumber: driver.phone_number || "",
        email: driver.email || "",
        fingerprint_data: driver.fingerprint_data || ""
      }));
      
      setDrivers(formattedDrivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast({
        title: "Failed to fetch drivers",
        description: "There was an error loading the driver data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddDriver = async () => {
    // Validate form
    if (!newDriver.name || !newDriver.licenseNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the name and license number.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase.from("drivers").insert([
        {
          name: newDriver.name,
          license_number: newDriver.licenseNumber,
          valid_until: newDriver.validUntil,
          vehicle_class: newDriver.vehicleClass,
          photo_url: newDriver.photoUrl,
          fingerprint_data: newDriver.fingerprint_data,
          status: newDriver.status,
          address: newDriver.address,
          district: newDriver.district || userDistrict,
          city: newDriver.city,
          phone_number: newDriver.phoneNumber,
          email: newDriver.email
        }
      ]).select();
      
      if (error) throw error;
      
      toast({
        title: "Driver Added",
        description: "The driver has been successfully added to the database.",
      });
      
      // Reset form and close dialog
      setNewDriver({
        name: "",
        licenseNumber: "",
        validUntil: "",
        vehicleClass: "",
        photoUrl: "",
        fingerprint_data: "",
        status: "valid",
        address: "",
        district: userDistrict,
        city: "",
        phoneNumber: "",
        email: ""
      });
      
      setIsAddDialogOpen(false);
      
      // Refresh driver list
      fetchDrivers();
    } catch (error) {
      console.error("Error adding driver:", error);
      toast({
        title: "Failed to Add Driver",
        description: "There was an error adding the driver to the database.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditDriver = async () => {
    if (!selectedDriver) return;
    
    try {
      const { error } = await supabase
        .from("drivers")
        .update({
          name: selectedDriver.name,
          license_number: selectedDriver.licenseNumber,
          valid_until: selectedDriver.validUntil,
          vehicle_class: selectedDriver.vehicleClass,
          photo_url: selectedDriver.photoUrl,
          fingerprint_data: selectedDriver.fingerprint_data,
          status: selectedDriver.status,
          address: selectedDriver.address,
          district: selectedDriver.district,
          city: selectedDriver.city,
          phone_number: selectedDriver.phoneNumber,
          email: selectedDriver.email
        })
        .eq("id", selectedDriver.id);
      
      if (error) throw error;
      
      toast({
        title: "Driver Updated",
        description: "The driver information has been successfully updated.",
      });
      
      setIsEditDialogOpen(false);
      fetchDrivers();
    } catch (error) {
      console.error("Error updating driver:", error);
      toast({
        title: "Failed to Update Driver",
        description: "There was an error updating the driver information.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteDriver = async () => {
    if (!selectedDriver) return;
    
    try {
      const { error } = await supabase
        .from("drivers")
        .delete()
        .eq("id", selectedDriver.id);
      
      if (error) throw error;
      
      toast({
        title: "Driver Deleted",
        description: "The driver has been successfully removed from the database.",
      });
      
      setIsDeleteDialogOpen(false);
      fetchDrivers();
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast({
        title: "Failed to Delete Driver",
        description: "There was an error deleting the driver from the database.",
        variant: "destructive",
      });
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredDrivers = drivers.filter(driver => {
    const query = searchQuery.toLowerCase();
    return (
      driver.name.toLowerCase().includes(query) ||
      driver.licenseNumber.toLowerCase().includes(query) ||
      (driver.district && driver.district.toLowerCase().includes(query))
    );
  });
  
  const handleImageCapture = (imageUrl: string) => {
    setNewDriver(prev => ({ ...prev, photoUrl: imageUrl }));
  };
  
  const handleEditDriverImageCapture = (imageUrl: string) => {
    if (selectedDriver) {
      setSelectedDriver({ ...selectedDriver, photoUrl: imageUrl });
    }
  };
  
  const handleFingerprintEnroll = (fingerprintData: string) => {
    setNewDriver(prev => ({ ...prev, fingerprint_data: fingerprintData }));
  };
  
  const handleEditFingerprintEnroll = (fingerprintData: string) => {
    if (selectedDriver) {
      setSelectedDriver({ ...selectedDriver, fingerprint_data: fingerprintData });
    }
  };

  useEffect(() => {
    if (locationPermission === null) {
      requestLocationPermission();
    } else {
      fetchDrivers();
    }
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-titeh-primary">Driver Management</h1>
            <p className="text-gray-600">Add, edit and manage driver records</p>
          </div>
          
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-titeh-primary">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Driver
          </Button>
        </div>
        
        {!locationPermission && locationPermission !== null && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Location access recommended</h3>
                  <p className="text-sm text-amber-700 mb-3">
                    Allow location access to automatically detect your district and show relevant driver data.
                  </p>
                  <Button onClick={requestLocationPermission} className="bg-amber-600 hover:bg-amber-700">
                    Allow Location Access
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name, license or district..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Label htmlFor="district-filter" className="text-sm">District:</Label>
            <Select 
              value={userDistrict} 
              onValueChange={setUserDistrict}
            >
              <SelectTrigger id="district-filter" className="w-[180px]">
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Districts</SelectItem>
                {TELANGANA_DISTRICTS.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin w-10 h-10 border-4 border-titeh-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading driver records...</p>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-lg font-medium mb-2">No drivers found</p>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery ? "No drivers match your search criteria. Try a different search term." : "There are no drivers in the database yet."}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-titeh-primary">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Driver
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrivers.map(driver => (
              <Card key={driver.id} className="overflow-hidden">
                <div className="relative h-40">
                  <img 
                    src={driver.photoUrl || "https://via.placeholder.com/400x200?text=No+Photo"} 
                    alt={driver.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute bottom-0 left-0 right-0 py-1 px-4 text-white ${
                    driver.status === "valid" ? "bg-green-500" :
                    driver.status === "expired" ? "bg-amber-500" : "bg-red-500"
                  }`}>
                    {driver.status === "valid" ? "Valid License" :
                     driver.status === "expired" ? "Expired License" : "Suspended License"}
                  </div>
                </div>
                
                <CardContent className="pt-4">
                  <h3 className="text-lg font-semibold mb-2">{driver.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">License</p>
                      <p className="font-medium">{driver.licenseNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">Vehicle Class</p>
                      <p className="font-medium">{driver.vehicleClass || "N/A"}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">Valid Until</p>
                      <p className="font-medium">{driver.validUntil || "N/A"}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">District</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {driver.district || "Not specified"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center text-xs">
                      {driver.fingerprint_data ? (
                        <span className="flex items-center text-green-600">
                          <Fingerprint className="h-3.5 w-3.5 mr-1" />
                          Fingerprint Enrolled
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-400">
                          <Fingerprint className="h-3.5 w-3.5 mr-1" />
                          No Fingerprint
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedDriver(driver);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <FileEdit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setSelectedDriver(driver);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Driver Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Driver Name</Label>
              <Input
                id="name"
                value={newDriver.name}
                onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                placeholder="Full name"
                className="mb-4"
              />
              
              <Label htmlFor="license">License Number</Label>
              <Input
                id="license"
                value={newDriver.licenseNumber}
                onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                placeholder="License number"
                className="mb-4"
              />
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="valid-until">Valid Until</Label>
                  <Input
                    id="valid-until"
                    type="date"
                    value={newDriver.validUntil}
                    onChange={(e) => setNewDriver({ ...newDriver, validUntil: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="vehicle-class">Vehicle Class</Label>
                  <Select 
                    value={newDriver.vehicleClass} 
                    onValueChange={(value) => setNewDriver({ ...newDriver, vehicleClass: value })}
                  >
                    <SelectTrigger id="vehicle-class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MC">MC (Motorcycle)</SelectItem>
                      <SelectItem value="LMV">LMV (Light Motor Vehicle)</SelectItem>
                      <SelectItem value="HMV">HMV (Heavy Motor Vehicle)</SelectItem>
                      <SelectItem value="TRANS">TRANS (Transport)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="district">District</Label>
                  <Select 
                    value={newDriver.district || userDistrict} 
                    onValueChange={(value) => setNewDriver({ ...newDriver, district: value })}
                  >
                    <SelectTrigger id="district">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {TELANGANA_DISTRICTS.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newDriver.city}
                    onChange={(e) => setNewDriver({ ...newDriver, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
              </div>
              
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={newDriver.address}
                onChange={(e) => setNewDriver({ ...newDriver, address: e.target.value })}
                placeholder="Address"
                className="mb-4"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newDriver.phoneNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, phoneNumber: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                    placeholder="Email address"
                  />
                </div>
              </div>
              
              <Label htmlFor="status" className="mt-4 block">Status</Label>
              <Select 
                value={newDriver.status} 
                onValueChange={(value: DriverData["status"]) => setNewDriver({ ...newDriver, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valid">Valid</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block mb-2">Driver Photo</Label>
              <DriverImageUploader onImageCapture={handleImageCapture} />
              
              <DriverFingerprintEnroller onFingerprintEnroll={handleFingerprintEnroll} />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDriver} className="bg-titeh-primary">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Driver Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
          </DialogHeader>
          
          {selectedDriver && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-name">Driver Name</Label>
                <Input
                  id="edit-name"
                  value={selectedDriver.name}
                  onChange={(e) => setSelectedDriver({ ...selectedDriver, name: e.target.value })}
                  placeholder="Full name"
                  className="mb-4"
                />
                
                <Label htmlFor="edit-license">License Number</Label>
                <Input
                  id="edit-license"
                  value={selectedDriver.licenseNumber}
                  onChange={(e) => setSelectedDriver({ ...selectedDriver, licenseNumber: e.target.value })}
                  placeholder="License number"
                  className="mb-4"
                />
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="edit-valid-until">Valid Until</Label>
                    <Input
                      id="edit-valid-until"
                      type="date"
                      value={selectedDriver.validUntil}
                      onChange={(e) => setSelectedDriver({ ...selectedDriver, validUntil: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-vehicle-class">Vehicle Class</Label>
                    <Select 
                      value={selectedDriver.vehicleClass} 
                      onValueChange={(value) => setSelectedDriver({ ...selectedDriver, vehicleClass: value })}
                    >
                      <SelectTrigger id="edit-vehicle-class">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MC">MC (Motorcycle)</SelectItem>
                        <SelectItem value="LMV">LMV (Light Motor Vehicle)</SelectItem>
                        <SelectItem value="HMV">HMV (Heavy Motor Vehicle)</SelectItem>
                        <SelectItem value="TRANS">TRANS (Transport)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="edit-district">District</Label>
                    <Select 
                      value={selectedDriver.district || ""} 
                      onValueChange={(value) => setSelectedDriver({ ...selectedDriver, district: value })}
                    >
                      <SelectTrigger id="edit-district">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {TELANGANA_DISTRICTS.map(district => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-city">City</Label>
                    <Input
                      id="edit-city"
                      value={selectedDriver.city}
                      onChange={(e) => setSelectedDriver({ ...selectedDriver, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                </div>
                
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={selectedDriver.address}
                  onChange={(e) => setSelectedDriver({ ...selectedDriver, address: e.target.value })}
                  placeholder="Address"
                  className="mb-4"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input
                      id="edit-phone"
                      value={selectedDriver.phoneNumber}
                      onChange={(e) => setSelectedDriver({ ...selectedDriver, phoneNumber: e.target.value })}
                      placeholder="Phone number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={selectedDriver.email}
                      onChange={(e) => setSelectedDriver({ ...selectedDriver, email: e.target.value })}
                      placeholder="Email address"
                    />
                  </div>
                </div>
                
                <Label htmlFor="edit-status" className="mt-4 block">Status</Label>
                <Select 
                  value={selectedDriver.status} 
                  onValueChange={(value: DriverData["status"]) => setSelectedDriver({ ...selectedDriver, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="valid">Valid</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block mb-2">Driver Photo</Label>
                <DriverImageUploader 
                  onImageCapture={handleEditDriverImageCapture}
                  existingImageUrl={selectedDriver.photoUrl}
                />
                
                <DriverFingerprintEnroller 
                  onFingerprintEnroll={handleEditFingerprintEnroll}
                  existingFingerprintData={selectedDriver.fingerprint_data}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDriver} className="bg-titeh-primary">
              <UserCheck className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Driver Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Driver</DialogTitle>
          </DialogHeader>
          
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 mb-1">Confirm Deletion</h3>
                <p className="text-sm text-red-700">
                  Are you sure you want to delete driver <strong>{selectedDriver?.name}</strong> with license <strong>{selectedDriver?.licenseNumber}</strong>? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteDriver} variant="destructive">
              <UserX className="h-4 w-4 mr-2" />
              Delete Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DriverManagement;
