
import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, Save, User, FileText, Trash2, Shield, CircleCheck, CircleX, Image, X } from "lucide-react";
import FlashLight from "@/components/icons/FlashLight";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminUsers } from "@/lib/adminConfig";

interface DriverRecord {
  id: string;
  name: string;
  licenseNumber: string;
  validUntil: string;
  vehicleClass: string;
  photoUrl: string;
  status: "valid" | "expired" | "suspended" | "not_found";
  address: string;
  age: string;
  notes?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalConditions?: string;
  trainingCertificates?: string[];
  documents?: { name: string; url: string; }[];
}

const AdminDriverDetails = () => {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<DriverRecord[]>(() => {
    const savedDrivers = localStorage.getItem('adminDriverRecords');
    return savedDrivers ? JSON.parse(savedDrivers) : [];
  });
  
  const [newDriver, setNewDriver] = useState<Partial<DriverRecord>>({
    name: "",
    licenseNumber: "",
    validUntil: "",
    vehicleClass: "",
    status: "valid",
    address: "",
    age: "",
    notes: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalConditions: "",
    trainingCertificates: [],
    documents: []
  });
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [facing, setFacing] = useState<"user" | "environment">("environment");
  const [activeAdmin, setActiveAdmin] = useState(adminUsers[0].email);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDriver(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are allowed",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewDriver(prev => ({
          ...prev,
          documents: [...(prev.documents || []), {
            name: file.name,
            url: event.target.result as string
          }]
        }));
      }
    };
    reader.readAsDataURL(file);
  };
  
  const saveDriversToLocalStorage = (updatedDrivers: DriverRecord[]) => {
    localStorage.setItem('adminDriverRecords', JSON.stringify(updatedDrivers));
  };

  const handleSaveDriver = () => {
    if (!newDriver.name || !newDriver.licenseNumber || !imageSrc) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields and add a photo",
        variant: "destructive",
      });
      return;
    }

    const driverId = `drv-${Date.now().toString(36)}`;
    const driverRecord: DriverRecord = {
      ...(newDriver as Omit<DriverRecord, 'id' | 'photoUrl'>),
      id: driverId,
      photoUrl: imageSrc
    };

    const updatedDrivers = [...drivers, driverRecord];
    setDrivers(updatedDrivers);
    saveDriversToLocalStorage(updatedDrivers);
    
    // Reset form
    setNewDriver({
      name: "",
      licenseNumber: "",
      validUntil: "",
      vehicleClass: "",
      status: "valid",
      address: "",
      age: "",
      notes: ""
    });
    setImageSrc(null);
    
    toast({
      title: "Driver Added",
      description: "Driver information has been saved successfully",
    });
  };
  
  const handleDeleteDriver = (id: string) => {
    const updatedDrivers = drivers.filter(driver => driver.id !== id);
    setDrivers(updatedDrivers);
    saveDriversToLocalStorage(updatedDrivers);
    
    toast({
      title: "Driver Removed",
      description: "Driver record has been deleted",
    });
  };
  
  const openCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
      
      setIsCameraOpen(true);
      
      // Try to access flashlight if environment camera
      if (facing === "environment") {
        try {
          const track = mediaStream.getVideoTracks()[0];
          // Handle flashlight access in a way that bypasses TypeScript constraints
          if (track && typeof track.getCapabilities === 'function') {
            const capabilities = track.getCapabilities();
            // @ts-ignore: Flashlight functionality varies by browser
            if (capabilities && capabilities.torch) {
              // @ts-ignore: Applying torch constraint
              await track.applyConstraints({ advanced: [{ torch: isFlashlightOn }] });
            }
          }
        } catch (flashlightError) {
          console.error("Flashlight access error:", flashlightError);
        }
      }
      
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Access Failed",
        description: "Could not access camera. Check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const toggleFlashlight = async () => {
    if (!stream) return;
    
    try {
      const newFlashlightState = !isFlashlightOn;
      const track = stream.getVideoTracks()[0];
      
      if (track && 'getCapabilities' in track) {
        const capabilities = track.getCapabilities();
        if (capabilities && 'torch' in capabilities) {
          await track.applyConstraints({
            // @ts-ignore - Torch is supported on some mobile devices
            advanced: [{ torch: newFlashlightState }]
          });
          
          setIsFlashlightOn(newFlashlightState);
          
          toast({
            title: newFlashlightState ? "Flashlight On" : "Flashlight Off",
            description: newFlashlightState ? "Night vision activated" : "Night vision deactivated",
          });
        } else {
          toast({
            title: "Flashlight Unavailable",
            description: "This device doesn't support flashlight control",
            variant: "default",
          });
        }
      }
    } catch (err) {
      console.error("Error toggling flashlight:", err);
      toast({
        title: "Flashlight Error",
        description: "Could not control the flashlight",
        variant: "destructive",
      });
    }
  };
  
  const toggleCameraFacing = () => {
    // Stop current stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Toggle facing mode
    setFacing(prev => prev === "user" ? "environment" : "user");
    setIsFlashlightOn(false);
    
    // Reopen camera with new facing mode
    setTimeout(() => {
      openCamera();
    }, 300);
  };
  
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setImageSrc(dataUrl);
      }
      
      // Stop camera stream
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraOpen(false);
      setIsFlashlightOn(false);
      
      toast({
        title: "Photo Captured",
        description: "Driver photo has been taken",
      });
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const isAuthorizedAdmin = () => {
    return adminUsers.some(admin => admin.email === activeAdmin);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-titeh-primary">Admin: Driver Records Management</h1>
          
          <div className="flex items-center space-x-4">
            <Select value={activeAdmin} onValueChange={setActiveAdmin}>
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Select admin user" />
              </SelectTrigger>
              <SelectContent>
                {adminUsers.map((admin) => (
                  <SelectItem key={admin.email} value={admin.email}>
                    {admin.name} ({admin.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-titeh-primary mr-2" />
              <span>Admin Console</span>
            </div>
          </div>
        </div>
        
        {isAuthorizedAdmin() ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Add New Driver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-1/3">
                      <div className="mb-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center h-40 overflow-hidden">
                          {imageSrc ? (
                            <img 
                              src={imageSrc} 
                              alt="Driver" 
                              className="h-full object-cover" 
                            />
                          ) : (
                            <div className="text-center p-4">
                              <User className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">No photo yet</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex mt-3 space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setIsCameraOpen(true)}
                          >
                            <Camera className="h-4 w-4 mr-1" />
                            Camera
                          </Button>
                          
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                          
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileInput}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="name">Full Name*</Label>
                          <Input 
                            id="name" 
                            name="name"
                            value={newDriver.name}
                            onChange={handleInputChange}
                            placeholder="Enter full name"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="licenseNumber">License Number*</Label>
                          <Input 
                            id="licenseNumber" 
                            name="licenseNumber"
                            value={newDriver.licenseNumber}
                            onChange={handleInputChange}
                            placeholder="Format: TG0220210123456"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="validUntil">Valid Until</Label>
                            <Input 
                              id="validUntil" 
                              name="validUntil"
                              type="date"
                              value={newDriver.validUntil}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="vehicleClass">Vehicle Class</Label>
                            <Select 
                              value={newDriver.vehicleClass || ''} 
                              onValueChange={(value) => setNewDriver(prev => ({ ...prev, vehicleClass: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="LMV">LMV</SelectItem>
                                <SelectItem value="MCWG">MCWG</SelectItem>
                                <SelectItem value="HMV">HMV</SelectItem>
                                <SelectItem value="LMV, MCWG">LMV, MCWG</SelectItem>
                                <SelectItem value="LMV, HMV">LMV, HMV</SelectItem>
                                <SelectItem value="LMV, MCWG, HMV">LMV, MCWG, HMV</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="status">License Status</Label>
                          <Select 
                            value={newDriver.status || 'valid'} 
                            onValueChange={(value: "valid" | "expired" | "suspended" | "not_found") => 
                              setNewDriver(prev => ({ ...prev, status: value }))
                            }
                          >
                            <SelectTrigger>
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
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      name="address"
                      value={newDriver.address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      name="age"
                      value={newDriver.age}
                      onChange={handleInputChange}
                      placeholder="Enter age"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                      <Input 
                        id="emergencyContactName" 
                        name="emergencyContactName"
                        value={newDriver.emergencyContactName}
                        onChange={handleInputChange}
                        placeholder="Emergency contact name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                      <Input 
                        id="emergencyContactPhone" 
                        name="emergencyContactPhone"
                        type="tel"
                        value={newDriver.emergencyContactPhone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="medicalConditions">Medical Conditions</Label>
                    <Textarea 
                      id="medicalConditions" 
                      name="medicalConditions"
                      value={newDriver.medicalConditions || ''}
                      onChange={handleInputChange}
                      placeholder="List any relevant medical conditions"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="trainingCertificates">Training Certificates</Label>
                    <Input 
                      id="trainingCertificates" 
                      name="trainingCertificates"
                      value={newDriver.trainingCertificates?.join(', ')}
                      onChange={(e) => {
                        const certificates = e.target.value.split(',').map(cert => cert.trim());
                        setNewDriver(prev => ({ ...prev, trainingCertificates: certificates }));
                      }}
                      placeholder="Enter certificates separated by commas"
                    />
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Documents (PDF, max 5MB)</Label>
                    <input 
                      ref={docInputRef}
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={handleDocumentUpload}
                    />
                    <div className="flex flex-col gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => docInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload Document
                      </Button>
                      {newDriver.documents && newDriver.documents.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {newDriver.documents.map((doc, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4" />
                              <span>{doc.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500"
                                onClick={() => {
                                  setNewDriver(prev => ({
                                    ...prev,
                                    documents: prev.documents?.filter((_, i) => i !== index)
                                  }));
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      name="notes"
                      value={newDriver.notes || ''}
                      onChange={handleInputChange}
                      placeholder="Additional information"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSaveDriver} 
                    className="w-full bg-titeh-primary"
                    disabled={!newDriver.name || !newDriver.licenseNumber || !imageSrc}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Driver Record
                  </Button>
                </div>
                
                {/* Camera Dialog */}
                {isCameraOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <h3 className="font-medium">Take Driver Photo</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-500" 
                          onClick={() => {
                            if (stream) {
                              stream.getTracks().forEach(track => track.stop());
                              setStream(null);
                            }
                            setIsCameraOpen(false);
                            setIsFlashlightOn(false);
                          }}
                        >
                          &times;
                        </Button>
                      </div>
                      
                      <div className="relative">
                        <video 
                          ref={videoRef}
                          autoPlay 
                          playsInline
                          className="w-full h-64 object-cover"
                          onLoadedMetadata={() => {
                            if (videoRef.current) {
                              videoRef.current.play();
                            }
                          }}
                        />
                        
                        <canvas ref={canvasRef} className="hidden" />
                        
                        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                          {facing === "user" ? "Front Camera" : "Back Camera"}
                        </div>
                        
                        {facing === "environment" && (
                          <div className={`absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs ${isFlashlightOn ? 'text-yellow-300' : 'text-white'}`}>
                            {isFlashlightOn ? 'Flashlight ON' : 'Flashlight OFF'}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={toggleCameraFacing}
                          className="flex-1"
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          Switch Camera
                        </Button>
                        
                        {facing === "environment" && (
                          <Button 
                            variant="outline" 
                            onClick={toggleFlashlight}
                            className={`flex-1 ${isFlashlightOn ? 'bg-yellow-50 border-yellow-300' : ''}`}
                          >
                            <FlashLight className={`h-4 w-4 mr-1 ${isFlashlightOn ? 'text-yellow-500' : ''}`} />
                            {isFlashlightOn ? 'Turn Off Light' : 'Turn On Light'}
                          </Button>
                        )}
                        
                        <Button 
                          className="flex-1 bg-titeh-primary"
                          onClick={takePhoto}
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          Take Photo
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Driver Records Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {drivers.length > 0 ? (
                    drivers.map((driver) => (
                      <div key={driver.id} className="border rounded-lg p-3 flex items-start space-x-3 hover:bg-gray-50">
                        <div className="flex-shrink-0">
                          <img 
                            src={driver.photoUrl} 
                            alt={driver.name}
                            className="h-16 w-16 object-cover rounded-md" 
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{driver.name}</h3>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500 h-6 w-6 p-0"
                              onClick={() => handleDeleteDriver(driver.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>License: {driver.licenseNumber}</p>
                            <div className="flex justify-between">
                              <span>Valid until: {driver.validUntil}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                driver.status === "valid" 
                                  ? "bg-green-100 text-green-800" 
                                  : driver.status === "expired"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}>
                                {driver.status === "valid" ? "Valid" : driver.status === "expired" ? "Expired" : "Suspended"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>No driver records yet</p>
                      <p className="text-sm mt-1">Add drivers using the form</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="p-6 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <CircleX className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-6">You don't have permission to access the admin panel.</p>
              <p className="text-gray-500 max-w-md mx-auto">
                Only authorized administrators can access this section. Please select an authorized admin email from the dropdown above.
              </p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AdminDriverDetails;
