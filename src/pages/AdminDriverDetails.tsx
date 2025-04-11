
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  User, UserPlus, Lock, Camera, Image, Upload, Search, 
  FileText, AlertTriangle, Download, Send, RefreshCw,
  FileSpreadsheet, Trash2, Edit, CheckCircle2, X, Calendar, Droplets
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DriverDetails {
  id: string;
  name: string;
  licenseNumber: string;
  dob: string;
  address: string;
  phone: string;
  email: string;
  vehicleType: string;
  regNumber: string;
  issueDate: string;
  expiryDate: string;
  bloodGroup: string;
  organDonor: boolean;
  emergencyContact: string;
  drivingHistory: string;
  photoUrl: string;
  documents: { name: string; type: string; size: string; }[];
  status: "active" | "suspended" | "expired";
  addedDate: string;
}

const AdminDriverDetails = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddDriverForm, setShowAddDriverForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Mock admin email - this would normally be stored securely
  const ADMIN_EMAIL = "admin@titeh.gov.in";
  
  // Sample driver data
  const [drivers, setDrivers] = useState<DriverDetails[]>([
    {
      id: "DRV001",
      name: "Raj Kumar Singh",
      licenseNumber: "TG02420240001234",
      dob: "1985-04-15",
      address: "1-95/1, Konkapaka, Warangal - 506336",
      phone: "9876543210",
      email: "raj.kumar@example.com",
      vehicleType: "Car",
      regNumber: "TS07AB1234",
      issueDate: "2022-01-10",
      expiryDate: "2032-01-09",
      bloodGroup: "O+",
      organDonor: true,
      emergencyContact: "9876543211",
      drivingHistory: "No accidents, 2 speed violations in 2023",
      photoUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=150&h=150",
      documents: [
        { name: "Medical Certificate", type: "PDF", size: "1.2 MB" },
        { name: "ID Proof", type: "PDF", size: "0.8 MB" }
      ],
      status: "active",
      addedDate: "2023-12-15"
    },
    {
      id: "DRV002",
      name: "Priya Sharma",
      licenseNumber: "TG02420240005678",
      dob: "1990-08-23",
      address: "2-45/A, Banjara Hills, Hyderabad - 500034",
      phone: "8765432109",
      email: "priya.sharma@example.com",
      vehicleType: "Bike",
      regNumber: "TS08CD5678",
      issueDate: "2020-05-20",
      expiryDate: "2030-05-19",
      bloodGroup: "B+",
      organDonor: false,
      emergencyContact: "8765432100",
      drivingHistory: "No violations",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      documents: [
        { name: "ID Proof", type: "PDF", size: "1.0 MB" }
      ],
      status: "active",
      addedDate: "2024-01-05"
    }
  ]);
  
  // New driver form state
  const [newDriver, setNewDriver] = useState<Partial<DriverDetails>>({
    name: "",
    licenseNumber: "",
    dob: "",
    address: "",
    phone: "",
    email: "",
    vehicleType: "Car",
    regNumber: "",
    issueDate: "",
    expiryDate: "",
    bloodGroup: "O+",
    organDonor: false,
    emergencyContact: "",
    drivingHistory: "",
    photoUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=150&h=150",
    documents: [],
    status: "active"
  });

  // Handle OTP sending
  const handleSendOTP = () => {
    if (adminEmail === ADMIN_EMAIL) {
      setLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your email",
        });
      }, 1500);
    } else {
      toast({
        title: "Authentication Failed",
        description: "You are not authorized to access this panel",
        variant: "destructive",
      });
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = () => {
    if (otp === "123456") { // Mock OTP verification
      setLoading(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setLoading(false);
        toast({
          title: "Authentication Successful",
          description: "Welcome to the Admin Driver Management Panel",
        });
      }, 1500);
    } else {
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect",
        variant: "destructive",
      });
    }
  };

  // Handle adding a new driver
  const handleAddDriver = () => {
    if (!newDriver.name || !newDriver.licenseNumber || !newDriver.dob) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate license number format
    const licenseRegex = /^TG\d{10}$/;
    if (!licenseRegex.test(newDriver.licenseNumber)) {
      toast({
        title: "Invalid License Number",
        description: "License number should be in format TG-XXXXXXXXXX",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(newDriver.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number should be 10 digits",
        variant: "destructive",
      });
      return;
    }

    const newId = `DRV${String(drivers.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    
    const driverToAdd: DriverDetails = {
      ...newDriver as any,
      id: newId,
      addedDate: today,
      status: "active",
      documents: newDriver.documents || []
    };

    setDrivers([...drivers, driverToAdd]);
    setShowAddDriverForm(false);
    
    // Reset form
    setNewDriver({
      name: "",
      licenseNumber: "",
      dob: "",
      address: "",
      phone: "",
      email: "",
      vehicleType: "Car",
      regNumber: "",
      issueDate: "",
      expiryDate: "",
      bloodGroup: "O+",
      organDonor: false,
      emergencyContact: "",
      drivingHistory: "",
      photoUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=150&h=150",
      documents: [],
      status: "active"
    });
    
    toast({
      title: "Driver Added",
      description: `${driverToAdd.name} has been added to the database`,
    });
    
    // Simulate notification
    setTimeout(() => {
      toast({
        title: "Notification Sent",
        description: "Administrator has been notified about the new driver",
      });
    }, 1000);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Start upload progress simulation
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Add document to driver
          setNewDriver(prev => ({
            ...prev,
            documents: [
              ...(prev.documents || []),
              { 
                name: file.name, 
                type: file.name.split('.').pop().toUpperCase(), 
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
              }
            ]
          }));
          
          toast({
            title: "File Uploaded",
            description: `${file.name} has been uploaded successfully`,
          });
          
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Handle photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Start upload progress simulation
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Create a fake URL for the uploaded image
          // In a real app, you'd upload to a server and get a real URL
          const fakeUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150";
          
          setNewDriver(prev => ({
            ...prev,
            photoUrl: fakeUrl
          }));
          
          toast({
            title: "Photo Uploaded",
            description: "Driver photo has been uploaded successfully",
          });
          
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Handle Google Sheets sync
  const handleSyncGoogleSheets = () => {
    setSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncing(false);
          
          const now = new Date();
          setLastSync(now.toLocaleString());
          
          toast({
            title: "Google Sheets Sync Complete",
            description: `${drivers.length} driver records synced successfully`,
          });
          
          return 0;
        }
        return prev + 5;
      });
    }, 200);
  };

  // Handle CSV download
  const handleDownloadCSV = () => {
    // In a real app, this would generate a real CSV file
    toast({
      title: "CSV Downloaded",
      description: "Driver data has been downloaded as CSV file",
    });
  };

  // Filter drivers based on search query
  const filteredDrivers = drivers.filter(driver => {
    const searchLower = searchQuery.toLowerCase();
    return (
      driver.name.toLowerCase().includes(searchLower) ||
      driver.licenseNumber.toLowerCase().includes(searchLower) ||
      driver.regNumber.toLowerCase().includes(searchLower)
    );
  });

  // Delete driver
  const handleDeleteDriver = (id: string) => {
    setDrivers(drivers.filter(driver => driver.id !== id));
    
    toast({
      title: "Driver Deleted",
      description: "The driver has been removed from the database",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Admin Driver Management</h1>
        
        {!isAuthenticated ? (
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Lock className="text-titeh-primary mr-2" />
              <h2 className="text-lg font-semibold">Admin Authentication Required</h2>
            </div>
            
            {!otpSent ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Please enter your admin email to access the driver management panel.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input 
                    id="adminEmail"
                    type="email"
                    placeholder="Enter admin email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">For demo, use: admin@titeh.gov.in</p>
                </div>
                
                <Button 
                  onClick={handleSendOTP} 
                  disabled={loading}
                  className="w-full bg-titeh-primary"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send OTP
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Please enter the 6-digit OTP sent to {adminEmail}
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="otp">One-Time Password</Label>
                  <Input 
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500">For demo, use: 123456</p>
                </div>
                
                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={loading}
                  className="w-full bg-titeh-primary"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Verify OTP
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Welcome, Administrator. You have full access to the driver database.
              </p>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAuthenticated(false)}
                  className="mr-2"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Lock Panel
                </Button>
                
                <Dialog open={showAddDriverForm} onOpenChange={setShowAddDriverForm}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-titeh-primary">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add New Driver
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Driver</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <User className="mr-2 h-4 w-4 text-titeh-primary" />
                          Personal Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              value={newDriver.name}
                              onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                              placeholder="Enter full name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="licenseNumber">Driver License Number</Label>
                            <Input 
                              id="licenseNumber" 
                              value={newDriver.licenseNumber}
                              onChange={(e) => setNewDriver({...newDriver, licenseNumber: e.target.value})}
                              placeholder="e.g., TG0123456789"
                            />
                            <p className="text-xs text-gray-500 mt-1">Format: TG followed by 10 digits</p>
                          </div>
                          <div>
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input 
                              id="dob" 
                              type="date" 
                              value={newDriver.dob}
                              onChange={(e) => setNewDriver({...newDriver, dob: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="address">Address</Label>
                            <Textarea 
                              id="address" 
                              value={newDriver.address}
                              onChange={(e) => setNewDriver({...newDriver, address: e.target.value})}
                              placeholder="Enter full address"
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input 
                                id="phone" 
                                value={newDriver.phone}
                                onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                                placeholder="10-digit number"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input 
                                id="email" 
                                type="email" 
                                value={newDriver.email}
                                onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                                placeholder="email@example.com"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="bloodGroup">Blood Group</Label>
                              <select 
                                id="bloodGroup" 
                                className="w-full p-2 border rounded"
                                value={newDriver.bloodGroup}
                                onChange={(e) => setNewDriver({...newDriver, bloodGroup: e.target.value})}
                              >
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="organDonor" className="block mb-2">Organ Donor</Label>
                              <div className="flex items-center">
                                <Switch 
                                  id="organDonor"
                                  checked={newDriver.organDonor}
                                  onCheckedChange={(checked) => setNewDriver({...newDriver, organDonor: checked})}
                                />
                                <span className="ml-2 text-sm">
                                  {newDriver.organDonor ? "Yes" : "No"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="emergencyContact">Emergency Contact</Label>
                            <Input 
                              id="emergencyContact" 
                              value={newDriver.emergencyContact}
                              onChange={(e) => setNewDriver({...newDriver, emergencyContact: e.target.value})}
                              placeholder="10-digit number"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Vehicle & License Information */}
                      <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-titeh-primary" />
                          Vehicle & License Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="vehicleType">Vehicle Type</Label>
                            <select 
                              id="vehicleType" 
                              className="w-full p-2 border rounded"
                              value={newDriver.vehicleType}
                              onChange={(e) => setNewDriver({...newDriver, vehicleType: e.target.value})}
                            >
                              <option value="Car">Car</option>
                              <option value="Bike">Bike</option>
                              <option value="Truck">Truck</option>
                              <option value="Auto">Auto</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="regNumber">Registration Number</Label>
                            <Input 
                              id="regNumber" 
                              value={newDriver.regNumber}
                              onChange={(e) => setNewDriver({...newDriver, regNumber: e.target.value})}
                              placeholder="e.g., TS01AB1234"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="issueDate">Issue Date</Label>
                              <Input 
                                id="issueDate" 
                                type="date" 
                                value={newDriver.issueDate}
                                onChange={(e) => setNewDriver({...newDriver, issueDate: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input 
                                id="expiryDate" 
                                type="date" 
                                value={newDriver.expiryDate}
                                onChange={(e) => setNewDriver({...newDriver, expiryDate: e.target.value})}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="drivingHistory">Driving History</Label>
                            <Textarea 
                              id="drivingHistory" 
                              value={newDriver.drivingHistory}
                              onChange={(e) => setNewDriver({...newDriver, drivingHistory: e.target.value})}
                              placeholder="Enter any accidents, violations, etc."
                              rows={3}
                            />
                          </div>
                          
                          {/* Photo Upload */}
                          <div>
                            <Label className="block mb-2">Driver Photo</Label>
                            <div className="flex items-center space-x-4">
                              <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
                                {newDriver.photoUrl && (
                                  <img 
                                    src={newDriver.photoUrl} 
                                    alt="Driver" 
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap gap-2">
                                  <label className="cursor-pointer">
                                    <div className="px-3 py-2 bg-titeh-primary text-white rounded-md flex items-center text-sm">
                                      <Camera className="mr-2 h-4 w-4" />
                                      Take Photo
                                    </div>
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="hidden" 
                                      onChange={handlePhotoUpload}
                                      capture="user"
                                    />
                                  </label>
                                  
                                  <label className="cursor-pointer">
                                    <div className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center text-sm">
                                      <Image className="mr-2 h-4 w-4" />
                                      Gallery
                                    </div>
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="hidden" 
                                      onChange={handlePhotoUpload}
                                    />
                                  </label>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex items-center"
                                    onClick={() => window.open("https://photos.google.com", "_blank")}
                                  >
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 12.76c1.48 0 2.68 1.2 2.68 2.68s-1.2 2.68-2.68 2.68-2.68-1.2-2.68-2.68 1.2-2.68 2.68-2.68zm0-9.3c4.3 0 7.8 3.5 7.8 7.8 0 1.2-.27 2.35-.78 3.4-.1.18-.3.18-.48.18H5.45c-.17 0-.37 0-.48-.2-.5-1.03-.78-2.18-.78-3.38 0-4.3 3.5-7.8 7.8-7.8zM12 0C5.38 0 0 5.38 0 12s5.38 12 12 12 12-5.38 12-12S18.62 0 12 0z" />
                                    </svg>
                                    Google Photos
                                  </Button>
                                </div>
                                
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                  <div className="space-y-2">
                                    <Progress value={uploadProgress} />
                                    <p className="text-xs text-gray-500">Uploading: {uploadProgress}%</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Document Upload */}
                          <div>
                            <Label className="block mb-2">Documents</Label>
                            <div className="space-y-2">
                              <label className="cursor-pointer block">
                                <div className="px-3 py-2 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-sm">
                                  <Upload className="mr-2 h-4 w-4 text-titeh-primary" />
                                  Click to upload files (PDF, max 5MB)
                                </div>
                                <input 
                                  type="file" 
                                  accept=".pdf" 
                                  className="hidden" 
                                  onChange={handleFileUpload} 
                                />
                              </label>
                              
                              {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="space-y-2">
                                  <Progress value={uploadProgress} />
                                  <p className="text-xs text-gray-500">Uploading: {uploadProgress}%</p>
                                </div>
                              )}
                              
                              {newDriver.documents && newDriver.documents.length > 0 && (
                                <div className="mt-2">
                                  <h4 className="text-xs font-medium mb-1">Uploaded Documents:</h4>
                                  <div className="space-y-1">
                                    {newDriver.documents.map((doc, index) => (
                                      <div key={index} className="text-xs flex items-center p-2 bg-gray-50 rounded">
                                        <FileText className="h-3 w-3 mr-2 text-titeh-primary" />
                                        <span className="flex-1">{doc.name}</span>
                                        <span className="text-gray-500 mr-2">{doc.size}</span>
                                        <button 
                                          className="text-red-500 hover:text-red-700"
                                          onClick={() => {
                                            setNewDriver({
                                              ...newDriver,
                                              documents: newDriver.documents.filter((_, i) => i !== index)
                                            });
                                          }}
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Warning */}
                    <div className="mt-4 p-3 bg-amber-50 rounded-md flex items-start">
                      <AlertTriangle className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                      <p className="text-xs text-gray-600">
                        Make sure all information is correct and verified. All driver data is encrypted and accessible only to authorized personnel.
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddDriverForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddDriver}
                        className="bg-titeh-primary"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Driver
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">Total Drivers</h3>
                  <User className="text-titeh-primary" size={18} />
                </div>
                <p className="text-2xl font-bold">{drivers.length}</p>
                <p className="text-xs text-gray-500">Last added on {drivers.length > 0 ? drivers[drivers.length - 1].addedDate : "N/A"}</p>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">Active Licenses</h3>
                  <CheckCircle2 className="text-green-500" size={18} />
                </div>
                <p className="text-2xl font-bold">{drivers.filter(d => d.status === "active").length}</p>
                <p className="text-xs text-gray-500">
                  {Math.round((drivers.filter(d => d.status === "active").length / drivers.length) * 100)}% of total
                </p>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">Organ Donors</h3>
                  <Droplets className="text-red-500" size={18} />
                </div>
                <p className="text-2xl font-bold">{drivers.filter(d => d.organDonor).length}</p>
                <p className="text-xs text-gray-500">
                  {Math.round((drivers.filter(d => d.organDonor).length / drivers.length) * 100)}% of total
                </p>
              </Card>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Card className="p-4 flex-1">
                <div className="flex items-center mb-4">
                  <Search className="text-titeh-primary mr-2" size={18} />
                  <h3 className="font-medium">Search Drivers</h3>
                </div>
                <Input 
                  placeholder="Search by name, license number, or vehicle number" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">
                  {filteredDrivers.length} {filteredDrivers.length === 1 ? 'result' : 'results'} found
                </p>
              </Card>
              
              <Card className="p-4 flex-1">
                <div className="flex items-center mb-4">
                  <FileSpreadsheet className="text-titeh-primary mr-2" size={18} />
                  <h3 className="font-medium">Google Sheets Integration</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Button 
                      onClick={handleSyncGoogleSheets}
                      disabled={syncing}
                      className="bg-titeh-primary mb-2"
                      size="sm"
                    >
                      {syncing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync to Google Sheets
                        </>
                      )}
                    </Button>
                    
                    <p className="text-xs text-gray-500">
                      {lastSync ? `Last sync: ${lastSync}` : 'Not synced yet'}
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadCSV}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                </div>
                
                {syncing && (
                  <div className="mt-2">
                    <Progress value={syncProgress} className="mb-1" />
                    <p className="text-xs text-gray-500">
                      Syncing data to Google Sheets... {syncProgress}%
                    </p>
                  </div>
                )}
              </Card>
            </div>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Driver Database</h3>
                
                <Tabs defaultValue="all" className="mb-6">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Drivers</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="expired">Expired</TabsTrigger>
                    <TabsTrigger value="suspended">Suspended</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <div className="space-y-4">
                      {filteredDrivers.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No drivers found matching your search criteria</p>
                      ) : (
                        filteredDrivers.map((driver) => (
                          <div key={driver.id} className="border rounded-lg overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/4 p-4 flex justify-center md:justify-start">
                                <div className="w-28 h-28 rounded-full overflow-hidden">
                                  <img 
                                    src={driver.photoUrl} 
                                    alt={driver.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              
                              <div className="md:w-3/4 p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="text-lg font-semibold flex items-center">
                                      {driver.name}
                                      <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${
                                        driver.status === 'active' ? 'bg-green-100 text-green-800' :
                                        driver.status === 'expired' ? 'bg-amber-100 text-amber-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                                      </span>
                                    </h4>
                                    <div className="flex items-center text-gray-500 text-sm">
                                      <FileText className="h-3 w-3 mr-1" />
                                      {driver.licenseNumber}
                                    </div>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4 text-titeh-primary" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleDeleteDriver(driver.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">DOB:</span> {driver.dob}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Phone:</span> {driver.phone}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Blood Group:</span> {driver.bloodGroup}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Issue Date:</span> {driver.issueDate}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Expiry Date:</span> {driver.expiryDate}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Vehicle:</span> {driver.vehicleType} ({driver.regNumber})
                                  </div>
                                </div>
                                
                                <div className="mt-2 text-sm">
                                  <span className="text-gray-500">Address:</span> {driver.address}
                                </div>
                                
                                {driver.documents.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-gray-500 text-sm">Documents:</span>
                                    <div className="flex space-x-2 mt-1">
                                      {driver.documents.map((doc, index) => (
                                        <div 
                                          key={index}
                                          className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center"
                                        >
                                          <FileText className="h-3 w-3 mr-1 text-titeh-primary" />
                                          {doc.name}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="active">
                    <div className="space-y-4">
                      {filteredDrivers.filter(d => d.status === "active").length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No active drivers found</p>
                      ) : (
                        filteredDrivers
                          .filter(d => d.status === "active")
                          .map((driver) => (
                            // Same driver card as above
                            <div key={driver.id} className="border rounded-lg overflow-hidden">
                              {/* ... Simplified for brevity, repeat same structure as above ... */}
                              <div className="flex items-center p-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                  <img 
                                    src={driver.photoUrl} 
                                    alt={driver.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-semibold">{driver.name}</h4>
                                  <p className="text-sm text-gray-600">{driver.licenseNumber}</p>
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="expired">
                    <div className="space-y-4">
                      <p className="text-center text-gray-500 py-4">No expired drivers found</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="suspended">
                    <div className="space-y-4">
                      <p className="text-center text-gray-500 py-4">No suspended drivers found</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="p-4 bg-blue-50">
              <h2 className="font-semibold mb-2 flex items-center">
                <AlertTriangle className="text-blue-500 mr-2" size={18} />
                Admin Access Only
              </h2>
              <p className="text-sm text-gray-600">This section is restricted to authorized administrators only. All actions are logged and audited for security purposes.</p>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDriverDetails;
