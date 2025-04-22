
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import DriverImageUploader from "./DriverImageUploader";
import DriverFingerprintEnroller from "./DriverFingerprintEnroller";
import { User, Save, X } from "lucide-react";

interface AddDriverFormProps {
  onSubmit: (driverData: any) => void;
  onCancel: () => void;
}

const AddDriverForm = ({ onSubmit, onCancel }: AddDriverFormProps) => {
  const { toast } = useToast();
  const [driverData, setDriverData] = useState({
    name: "",
    licenseNumber: "",
    fatherName: "",
    address: "",
    dob: "",
    bloodGroup: "",
    phoneNumber: "",
    email: "",
    gender: "male",
    nationality: "Indian",
    vehicleCategories: [] as string[],
    photo: "",
    fingerprint: "",
  });

  const [formStep, setFormStep] = useState<"personal" | "documents" | "verification">("personal");
  
  const updateDriverData = (field: string, value: any) => {
    setDriverData({ ...driverData, [field]: value });
  };

  const handlePhotoCapture = (photoUrl: string) => {
    updateDriverData("photo", photoUrl);
  };

  const handleFingerprintEnroll = (fingerprintData: string) => {
    updateDriverData("fingerprint", fingerprintData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!driverData.name || !driverData.licenseNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(driverData);
    toast({
      title: "Driver Added",
      description: "Driver information has been successfully saved",
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 text-titeh-primary" />
          Add New Driver
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" value={formStep} onValueChange={(value) => setFormStep(value as any)}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="personal" className="flex-1">Personal Details</TabsTrigger>
              <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
              <TabsTrigger value="verification" className="flex-1">Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={driverData.name}
                    onChange={(e) => updateDriverData("name", e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input
                    id="fatherName"
                    value={driverData.fatherName}
                    onChange={(e) => updateDriverData("fatherName", e.target.value)}
                    placeholder="Enter father's name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth <span className="text-red-500">*</span></Label>
                  <Input
                    id="dob"
                    type="date"
                    value={driverData.dob}
                    onChange={(e) => updateDriverData("dob", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={driverData.gender} 
                    onValueChange={(value) => updateDriverData("gender", value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select 
                    value={driverData.bloodGroup} 
                    onValueChange={(value) => updateDriverData("bloodGroup", value)}
                  >
                    <SelectTrigger id="bloodGroup">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={driverData.nationality}
                    onChange={(e) => updateDriverData("nationality", e.target.value)}
                    placeholder="Enter nationality"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={driverData.phoneNumber}
                    onChange={(e) => updateDriverData("phoneNumber", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={driverData.email}
                    onChange={(e) => updateDriverData("email", e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={driverData.address}
                    onChange={(e) => updateDriverData("address", e.target.value)}
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={() => setFormStep("documents")} 
                  className="bg-titeh-primary"
                >
                  Next: Documents
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="licenseNumber"
                    value={driverData.licenseNumber}
                    onChange={(e) => updateDriverData("licenseNumber", e.target.value)}
                    placeholder="Enter license number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vehicle Categories</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["LMV", "HMV", "MCWG", "MCWOG", "Transport", "Non-Transport"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={driverData.vehicleCategories.includes(category)}
                          onChange={(e) => {
                            const updatedCategories = e.target.checked
                              ? [...driverData.vehicleCategories, category]
                              : driverData.vehicleCategories.filter(c => c !== category);
                            updateDriverData("vehicleCategories", updatedCategories);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-titeh-primary focus:ring-titeh-primary"
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setFormStep("personal")}
                >
                  Back: Personal Details
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setFormStep("verification")} 
                  className="bg-titeh-primary"
                >
                  Next: Verification
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="verification">
              <div className="space-y-6">
                {/* Driver Fingerprint Component */}
                <DriverFingerprintEnroller 
                  onFingerprintEnroll={handleFingerprintEnroll}
                  existingFingerprintData={driverData.fingerprint}
                />
                
                {/* Driver Photo Component */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Driver Photo</h3>
                  <DriverImageUploader 
                    onImageCapture={handlePhotoCapture}
                    existingImageUrl={driverData.photo}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setFormStep("documents")}
                >
                  Back: Documents
                </Button>
                <div className="space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Driver
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddDriverForm;
