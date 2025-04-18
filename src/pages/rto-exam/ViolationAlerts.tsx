
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Bell, AlertTriangle, MapPin, Filter, Clock, X, Eye, MoreVertical, Fingerprint } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/dropdown";

interface ViolationAlert {
  id: string;
  type: string;
  location: string;
  time: string;
  details: string;
  penalty: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  status: "pending" | "paid" | "disputed" | "processing";
}

const ViolationAlerts = () => {
  const { toast } = useToast();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('trafficNotificationsEnabled');
    return saved ? JSON.parse(saved) : false;
  });
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [recentViolations, setRecentViolations] = useState<ViolationAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedViolation, setSelectedViolation] = useState<ViolationAlert | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isFingerprintVerifying, setIsFingerprintVerifying] = useState(false);
  const [fingerprintVerified, setFingerprintVerified] = useState(false);
  
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
            description: "We'll provide violations relevant to your area.",
          });
          fetchViolationData();
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission(false);
          toast({
            title: "Location access denied",
            description: "We'll show general violation information.",
            variant: "destructive",
          });
          // Load data anyway
          fetchViolationData();
        }
      );
    } else {
      setLocationPermission(false);
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      // Load data anyway
      fetchViolationData();
    }
  };

  // Toggle notifications
  const handleToggleNotifications = () => {
    const newState = !isNotificationsEnabled;
    setIsNotificationsEnabled(newState);
    localStorage.setItem('trafficNotificationsEnabled', JSON.stringify(newState));
    
    toast({
      title: newState ? "Notifications enabled" : "Notifications disabled",
      description: newState 
        ? "You will now receive alerts about potential traffic violations" 
        : "You will no longer receive traffic violation alerts",
    });

    // If enabling notifications, request location permission if not already granted
    if (newState && locationPermission === null) {
      requestLocationPermission();
    }
  };

  // Fetch violation data
  const fetchViolationData = async () => {
    setLoading(true);
    try {
      // In a real app, we would fetch from Supabase here
      // For now, we'll use mock data
      const mockViolations = generateMockViolations();
      setRecentViolations(mockViolations);
    } catch (error) {
      console.error("Error fetching violations:", error);
      const mockViolations = generateMockViolations();
      setRecentViolations(mockViolations);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock violation data
  const generateMockViolations = (): ViolationAlert[] => {
    const violationTypes = [
      { type: "Speed Limit Exceeded", details: "Recorded speed: 68 km/h in a 50 km/h zone", penalty: "₹1,000" },
      { type: "Red Light Violation", details: "Signal jumped at intersection", penalty: "₹1,500" },
      { type: "No Helmet", details: "Riding two-wheeler without helmet", penalty: "₹500" },
      { type: "Wrong Side Driving", details: "Driving against traffic flow", penalty: "₹2,000" },
      { type: "Illegal Parking", details: "Vehicle parked in no-parking zone", penalty: "₹800" },
      { type: "Using Mobile While Driving", details: "Driver using phone while vehicle in motion", penalty: "₹1,500" },
      { type: "Driving Without License", details: "Could not produce valid driving license", penalty: "₹3,000" }
    ];
    
    const locations = [
      "Hitech City Road",
      "Jubilee Hills Checkpost",
      "Mehdipatnam",
      "Begumpet Signal",
      "Tank Bund Road",
      "Charminar Area",
      "KPHB Colony",
      "Gachibowli Junction"
    ];
    
    const now = new Date();
    const mockData: ViolationAlert[] = [];
    
    for (let i = 0; i < 7; i++) {
      const violationDate = new Date(now);
      const daysAgo = i === 0 ? 0 : i === 1 ? 1 : Math.floor(Math.random() * 7) + 1;
      violationDate.setDate(violationDate.getDate() - daysAgo);
      
      const hours = violationDate.getHours();
      const minutes = violationDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
      
      const timeLabel = daysAgo === 0 
        ? `Today, ${timeString}` 
        : daysAgo === 1 
        ? `Yesterday, ${timeString}` 
        : `${daysAgo} days ago, ${timeString}`;
      
      const randomViolation = violationTypes[Math.floor(Math.random() * violationTypes.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      
      // 60% chance of having an image
      const hasImage = Math.random() < 0.6;
      
      mockData.push({
        id: `violation-${i + 1}`,
        type: randomViolation.type,
        location: randomLocation,
        time: timeLabel,
        details: randomViolation.details,
        penalty: randomViolation.penalty,
        latitude: 17.385 + (Math.random() - 0.5) * 0.1,
        longitude: 78.486 + (Math.random() - 0.5) * 0.1,
        image_url: hasImage ? `https://placehold.co/600x400/gray/white?text=Violation+Evidence+${i+1}` : undefined,
        status: ["pending", "paid", "disputed", "processing"][Math.floor(Math.random() * 4)] as any
      });
    }
    
    // Sort by time (most recent first)
    mockData.sort((a, b) => {
      const aDays = a.time.includes("Today") ? 0 : a.time.includes("Yesterday") ? 1 : parseInt(a.time.split(' ')[0]);
      const bDays = b.time.includes("Today") ? 0 : b.time.includes("Yesterday") ? 1 : parseInt(b.time.split(' ')[0]);
      return aDays - bDays;
    });
    
    return mockData;
  };

  // View violation details
  const viewViolationDetails = (violation: ViolationAlert) => {
    setSelectedViolation(violation);
    setIsDetailsDialogOpen(true);
  };

  // Initialize fingerprint verification
  const handleFingerprintVerification = () => {
    setIsFingerprintVerifying(true);
    
    // Simulate fingerprint verification process
    setTimeout(() => {
      setFingerprintVerified(true);
      
      // After fingerprint is verified, simulate completion after 1.5 seconds
      setTimeout(() => {
        setIsFingerprintVerifying(false);
        
        toast({
          title: "Identity Verified",
          description: "Your fingerprint has been successfully verified for fine payment.",
        });
      }, 1500);
    }, 2500);
  };

  // Pay fine
  const handlePayFine = () => {
    if (!selectedViolation) return;
    
    // Update the status in local state
    setRecentViolations(prev => 
      prev.map(v => v.id === selectedViolation.id ? {...v, status: "processing" as const} : v)
    );
    
    // Close the dialog
    setIsDetailsDialogOpen(false);
    setSelectedViolation(null);
    setFingerprintVerified(false);
    
    // Show toast
    toast({
      title: "Payment Processing",
      description: "Your payment for the violation fine is being processed.",
    });
  };

  useEffect(() => {
    if (locationPermission === null) {
      // Wait to request location until notifications are enabled
      if (isNotificationsEnabled) {
        requestLocationPermission();
      } else {
        // Load data anyway
        fetchViolationData();
      }
    }
  }, [isNotificationsEnabled]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-titeh-primary">Traffic Violation Alerts</h1>
          <Button 
            variant={isNotificationsEnabled ? "default" : "outline"}
            className={isNotificationsEnabled ? "bg-titeh-primary" : ""}
            onClick={handleToggleNotifications}
          >
            <Bell className="mr-2 h-4 w-4" />
            {isNotificationsEnabled ? "Notifications On" : "Notifications Off"}
          </Button>
        </div>

        {isNotificationsEnabled && !locationPermission && locationPermission !== null && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Location access recommended</h3>
                  <p className="text-sm text-amber-700 mb-3">
                    To receive violations relevant to your area, we recommend allowing location access.
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
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
              Recent Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner mb-4"></div>
                <p className="text-gray-500">Loading violation data...</p>
              </div>
            ) : recentViolations.length > 0 ? (
              <div className="space-y-4">
                {recentViolations.map((violation) => (
                  <div key={violation.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{violation.type}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{violation.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{violation.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                          {violation.penalty}
                        </span>
                        <div className="mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            violation.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                            violation.status === 'paid' ? 'bg-green-100 text-green-800' :
                            violation.status === 'disputed' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {violation.status === 'pending' ? 'Payment Pending' :
                             violation.status === 'paid' ? 'Paid' :
                             violation.status === 'disputed' ? 'Under Dispute' :
                             'Processing'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{violation.details}</p>
                    <div className="mt-3 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewViolationDetails(violation)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      {violation.status === 'pending' && (
                        <Button 
                          size="sm" 
                          className="bg-titeh-primary"
                          onClick={() => viewViolationDetails(violation)}
                        >
                          Pay Fine
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No recent violations found</p>
                <p className="text-sm text-gray-400">Stay safe on the roads!</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-medium mb-3">Alert Settings</h3>
              <div className="space-y-2">
                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Bell className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Speed Limit Alerts</p>
                        <p className="text-sm text-gray-500">Notify when exceeding speed limits</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </Card>

                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Camera className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Camera Detection Settings</p>
                        <p className="text-sm text-gray-500">Configure traffic camera alerts</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </Card>

                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Filter className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Filter Violation Types</p>
                        <p className="text-sm text-gray-500">Select which violations to track</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Traffic Violation Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              This feature uses real-time data from traffic cameras and sensors to alert you about potential traffic violations in your area. 
              Alerts are for informational purposes only and may help you avoid penalties. The system also provides educational content 
              about traffic rules to improve driving habits.
            </p>
            <Button className="mt-4" variant="outline">
              <Link to="/traffic-safety">Back to Traffic Safety</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Violation Details Dialog */}
      {isDetailsDialogOpen && selectedViolation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Violation Details</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    setSelectedViolation(null);
                    setFingerprintVerified(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedViolation.image_url && (
                  <div className="border rounded-md overflow-hidden">
                    <img 
                      src={selectedViolation.image_url} 
                      alt="Violation Evidence" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium text-lg">{selectedViolation.type}</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-sm">{selectedViolation.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="text-sm">{selectedViolation.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fine Amount</p>
                      <p className="text-sm font-medium text-red-600">{selectedViolation.penalty}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-sm">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          selectedViolation.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          selectedViolation.status === 'paid' ? 'bg-green-100 text-green-800' :
                          selectedViolation.status === 'disputed' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedViolation.status === 'pending' ? 'Payment Pending' :
                           selectedViolation.status === 'paid' ? 'Paid' :
                           selectedViolation.status === 'disputed' ? 'Under Dispute' :
                           'Processing'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Details</p>
                    <p className="text-sm">{selectedViolation.details}</p>
                  </div>
                  
                  {selectedViolation.status === 'pending' && (
                    <div className="mt-6 border-t pt-4">
                      {!fingerprintVerified ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-3">
                            To pay this fine, we need to verify your identity with fingerprint authentication.
                          </p>
                          {isFingerprintVerifying ? (
                            <div className="text-center p-6">
                              <div className="bg-blue-50 p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-3">
                                <Fingerprint className="h-8 w-8 text-blue-600 animate-pulse" />
                              </div>
                              <p className="text-sm font-medium mb-1">Verifying fingerprint...</p>
                              <p className="text-xs text-gray-500">Please wait while we authenticate your identity</p>
                            </div>
                          ) : (
                            <Button 
                              className="w-full bg-titeh-primary"
                              onClick={handleFingerprintVerification}
                            >
                              <Fingerprint className="mr-2 h-4 w-4" />
                              Verify with Fingerprint
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 text-green-600 mb-4">
                            <CircleCheck className="h-5 w-5" />
                            <p className="text-sm font-medium">Identity verified successfully</p>
                          </div>
                          <Button 
                            className="w-full bg-titeh-primary"
                            onClick={handlePayFine}
                          >
                            Proceed to Pay ₹{selectedViolation.penalty.replace('₹', '')}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default ViolationAlerts;
