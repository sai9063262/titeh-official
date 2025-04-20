
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Search, Edit, Trash2, User, XCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { DriverData, TELANGANA_DISTRICTS } from "@/types/safety";
import { useToast } from "@/components/ui/use-toast";
import DriverService from "@/services/driver-service";
import { nanoid } from "nanoid";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<DriverData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Form state for adding/editing a driver
  const [driverForm, setDriverForm] = useState<Omit<DriverData, "id">>({
    name: "",
    licenseNumber: "",
    validUntil: "",
    vehicleClass: "",
    photoUrl: "https://via.placeholder.com/150",
    status: "valid",
    address: "",
    age: "",
    notes: "",
    district: "",
    city: "",
    fingerprint_data: "",
    // Default values for all required properties
    blood_type: "Unknown",
    created_at: new Date().toISOString(),
    criminal_record_notes: "",
    criminal_record_status: "None",
    date_of_birth: "",
    document_url: "",
    driver_experience_years: 0,
    emergency_contact_name: "",
    emergency_phone_number: "",
    endorsements: [],
    health_conditions: [],
    height: "",
    last_verification: new Date().toISOString(),
    license_class: "",
    license_issue_date: "",
    license_points: 0,
    license_restrictions: [],
    organ_donor: false,
    phone_number: "",
    previous_offenses: [],
    profile_image: "",
    restrictions: [],
    updated_at: new Date().toISOString(),
    vehicle_color: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_plate: "",
    vehicle_type: "",
    vehicle_year: "",
    verification_status: "Pending",
    weight: ""
  });

  // Load drivers on component mount
  useEffect(() => {
    loadDrivers();
  }, []);

  // Filter drivers when search query or selected district changes
  useEffect(() => {
    filterDrivers();
  }, [searchQuery, selectedDistrict, drivers]);

  const loadDrivers = async () => {
    setIsLoading(true);
    try {
      const allDrivers = await DriverService.getAllDrivers();
      setDrivers(allDrivers.map(driver => ({
        ...driver,
        district: driver.district || "Unknown",
        city: driver.city || "Unknown",
        fingerprint_data: driver.fingerprint_data || ""
      })));
    } catch (error) {
      console.error("Error loading drivers:", error);
      toast({
        title: "Error",
        description: "Failed to load drivers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterDrivers = () => {
    let filtered = [...drivers];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (driver) =>
          driver.name.toLowerCase().includes(query) ||
          driver.licenseNumber.toLowerCase().includes(query)
      );
    }
    
    // Filter by district
    if (selectedDistrict) {
      filtered = filtered.filter(
        (driver) => driver.district === selectedDistrict
      );
    }
    
    setFilteredDrivers(filtered);
  };

  const handleAddDriver = async () => {
    try {
      // Create new driver with ID
      const newDriver: DriverData = {
        id: nanoid(),
        ...driverForm,
      };
      
      // Add to database
      const addedDriver = await DriverService.addDriver(driverForm);
      
      if (addedDriver) {
        // Add to local state
        setDrivers([...drivers, newDriver]);
        
        toast({
          title: "Success",
          description: "Driver added successfully",
        });
        
        // Reset form and close dialog
        resetForm();
        setIsAddDialogOpen(false);
      } else {
        throw new Error("Failed to add driver");
      }
    } catch (error) {
      console.error("Error adding driver:", error);
      toast({
        title: "Error",
        description: "Failed to add driver",
        variant: "destructive",
      });
    }
  };

  const handleEditDriver = async () => {
    if (!selectedDriver) return;
    
    try {
      // Update in database
      const success = await DriverService.updateDriver(selectedDriver.id, driverForm);
      
      if (success) {
        // Update in local state
        const updatedDrivers = drivers.map((driver) =>
          driver.id === selectedDriver.id ? { ...driver, ...driverForm } : driver
        );
        setDrivers(updatedDrivers);
        
        toast({
          title: "Success",
          description: "Driver updated successfully",
        });
        
        // Reset and close
        resetForm();
        setIsEditDialogOpen(false);
        setSelectedDriver(null);
      } else {
        throw new Error("Failed to update driver");
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      toast({
        title: "Error",
        description: "Failed to update driver",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDriver = async (id: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;
    
    try {
      // Delete from database
      const success = await DriverService.deleteDriver(id);
      
      if (success) {
        // Delete from local state
        const updatedDrivers = drivers.filter((driver) => driver.id !== id);
        setDrivers(updatedDrivers);
        
        toast({
          title: "Success",
          description: "Driver deleted successfully",
        });
      } else {
        throw new Error("Failed to delete driver");
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast({
        title: "Error",
        description: "Failed to delete driver",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (driver: DriverData) => {
    setDriverForm({
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      validUntil: driver.validUntil,
      vehicleClass: driver.vehicleClass,
      photoUrl: driver.photoUrl,
      status: driver.status,
      address: driver.address,
      age: driver.age,
      notes: driver.notes,
      district: driver.district || "",
      city: driver.city || "",
      fingerprint_data: driver.fingerprint_data || "",
      // Include all the required fields
      blood_type: driver.blood_type || "Unknown",
      created_at: driver.created_at || new Date().toISOString(),
      criminal_record_notes: driver.criminal_record_notes || "",
      criminal_record_status: driver.criminal_record_status || "None",
      date_of_birth: driver.date_of_birth || "",
      document_url: driver.document_url || "",
      driver_experience_years: driver.driver_experience_years || 0,
      emergency_contact_name: driver.emergency_contact_name || "",
      emergency_phone_number: driver.emergency_phone_number || "",
      endorsements: driver.endorsements || [],
      health_conditions: driver.health_conditions || [],
      height: driver.height || "",
      last_verification: driver.last_verification || new Date().toISOString(),
      license_class: driver.license_class || "",
      license_issue_date: driver.license_issue_date || "",
      license_points: driver.license_points || 0,
      license_restrictions: driver.license_restrictions || [],
      organ_donor: driver.organ_donor || false,
      phone_number: driver.phone_number || "",
      previous_offenses: driver.previous_offenses || [],
      profile_image: driver.profile_image || "",
      restrictions: driver.restrictions || [],
      updated_at: driver.updated_at || new Date().toISOString(),
      vehicle_color: driver.vehicle_color || "",
      vehicle_make: driver.vehicle_make || "",
      vehicle_model: driver.vehicle_model || "",
      vehicle_plate: driver.vehicle_plate || "",
      vehicle_type: driver.vehicle_type || "",
      vehicle_year: driver.vehicle_year || "",
      verification_status: driver.verification_status || "Pending",
      weight: driver.weight || ""
    });
    setSelectedDriver(driver);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setDriverForm({
      name: "",
      licenseNumber: "",
      validUntil: "",
      vehicleClass: "",
      photoUrl: "https://via.placeholder.com/150",
      status: "valid",
      address: "",
      age: "",
      notes: "",
      district: "",
      city: "",
      fingerprint_data: "",
      // Default values for all required properties
      blood_type: "Unknown",
      created_at: new Date().toISOString(),
      criminal_record_notes: "",
      criminal_record_status: "None",
      date_of_birth: "",
      document_url: "",
      driver_experience_years: 0,
      emergency_contact_name: "",
      emergency_phone_number: "",
      endorsements: [],
      health_conditions: [],
      height: "",
      last_verification: new Date().toISOString(),
      license_class: "",
      license_issue_date: "",
      license_points: 0,
      license_restrictions: [],
      organ_donor: false,
      phone_number: "",
      previous_offenses: [],
      profile_image: "",
      restrictions: [],
      updated_at: new Date().toISOString(),
      vehicle_color: "",
      vehicle_make: "",
      vehicle_model: "",
      vehicle_plate: "",
      vehicle_type: "",
      vehicle_year: "",
      verification_status: "Pending",
      weight: ""
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "suspended":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-titeh-primary mb-2">Driver Management</h1>
            <p className="text-gray-500">Add, edit or remove driver records from the system</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Driver
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Driver Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name or license number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Districts</SelectItem>
                    {TELANGANA_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading driver records...</p>
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium">No drivers found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>License Number</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.licenseNumber}</TableCell>
                        <TableCell>{driver.validUntil}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(driver.status)}
                            <span className="capitalize">{driver.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{driver.district}</TableCell>
                        <TableCell>{driver.city}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(driver)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteDriver(driver.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Driver Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
              <DialogDescription>Enter driver details below to add to the system.</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="address">Address & Contact</TabsTrigger>
                <TabsTrigger value="license">License Details</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={driverForm.name}
                      onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      value={driverForm.age}
                      onChange={(e) => setDriverForm({ ...driverForm, age: e.target.value })}
                      placeholder="Enter age"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photoUrl">Photo URL</Label>
                    <Input
                      id="photoUrl"
                      value={driverForm.photoUrl}
                      onChange={(e) => setDriverForm({ ...driverForm, photoUrl: e.target.value })}
                      placeholder="Enter photo URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={driverForm.status}
                      onValueChange={(value: "valid" | "expired" | "suspended") => setDriverForm({ ...driverForm, status: value })}
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={driverForm.notes}
                    onChange={(e) => setDriverForm({ ...driverForm, notes: e.target.value })}
                    placeholder="Any additional notes"
                  />
                </div>
              </TabsContent>
              <TabsContent value="address" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Select
                      value={driverForm.district}
                      onValueChange={(value) => setDriverForm({ ...driverForm, district: value })}
                    >
                      <SelectTrigger id="district">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {TELANGANA_DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={driverForm.city}
                      onChange={(e) => setDriverForm({ ...driverForm, city: e.target.value })}
                      placeholder="Enter city"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    value={driverForm.address}
                    onChange={(e) => setDriverForm({ ...driverForm, address: e.target.value })}
                    placeholder="Enter complete address"
                  />
                </div>
              </TabsContent>
              <TabsContent value="license" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={driverForm.licenseNumber}
                      onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })}
                      placeholder="Enter license number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleClass">Vehicle Class</Label>
                    <Input
                      id="vehicleClass"
                      value={driverForm.vehicleClass}
                      onChange={(e) => setDriverForm({ ...driverForm, vehicleClass: e.target.value })}
                      placeholder="Enter vehicle class"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={driverForm.validUntil}
                      onChange={(e) => setDriverForm({ ...driverForm, validUntil: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDriver}>Add Driver</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Driver Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Driver</DialogTitle>
              <DialogDescription>Update driver details below.</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="address">Address & Contact</TabsTrigger>
                <TabsTrigger value="license">License Details</TabsTrigger>
              </TabsList>
              {/* Same content as Add Driver Dialog with values from driverForm */}
              <TabsContent value="basic" className="space-y-4">
                {/* Basic Info fields - same as Add Dialog */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={driverForm.name}
                      onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-age">Age</Label>
                    <Input
                      id="edit-age"
                      value={driverForm.age}
                      onChange={(e) => setDriverForm({ ...driverForm, age: e.target.value })}
                      placeholder="Enter age"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-photoUrl">Photo URL</Label>
                    <Input
                      id="edit-photoUrl"
                      value={driverForm.photoUrl}
                      onChange={(e) => setDriverForm({ ...driverForm, photoUrl: e.target.value })}
                      placeholder="Enter photo URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={driverForm.status}
                      onValueChange={(value: "valid" | "expired" | "suspended") => setDriverForm({ ...driverForm, status: value })}
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={driverForm.notes}
                    onChange={(e) => setDriverForm({ ...driverForm, notes: e.target.value })}
                    placeholder="Any additional notes"
                  />
                </div>
              </TabsContent>
              <TabsContent value="address" className="space-y-4">
                {/* Address & Contact fields - same as Add Dialog */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-district">District</Label>
                    <Select
                      value={driverForm.district}
                      onValueChange={(value) => setDriverForm({ ...driverForm, district: value })}
                    >
                      <SelectTrigger id="edit-district">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {TELANGANA_DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-city">City</Label>
                    <Input
                      id="edit-city"
                      value={driverForm.city}
                      onChange={(e) => setDriverForm({ ...driverForm, city: e.target.value })}
                      placeholder="Enter city"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Full Address</Label>
                  <Textarea
                    id="edit-address"
                    value={driverForm.address}
                    onChange={(e) => setDriverForm({ ...driverForm, address: e.target.value })}
                    placeholder="Enter complete address"
                  />
                </div>
              </TabsContent>
              <TabsContent value="license" className="space-y-4">
                {/* License Details fields - same as Add Dialog */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-licenseNumber">License Number</Label>
                    <Input
                      id="edit-licenseNumber"
                      value={driverForm.licenseNumber}
                      onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })}
                      placeholder="Enter license number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-vehicleClass">Vehicle Class</Label>
                    <Input
                      id="edit-vehicleClass"
                      value={driverForm.vehicleClass}
                      onChange={(e) => setDriverForm({ ...driverForm, vehicleClass: e.target.value })}
                      placeholder="Enter vehicle class"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-validUntil">Valid Until</Label>
                    <Input
                      id="edit-validUntil"
                      type="date"
                      value={driverForm.validUntil}
                      onChange={(e) => setDriverForm({ ...driverForm, validUntil: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditDriver}>Update Driver</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default DriverManagement;
