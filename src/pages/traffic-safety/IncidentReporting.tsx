
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Camera, File, CheckCircle, RefreshCw, Upload, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IncidentReporting = () => {
  const { toast } = useToast();
  const [incidentType, setIncidentType] = useState<string>("accident");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [reportId, setReportId] = useState<string>("");
  const [isGetLocationLoading, setIsGetLocationLoading] = useState<boolean>(false);
  
  // Current date time for incident time
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  
  const [incidentDate, setIncidentDate] = useState<string>(formattedDate);
  const [incidentTime, setIncidentTime] = useState<string>(formattedTime);
  
  // Incident type options
  const incidentTypes = [
    { value: "accident", label: "Vehicle Accident", icon: "🚨" },
    { value: "traffic_block", label: "Traffic Congestion", icon: "🚦" },
    { value: "road_damage", label: "Road Damage", icon: "🚧" },
    { value: "signal_issue", label: "Signal Malfunction", icon: "🚥" },
    { value: "illegal_parking", label: "Illegal Parking", icon: "🅿️" },
    { value: "waterlogging", label: "Waterlogging", icon: "💧" },
    { value: "other", label: "Other Issue", icon: "❓" }
  ];
  
  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      
      const file = e.target.files[0];
      
      // Simulated upload with progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            
            // Generate a random placeholder image URL
            const placeholderUrl = `https://source.unsplash.com/random/300x200/?traffic,accident&${Date.now()}`;
            setUploadedPhotos(prev => [...prev, placeholderUrl]);
            
            toast({
              title: "Photo Uploaded",
              description: `${file.name} uploaded successfully`,
              variant: "default",
            });
            
            return 0;
          }
          return prev + 10;
        });
      }, 200);
    }
  };
  
  // Get current location
  const getCurrentLocation = () => {
    setIsGetLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          // Reverse geocoding would happen here in a real app
          // For this demo, we'll just set coordinates and simulate an address
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)} (Near Begumpet, Hyderabad)`);
          setIsGetLocationLoading(false);
          
          toast({
            title: "Location Detected",
            description: "Your current location has been added to the report",
            variant: "default",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsGetLocationLoading(false);
          
          // Fallback location for demo
          setLocation("17.385044, 78.486671 (Near Begumpet, Hyderabad)");
          
          toast({
            title: "Location Added",
            description: "Using approximate location for demo purposes",
            variant: "default",
          });
        }
      );
    } else {
      setIsGetLocationLoading(false);
      
      // Fallback location for demo
      setLocation("17.385044, 78.486671 (Near Begumpet, Hyderabad)");
      
      toast({
        title: "Location Added",
        description: "Using approximate location for demo purposes",
        variant: "default",
      });
    }
  };
  
  // Remove photo
  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
    
    toast({
      title: "Photo Removed",
      description: "The photo has been removed from your report",
      variant: "default",
    });
  };
  
  // Submit the incident report
  const submitReport = () => {
    if (!location || !description) {
      toast({
        title: "Missing Information",
        description: "Please provide location and description",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Generate a random report ID
      const generatedReportId = `IN${Math.floor(100000 + Math.random() * 900000)}`;
      setReportId(generatedReportId);
      
      setIsConfirmDialogOpen(true);
    }, 2000);
  };
  
  // Reset form after submission
  const resetForm = () => {
    setIncidentType("accident");
    setDescription("");
    setLocation("");
    setUploadedPhotos([]);
    setIncidentDate(formattedDate);
    setIncidentTime(formattedTime);
    setIsConfirmDialogOpen(false);
    setReportId("");
  };
  
  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold text-titeh-primary mb-2">Incident Reporting</h1>
        <p className="text-gray-500 mb-6">Report traffic incidents and road issues</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Report an Incident</CardTitle>
                <CardDescription>
                  Provide details about the traffic incident or road issue you're reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Incident Type */}
                  <div className="space-y-2">
                    <Label htmlFor="incident-type">Incident Type</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {incidentTypes.map(type => (
                        <Button
                          key={type.value}
                          type="button"
                          variant={incidentType === type.value ? "default" : "outline"}
                          className={`justify-start h-auto py-3 ${
                            incidentType === type.value ? 'bg-titeh-primary text-white' : ''
                          }`}
                          onClick={() => setIncidentType(type.value)}
                        >
                          <span className="mr-2 text-lg">{type.icon}</span>
                          <span className="text-sm">{type.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="location">Location</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={getCurrentLocation}
                        disabled={isGetLocationLoading}
                        className="h-8"
                      >
                        {isGetLocationLoading ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                            Getting Location...
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            Current Location
                          </>
                        )}
                      </Button>
                    </div>
                    <Input 
                      id="location" 
                      placeholder="Enter or use current location" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  
                  {/* Date and Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incident-date">Date</Label>
                      <div className="relative">
                        <Input 
                          id="incident-date" 
                          type="date" 
                          value={incidentDate}
                          onChange={(e) => setIncidentDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incident-time">Time</Label>
                      <div className="relative">
                        <Input 
                          id="incident-time" 
                          type="time" 
                          value={incidentTime}
                          onChange={(e) => setIncidentTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe the incident with as much detail as possible" 
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label>Add Photos (Optional)</Label>
                    
                    {/* Upload area */}
                    <div>
                      <label className="cursor-pointer block w-full">
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-1">Drag photos here or click to upload</p>
                          <p className="text-xs text-gray-400">JPEG, PNG or JPG (max 5MB)</p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handlePhotoUpload}
                            disabled={isUploading}
                          />
                        </div>
                      </label>
                      
                      {isUploading && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}
                    </div>
                    
                    {/* Photo preview */}
                    {uploadedPhotos.length > 0 && (
                      <div className="mt-4">
                        <Label className="mb-2">Uploaded Photos ({uploadedPhotos.length})</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                          {uploadedPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={photo} 
                                alt={`Incident Photo ${index + 1}`} 
                                className="h-24 w-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Submit Button */}
                  <Button 
                    className="w-full bg-titeh-primary"
                    onClick={submitReport}
                    disabled={isSubmitting || !location || !description}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Report...
                      </>
                    ) : (
                      'Submit Incident Report'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="space-y-6">
              {/* Tips and Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reporting Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-blue-100 p-2 rounded-full h-min">
                      <MapPin className="h-4 w-4 text-titeh-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Be Specific About Location</h3>
                      <p className="text-xs text-gray-600">
                        Include landmarks, cross streets, or kilometer markers when describing the location.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 p-2 rounded-full h-min">
                      <Camera className="h-4 w-4 text-titeh-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Add Clear Photos</h3>
                      <p className="text-xs text-gray-600">
                        Photos help authorities understand the situation better and respond appropriately.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 p-2 rounded-full h-min">
                      <Clock className="h-4 w-4 text-titeh-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Report Promptly</h3>
                      <p className="text-xs text-gray-600">
                        Report incidents as soon as possible for quicker resolution.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Emergency Contact Card */}
              <Card>
                <CardHeader className="bg-red-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <CardTitle className="text-lg text-red-700">Emergency Contacts</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Police Emergency:</span>
                    <span className="text-sm font-medium">100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ambulance:</span>
                    <span className="text-sm font-medium">108</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Traffic Helpline:</span>
                    <span className="text-sm font-medium">9010203040</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Women Helpline:</span>
                    <span className="text-sm font-medium">1098</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Reports</CardTitle>
                  <CardDescription>Nearby incident reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border-l-4 border-yellow-500 pl-3 py-1">
                    <p className="text-sm font-medium">Traffic Congestion</p>
                    <p className="text-xs text-gray-500">Hitech City Junction • 15 mins ago</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-3 py-1">
                    <p className="text-sm font-medium">Vehicle Accident</p>
                    <p className="text-xs text-gray-500">Mehdipatnam • 45 mins ago</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-3 py-1">
                    <p className="text-sm font-medium">Road Damage</p>
                    <p className="text-xs text-gray-500">Secunderabad • 1 hour ago</p>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" className="text-xs text-titeh-primary">
                      View All Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Confirmation Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Incident Report Submitted
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-green-50 p-4 rounded-md mb-4">
                <p className="text-sm text-green-800">
                  Your incident report has been successfully submitted to the authorities.
                  Thank you for helping to make our roads safer.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Report ID:</span>
                  <span className="text-sm text-titeh-primary">{reportId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Date & Time:</span>
                  <span className="text-sm">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="text-sm text-green-600 font-medium">Submitted</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Submit Another Report
              </Button>
              <Button className="bg-titeh-primary">
                View Report Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default IncidentReporting;
