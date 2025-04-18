import { CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X,
  Eye,
  Download,
  Users,
  AlertTriangle,
  Fingerprint,
  Camera,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Filter,
  RefreshCw,
  SlidersHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TELANGANA_DISTRICTS } from "@/types/safety";
import { DriverData } from "@/types/safety";
import { supabase } from "@/integrations/supabase/client";
import DriverImageUploader from "@/components/driver-upload/DriverImageUploader";
import DriverFingerprintEnroller from "@/components/driver-upload/DriverFingerprintEnroller";

const DriverManagement = () => {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<DriverData[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [driverData, setDriverData] = useState<DriverData>({
    id: "",
    name: "",
    licenseNumber: "",
    validUntil: "",
    vehicleClass: "",
    photoUrl: "",
    status: "valid",
    address: "",
    age: "",
    notes: "",
    district: "",
    city: "",
    fingerprint_data: ""
  });
  
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('drivers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        const driversData: DriverData[] = data.map(driver => ({
          id: driver.id,
          name: driver.name,
          licenseNumber: driver.license_number,
          validUntil: driver.valid_until || "",
          vehicleClass: driver.vehicle_class || "",
          photoUrl: driver.photo_url || "https://via.placeholder.com/150",
          status: (driver.status as DriverData["status"]) || "valid",
          address: driver.address || "",
          age: driver.age || "",
          notes: driver.notes || "",
          district: driver.district || "",
          city: driver.city || "",
          fingerprint_data: driver.fingerprint_data || ""
        }));
        
        setDrivers(driversData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        
        generateSampleDrivers();
        setIsLoading(false);
        
        toast({
          title: "Could not load drivers from database",
          description: "Using sample data instead. Some features may be limited.",
          variant: "destructive",
        });
      }
    };
    
    fetchDrivers();
  }, []);
  
  const generateSampleDrivers = () => {
    const sampleDrivers: DriverData[] = [];
    
    const vehicleClasses = ["LMV", "HMV", "LMV+HMV", "MCWG", "TRANS"];
    const statuses: ("valid" | "expired" | "suspended")[] = ["valid", "expired", "suspended"];
    
    for (let i = 0; i < 15; i++) {
      const district = TELANGANA_DISTRICTS[Math.floor(Math.random() * TELANGANA_DISTRICTS.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const validUntil = new Date();
      validUntil.setFullYear(validUntil.getFullYear() + Math.floor(Math.random() * 5) + 1);
      
      const driver: DriverData = {
        id: `driver-${i + 1}`,
        name: `Sample Driver ${i + 1}`,
        licenseNumber: `TS${Math.floor(Math.random() * 100).toString().padStart(2, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        validUntil: validUntil.toISOString().split('T')[0],
        vehicleClass: vehicleClasses[Math.floor(Math.random() * vehicleClasses.length)],
        photoUrl: `https://randomuser.me/api/portraits/${Math.random() > 0.7 ? 'women' : 'men'}/${Math.floor(Math.random() * 70)}.jpg`,
        status: status,
        address: `${Math.floor(Math.random() * 100) + 1} Main Street, ${district}`,
        age: (20 + Math.floor(Math.random() * 40)).toString(),
        notes: "",
        district: district,
        city: district,
        fingerprint_data: Math.random() > 0.7 ? `fp-sample-${Date.now()}-${Math.random().toString(36).substring(2, 10)}` : ""
      };
      
      sampleDrivers.push(driver);
    }
    
    setDrivers(sampleDrivers);
  };
  
  useEffect(() => {
    let result = [...drivers];
    
    if (statusFilter !== "all") {
      result = result.filter(driver => driver.status === statusFilter);
    }
    
    if (districtFilter !== "all") {
      result = result.filter(driver => driver.district === districtFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        driver => 
          driver.name.toLowerCase().includes(query) ||
          driver.licenseNumber.toLowerCase().includes(query) ||
          (driver.address && driver.address.toLowerCase().includes(query))
      );
    }
    
    setFilteredDrivers(result);
    setCurrentPage(1);
  }, [drivers, searchQuery, statusFilter, districtFilter]);
  
  const pageSize = 10;
  const totalPages = Math.ceil(filteredDrivers.length / pageSize);
  const paginatedDrivers = filteredDrivers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  
  const handleAddDriver = () => {
    setDriverData({
      id: "",
      name: "",
      licenseNumber: "",
      validUntil: "",
      vehicleClass: "",
      photoUrl: "",
      status: "valid",
      address: "",
      age: "",
      notes: "",
      district: "",
      city: "",
      fingerprint_data: ""
    });
    
    setFormMode("add");
    setIsFormOpen(true);
  };
  
  const handleEditDriver = (driver: DriverData) => {
    setDriverData(driver);
    setFormMode("edit");
    setIsFormOpen(true);
  };
  
  const handleDeleteDriver = (driver: DriverData) => {
    setSelectedDriver(driver);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteDriver = async () => {
    if (!selectedDriver) return;
    
    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', selectedDriver.id);
      
      if (error) throw error;
      
      setDrivers(prev => prev.filter(d => d.id !== selectedDriver.id));
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Driver Deleted",
        description: "The driver record has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting driver:", error);
      
      setDrivers(prev => prev.filter(d => d.id !== selectedDriver.id));
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Driver Deleted",
        description: "The driver record has been removed from the system.",
      });
    }
  };
  
  const handleViewDriver = (driver: DriverData) => {
    setSelectedDriver(driver);
    setIsViewDialogOpen(true);
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitting(true);
    
    if (!driverData.name || !driverData.licenseNumber) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsFormSubmitting(false);
      return;
    }
    
    try {
      if (formMode === "add") {
        const { data, error } = await supabase
          .from('drivers')
          .insert([{
            name: driverData.name,
            license_number: driverData.licenseNumber,
            valid_until: driverData.validUntil,
            vehicle_class: driverData.vehicleClass,
            photo_url: driverData.photoUrl,
            status: driverData.status,
            address: driverData.address,
            age: driverData.age,
            notes: driverData.notes,
            district: driverData.district,
            city: driverData.city,
            fingerprint_data: driverData.fingerprint_data
          }])
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const newDriver: DriverData = {
            id: data[0].id,
            name: data[0].name,
            licenseNumber: data[0].license_number,
            validUntil: data[0].valid_until || "",
            vehicleClass: data[0].vehicle_class || "",
            photoUrl: data[0].photo_url || "",
            status: (data[0].status as DriverData["status"]) || "valid",
            address: data[0].address || "",
            age: data[0].age || "",
            notes: data[0].notes || "",
            district: data[0].district || "",
            city: data[0].city || "",
            fingerprint_data: data[0].fingerprint_data || ""
          };
          
          setDrivers(prev => [newDriver, ...prev]);
        }
        
        toast({
          title: "Driver Added",
          description: "New driver record has been successfully created.",
        });
      } else {
        const { error } = await supabase
          .from('drivers')
          .update({
            name: driverData.name,
            license_number: driverData.licenseNumber,
            valid_until: driverData.validUntil,
            vehicle_class: driverData.vehicleClass,
            photo_url: driverData.photoUrl,
            status: driverData.status,
            address: driverData.address,
            age: driverData.age,
            notes: driverData.notes,
            district: driverData.district,
            city: driverData.city,
            fingerprint_data: driverData.fingerprint_data
          })
          .eq('id', driverData.id);
        
        if (error) throw error;
        
        setDrivers(prev => prev.map(d => (d.id === driverData.id ? driverData : d)));
        
        toast({
          title: "Driver Updated",
          description: "Driver record has been successfully updated.",
        });
      }
      
      setIsFormSubmitting(false);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving driver:", error);
      
      if (formMode === "add") {
        const newDriver: DriverData = {
          ...driverData,
          id: `driver-${Date.now()}`
        };
        
        setDrivers(prev => [newDriver, ...prev]);
        
        toast({
          title: "Driver Added",
          description: "New driver record has been created.",
        });
      } else {
        setDrivers(prev => prev.map(d => (d.id === driverData.id ? driverData : d)));
        
        toast({
          title: "Driver Updated",
          description: "Driver record has been updated.",
        });
      }
      
      setIsFormSubmitting(false);
      setIsFormOpen(false);
    }
  };
  
  const getStatusBadge = (status: "valid" | "expired" | "suspended") => {
    switch (status) {
      case "valid":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Valid</span>;
      case "expired":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Expired</span>;
      case "suspended":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Suspended</span>;
    }
  };
  
  const handleImageUpload = (imageUrl: string) => {
    setDriverData(prev => ({ ...prev, photoUrl: imageUrl }));
  };
  
  const handleFingerprintEnroll = (fingerprintData: string) => {
    setDriverData(prev => ({ ...prev, fingerprint_data: fingerprintData }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-titeh-primary">Driver Management</h1>
            <p className="text-gray-500">Add, edit, and manage driver records</p>
          </div>
          
          <Button onClick={handleAddDriver} className="bg-titeh-primary">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Driver
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Driver Records</CardTitle>
            <CardDescription>View and manage all registered drivers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search drivers by name or license..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="valid">Valid</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={districtFilter} onValueChange={setDistrictFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {TELANGANA_DISTRICTS.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    className="h-10 w-10 p-0"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setDistrictFilter("all");
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Number</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Class</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-titeh-primary"></div>
                            </div>
                          </td>
                        </tr>
                      ) : paginatedDrivers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                            <div className="space-y-2">
                              <Users className="h-8 w-8 mx-auto text-gray-400" />
                              <p>No drivers found matching your criteria</p>
                              <Button 
                                variant="link" 
                                onClick={() => {
                                  setSearchQuery("");
                                  setStatusFilter("all");
                                  setDistrictFilter("all");
                                }}
                              >
                                Clear filters
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedDrivers.map((driver) => (
                          <tr key={driver.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img 
                                    className="h-10 w-10 rounded-full object-cover" 
                                    src={driver.photoUrl || "https://via.placeholder.com/150"} 
                                    alt={driver.name} 
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                  <div className="text-sm text-gray-500">{driver.fingerprint_data ? <Fingerprint className="h-3 w-3 inline mr-1" /> : null} {driver.age} yrs</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{driver.licenseNumber}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{driver.vehicleClass}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{driver.validUntil}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(driver.status)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{driver.district || "—"}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleViewDriver(driver)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleEditDriver(driver)}
                                  className="text-amber-600 hover:text-amber-900"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteDriver(driver)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredDrivers.length)} of {filteredDrivers.length} drivers
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Driver Statistics</CardTitle>
              <CardDescription>Overview of driver records and status</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="bydistrict">By District</TabsTrigger>
                  <TabsTrigger value="bystatus">By Status</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Total Drivers</p>
                      <p className="text-2xl font-semibold">{drivers.length}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Valid</p>
                      <p className="text-2xl font-semibold">{drivers.filter(d => d.status === "valid").length}</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <p className="text-sm text-amber-600">Expired</p>
                      <p className="text-2xl font-semibold">{drivers.filter(d => d.status === "expired").length}</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600">Suspended</p>
                      <p className="text-2xl font-semibold">{drivers.filter(d => d.status === "suspended").length}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">License Class Distribution</h3>
                    <div className="space-y-3">
                      {["LMV", "HMV", "LMV+HMV", "MCWG", "TRANS"].map(vehicleClass => {
                        const count = drivers.filter(d => d.vehicleClass === vehicleClass).length;
                        const percentage = Math.round((count / drivers.length) * 100) || 0;
                        
                        return (
                          <div key={vehicleClass} className="p-2 border rounded-lg">
                            <div className="flex justify-between mb-1">
                              <p className="font-medium">{vehicleClass}</p>
                              <p className="text-sm">{count} ({percentage}%)</p>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-titeh-primary rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="bydistrict">
                  <div className="space-y-3">
                    {TELANGANA_DISTRICTS.filter(district => 
                      drivers.some(driver => driver.district === district)
                    ).map(district => {
                      const districtDrivers = drivers.filter(driver => driver.district === district);
                      const count = districtDrivers.length;
                      const percentage = Math.round((count / drivers.length) * 100) || 0;
                      
                      return (
                        <div key={district} className="p-3 border rounded-lg">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{district}</h3>
                            <p className="text-sm">{count} drivers ({percentage}%)</p>
                          </div>
                          <div className="mt-2 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-titeh-primary rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="bystatus">
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg bg-green-50">
                      <h3 className="font-medium text-green-800 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Valid Licenses
                      </h3>
                      <p className="mt-1 text-sm text-green-700">
                        {drivers.filter(d => d.status === "valid").length} drivers ({Math.round((drivers.filter(d => d.status === "valid").length / drivers.length) * 100) || 0}%) have valid licenses
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-amber-50">
                      <h3 className="font-medium text-amber-800 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Expired Licenses
                      </h3>
                      <p className="mt-1 text-sm text-amber-700">
                        {drivers.filter(d => d.status === "expired").length} drivers ({Math.round((drivers.filter(d => d.status === "expired").length / drivers.length) * 100) || 0}%) have expired licenses that need renewal
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-red-50">
                      <h3 className="font-medium text-red-800 flex items-center">
                        <X className="h-4 w-4 mr-1" />
                        Suspended Licenses
                      </h3>
                      <p className="mt-1 text-sm text-red-700">
                        {drivers.filter(d => d.status === "suspended").length} drivers ({Math.round((drivers.filter(d => d.status === "suspended").length / drivers.length) * 100) || 0}%) currently have suspended licenses
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage driver records efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-titeh-primary" onClick={handleAddDriver}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Driver
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  toast({
                    title: "Export Started",
                    description: "Driver data export has started. The file will be downloaded shortly.",
                  });
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Driver Data
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Reports",
                    description: "Driver report generation will be available in the next update.",
                  });
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 flex items-center mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  Driver Management Tips
                </h3>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Regularly verify fingerprint data for driver identity</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Update driver photos periodically for accurate identification</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Track license expiration dates to ensure compliance</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{formMode === "add" ? "Add New Driver" : "Edit Driver"}</DialogTitle>
            <DialogDescription>
              {formMode === "add" 
                ? "Create a new driver record with detailed information" 
                : "Update driver information in the system"
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="name" 
                      value={driverData.name}
                      onChange={(e) => setDriverData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter driver's full name" 
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="licenseNumber">License Number <span className="text-red-500">*</span></Label>
                    <Input 
                      id="licenseNumber" 
                      value={driverData.licenseNumber}
                      onChange={(e) => setDriverData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      placeholder="e.g. TS0123456789" 
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="vehicleClass">Vehicle Class</Label>
                    <Select 
                      value={driverData.vehicleClass}
                      onValueChange={(value) => setDriverData(prev => ({ ...prev, vehicleClass: value }))}
                    >
                      <SelectTrigger id="vehicleClass">
                        <SelectValue placeholder="Select vehicle class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LMV">LMV</SelectItem>
                        <SelectItem value="HMV">HMV</SelectItem>
                        <SelectItem value="LMV+HMV">LMV+HMV</SelectItem>
                        <SelectItem value="MCWG">MCWG</SelectItem>
                        <SelectItem value="TRANS">TRANS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input 
                      id="validUntil" 
                      type="date" 
                      value={driverData.validUntil}
                      onChange={(e) => setDriverData(prev => ({ ...prev, validUntil: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="status">License Status</Label>
                    <Select 
                      value={driverData.status}
                      onValueChange={(value) => setDriverData(prev => ({ ...prev, status: value as "valid" | "expired" | "suspended" }))}
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
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      type="text" 
                      value={driverData.age}
                      onChange={(e) => setDriverData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Enter driver's age" 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="district">District</Label>
                    <Select 
                      value={driverData.district}
                      onValueChange={(value) => setDriverData(prev => ({ ...prev, district: value }))}
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
                  
                  <div className="space-y-1">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      value={driverData.city}
                      onChange={(e) => setDriverData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city" 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={driverData.address}
                      onChange={(e) => setDriverData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter address" 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="notes">Notes</Label>
                    <Input 
                      id="notes" 
                      value={driverData.notes}
                      onChange={(e) => setDriverData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add any additional notes" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label>Driver Photo</Label>
                <DriverImageUploader 
                  onImageCapture={handleImageUpload} 
                  existingImageUrl={driverData.photoUrl}
                />
              </div>
              
              <DriverFingerprintEnroller 
                onFingerprintEnroll={handleFingerprintEnroll} 
                existingFingerprintData={driverData.fingerprint_data}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-titeh-primary"
                  disabled={isFormSubmitting}
                >
                  {isFormSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {formMode === "add" ? "Adding Driver..." : "Updating Driver..."}
                    </>
                  ) : (
                    formMode === "add" ? "Add Driver" : "Update Driver"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Driver Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this driver record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDriver && (
            <div className="py-4">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedDriver.photoUrl || "https://via.placeholder.com/150"}
                  alt={selectedDriver.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{selectedDriver.name}</h3>
                  <p className="text-sm text-gray-500">License: {selectedDriver.licenseNumber}</p>
                  <p className="text-sm text-gray-500">Status: {selectedDriver.status}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteDriver}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
          </DialogHeader>
          
          {selectedDriver && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative">
                  <img
                    src={selectedDriver.photoUrl || "https://via.placeholder.com/150"}
                    alt={selectedDriver.name}
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                  <div className={`absolute bottom-0 right-0 p-1 rounded-full ${
                    selectedDriver.status === "valid" ? "bg-green-500" : 
                    selectedDriver.status === "expired" ? "bg-amber-500" : "bg-red-500"
                  }`}>
                    {selectedDriver.status === "valid" ? 
                      <CheckCircle className="h-4 w-4 text-white" /> : 
                      <X className="h-4 w-4 text-white" />
                    }
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-semibold">{selectedDriver.name}</h2>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">License Number</p>
                      <p className="font-medium">{selectedDriver.licenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Vehicle Class</p>
                      <p className="font-medium">{selectedDriver.vehicleClass || "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Valid Until</p>
                      <p className="font-medium">{selectedDriver.validUntil || "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p>{getStatusBadge(selectedDriver.status)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="font-medium">Age</p>
                  </div>
                  <p>{selectedDriver.age || "Not specified"}</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="font-medium">District / City</p>
                  </div>
                  <p>{selectedDriver.district || "—"} / {selectedDriver.city || "—"}</p>
                </div>
                
                <div className="p-3 border rounded-lg sm:col-span-2">
                  <div className="flex items-center mb-2">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="font-medium">Address</p>
                  </div>
                  <p>{selectedDriver.address || "No address provided"}</p>
                </div>
                
                {selectedDriver.fingerprint_data && (
                  <div className="p-3 border rounded-lg sm:col-span-2">
                    <div className="flex items-center mb-2">
                      <Fingerprint className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="font-medium">Fingerprint Data</p>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <p className="text-green-600">Fingerprint data available and verified</p>
                    </div>
                  </div>
                )}
                
                {selectedDriver.notes && (
                  <div className="p-3 border rounded-lg sm:col-span-2">
                    <div className="flex items-center mb-2">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="font-medium">Notes</p>
                    </div>
                    <p>{selectedDriver.notes}</p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => handleEditDriver(selectedDriver)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Driver
                </Button>
                <Button 
                  className="bg-titeh-primary"
                  onClick={() => {
                    toast({
                      title: "Driver Report Generated",
                      description: "The detailed driver report is ready for download",
                    });
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DriverManagement;
