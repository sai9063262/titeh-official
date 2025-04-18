
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Upload, 
  Clock, 
  ThumbsUp, 
  Filter, 
  Search, 
  X,
  ArrowUp,
  SlidersHorizontal,
  Image
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface RoadCondition {
  id: string;
  condition_type: string;
  description: string;
  location: string;
  reported_at: string;
  image_url?: string;
  upvotes: number;
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
  user_id: string;
}

const RoadCondition = () => {
  const { toast } = useToast();
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [roadConditions, setRoadConditions] = useState<RoadCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [votedConditions, setVotedConditions] = useState<string[]>([]);
  
  // New report form state
  const [newReport, setNewReport] = useState({
    conditionType: "",
    location: "",
    description: "",
    image: null as File | null,
    imagePreview: ""
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // Request location permission
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          toast({
            title: "Location access granted",
            description: "We'll show road conditions near you.",
          });
          fetchRoadConditions();
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission(false);
          toast({
            title: "Location access denied",
            description: "We'll show general road conditions.",
            variant: "destructive",
          });
          fetchRoadConditions();
        }
      );
    } else {
      setLocationPermission(false);
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      fetchRoadConditions();
    }
  };

  // Fetch road conditions from Supabase
  const fetchRoadConditions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('road_conditions')
        .select('*')
        .order('reported_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setRoadConditions(data);
      } else {
        // If no data, create mock data for demonstration
        const mockData = generateMockRoadConditions();
        setRoadConditions(mockData);
      }
    } catch (error) {
      console.error("Error fetching road conditions:", error);
      const mockData = generateMockRoadConditions();
      setRoadConditions(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock road condition data for demonstration
  const generateMockRoadConditions = () => {
    const conditionTypes = [
      'Pothole', 
      'Waterlogging', 
      'Road Crack', 
      'Fallen Tree', 
      'Broken Divider',
      'Damaged Signal',
      'Missing Manhole Cover',
      'Construction'
    ];
    
    const locations = [
      'Hanamkonda Main Road',
      'Kazipet Highway Junction',
      'Warangal Bus Stand Road',
      'Hunter Road',
      'Subedari Main Road',
      'Pochamma Maidan Area',
      'Hanumakonda Circle',
      'Waddepally Road',
      'Balasamudram Junction',
      'Nayeem Nagar X Roads'
    ];
    
    const mockData = [];
    const now = new Date();
    
    for (let i = 0; i < 15; i++) {
      const reportedAt = new Date(now);
      reportedAt.setHours(reportedAt.getHours() - Math.floor(Math.random() * 24 * 7)); // Within last week
      
      const conditionType = conditionTypes[Math.floor(Math.random() * conditionTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      mockData.push({
        id: `mock-${i}`,
        condition_type: conditionType,
        description: `${conditionType} causing traffic slowdown. ${Math.random() > 0.5 ? 'Needs immediate attention.' : 'Vehicles need to be careful while passing.'}`,
        location,
        reported_at: reportedAt.toISOString(),
        image_url: Math.random() > 0.3 ? `https://placehold.co/400x300/gray/white?text=${conditionType.replace(' ', '+')}` : undefined,
        upvotes: Math.floor(Math.random() * 50),
        latitude: 17.9689 + (Math.random() - 0.5) * 0.05, // Around Warangal
        longitude: 79.5941 + (Math.random() - 0.5) * 0.05,
        city: Math.random() > 0.5 ? 'Warangal' : 'Hanamkonda',
        district: 'Warangal',
        user_id: 'mockuser'
      });
    }
    
    return mockData;
  };

  useEffect(() => {
    // Load voted conditions from local storage
    const savedVotedConditions = localStorage.getItem('votedRoadConditions');
    if (savedVotedConditions) {
      setVotedConditions(JSON.parse(savedVotedConditions));
    }
    
    if (locationPermission === null) {
      requestLocationPermission();
    }
  }, []);

  // Filter road conditions based on search query and type filter
  const filteredConditions = roadConditions.filter(condition => {
    const matchesSearch = searchQuery === "" || 
      condition.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      condition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      condition.condition_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "" || condition.condition_type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Get unique condition types for filter
  const uniqueConditionTypes = [...new Set(roadConditions.map(condition => condition.condition_type))];

  // Upvote a road condition
  const upvoteCondition = (conditionId: string) => {
    if (votedConditions.includes(conditionId)) return;
    
    // Update local state
    setRoadConditions(prev => 
      prev.map(condition => 
        condition.id === conditionId 
          ? { ...condition, upvotes: condition.upvotes + 1 } 
          : condition
      )
    );
    
    // Save to voted conditions
    const updatedVotedConditions = [...votedConditions, conditionId];
    setVotedConditions(updatedVotedConditions);
    localStorage.setItem('votedRoadConditions', JSON.stringify(updatedVotedConditions));
    
    // In a real app, we would update the database here
    toast({
      title: "Vote recorded",
      description: "Thank you for confirming this road condition.",
    });
  };

  // Open the report dialog
  const openReportDialog = () => {
    if (!locationPermission) {
      toast({
        title: "Location required",
        description: "Please allow location access to report road conditions.",
        variant: "destructive",
      });
      requestLocationPermission();
      return;
    }
    
    setIsReportDialogOpen(true);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setNewReport({
        ...newReport,
        image: file,
        imagePreview: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle camera capture
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setNewReport({
        ...newReport,
        image: file,
        imagePreview: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  // Submit a new road condition report
  const submitReport = () => {
    if (!newReport.conditionType || !newReport.location || !newReport.description) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would upload the image to storage and save to the database
    
    // Create a new road condition record
    const newCondition: RoadCondition = {
      id: `new-${Date.now()}`,
      condition_type: newReport.conditionType,
      description: newReport.description,
      location: newReport.location,
      reported_at: new Date().toISOString(),
      image_url: newReport.imagePreview || undefined,
      upvotes: 0,
      latitude: userLocation?.latitude || 17.9689,
      longitude: userLocation?.longitude || 79.5941,
      city: "Warangal",
      district: "Warangal",
      user_id: 'currentuser'
    };
    
    // Update state
    setRoadConditions(prev => [newCondition, ...prev]);
    
    // Reset form and close dialog
    setNewReport({
      conditionType: "",
      location: "",
      description: "",
      image: null,
      imagePreview: ""
    });
    setIsReportDialogOpen(false);
    
    toast({
      title: "Report submitted",
      description: "Thank you for reporting this road condition!",
    });
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-IN');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-titeh-primary">Road Condition Reports</h1>
            <p className="text-gray-600">Real-time road hazard information updated hourly</p>
          </div>
          <Button onClick={openReportDialog} className="bg-titeh-primary">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Report Issue
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
                    To see road conditions near you and report issues accurately, we need your location.
                  </p>
                  <Button onClick={requestLocationPermission} className="bg-amber-600 hover:bg-amber-700">
                    Allow Location Access
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Road Conditions</span>
              <span className="text-sm font-normal text-gray-500">
                Updated hourly
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search road conditions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select
                value={filterType}
                onValueChange={setFilterType}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {uniqueConditionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner mb-4"></div>
                <p className="text-gray-500">Loading road conditions...</p>
              </div>
            ) : filteredConditions.length > 0 ? (
              <div className="space-y-4">
                {filteredConditions.map((condition) => (
                  <Card key={condition.id} className="p-4 hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row gap-4">
                      {condition.image_url && (
                        <div className="w-full md:w-1/4 lg:w-1/5">
                          <img 
                            src={condition.image_url} 
                            alt={condition.condition_type}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div className={`flex-1 ${!condition.image_url ? 'md:pl-0' : ''}`}>
                        <div className="flex items-center mb-1">
                          <div 
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              condition.condition_type === 'Pothole' ? 'bg-red-100 text-red-800' : 
                              condition.condition_type === 'Waterlogging' ? 'bg-blue-100 text-blue-800' :
                              condition.condition_type === 'Road Crack' ? 'bg-amber-100 text-amber-800' :
                              condition.condition_type === 'Fallen Tree' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {condition.condition_type}
                          </div>
                          <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
                          <span className="text-xs text-gray-500">
                            {formatDate(condition.reported_at)}
                          </span>
                          {condition.city && (
                            <>
                              <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {condition.city}
                              </div>
                            </>
                          )}
                        </div>
                        
                        <h3 className="font-medium mb-1">{condition.location}</h3>
                        <p className="text-sm text-gray-600 mb-3">{condition.description}</p>
                        
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => upvoteCondition(condition.id)}
                            disabled={votedConditions.includes(condition.id)}
                            className={votedConditions.includes(condition.id) ? "text-green-600 border-green-200" : ""}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Confirm {condition.upvotes > 0 && `(${condition.upvotes})`}
                          </Button>
                          
                          <Button variant="outline" size="sm" className="ml-2">
                            View on Map
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No road conditions found matching your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Report Dialog */}
      {isReportDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Report Road Condition</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => setIsReportDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition Type *
                  </label>
                  <Select
                    value={newReport.conditionType}
                    onValueChange={(value) => setNewReport({...newReport, conditionType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pothole">Pothole</SelectItem>
                      <SelectItem value="Waterlogging">Waterlogging</SelectItem>
                      <SelectItem value="Road Crack">Road Crack</SelectItem>
                      <SelectItem value="Fallen Tree">Fallen Tree</SelectItem>
                      <SelectItem value="Broken Divider">Broken Divider</SelectItem>
                      <SelectItem value="Damaged Signal">Damaged Signal</SelectItem>
                      <SelectItem value="Missing Manhole Cover">Missing Manhole Cover</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <Input
                    placeholder="Enter precise location"
                    value={newReport.location}
                    onChange={(e) => setNewReport({...newReport, location: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {userLocation 
                      ? `Your current location has been detected: Near ${Math.round(userLocation.latitude * 10000) / 10000}, ${Math.round(userLocation.longitude * 10000) / 10000}` 
                      : 'Enable location for more accurate reporting'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <Textarea
                    placeholder="Describe the issue in detail"
                    value={newReport.description}
                    onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo (Optional)
                  </label>
                  
                  {newReport.imagePreview ? (
                    <div className="relative">
                      <img 
                        src={newReport.imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-md mb-2"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80"
                        onClick={() => setNewReport({...newReport, image: null, imagePreview: ""})}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => cameraInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      
                      <input 
                        type="file" 
                        ref={cameraInputRef}
                        className="hidden" 
                        accept="image/*" 
                        capture="environment"
                        onChange={handleCameraCapture}
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-2 pt-2 border-t">
                  <Button 
                    className="w-full bg-titeh-primary"
                    onClick={submitReport}
                  >
                    Submit Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default RoadCondition;
