
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Calendar, Phone, Search, Car, ArrowRight, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const VehicleRecalls = () => {
  const { toast } = useToast();
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [recalls, setRecalls] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMake, setFilterMake] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [notifiedVehicles, setNotifiedVehicles] = useState<string[]>([]);
  
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
            description: "We'll provide recall information relevant to your area.",
          });
          fetchRecallData();
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission(false);
          toast({
            title: "Location access denied",
            description: "We'll show general recall information.",
            variant: "destructive",
          });
          // Load data anyway
          fetchRecallData();
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
      fetchRecallData();
    }
  };

  // Fetch recall data from Supabase
  const fetchRecallData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicle_recalls')
        .select('*')
        .order('recall_date', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setRecalls(data);
      } else {
        // If no data, create mock data for demonstration
        const mockData = generateMockRecallData();
        setRecalls(mockData);
      }
    } catch (error) {
      console.error("Error fetching recall data:", error);
      const mockData = generateMockRecallData();
      setRecalls(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock recall data for demonstration
  const generateMockRecallData = () => {
    const manufacturers = [
      'Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Toyota', 
      'Honda', 'Kia', 'MG', 'Ford', 'Renault'
    ];
    
    const models = {
      'Maruti Suzuki': ['Swift', 'Baleno', 'Dzire', 'Ertiga', 'WagonR'],
      'Hyundai': ['i10', 'i20', 'Creta', 'Venue', 'Verna'],
      'Tata Motors': ['Nexon', 'Tiago', 'Harrier', 'Safari', 'Altroz'],
      'Mahindra': ['XUV700', 'Thar', 'Scorpio', 'XUV300', 'Bolero'],
      'Toyota': ['Innova', 'Fortuner', 'Glanza', 'Urban Cruiser', 'Camry'],
      'Honda': ['City', 'Amaze', 'WR-V', 'Jazz', 'Civic'],
      'Kia': ['Seltos', 'Sonet', 'Carnival', 'Carens'],
      'MG': ['Hector', 'Astor', 'ZS EV', 'Gloster'],
      'Ford': ['EcoSport', 'Figo', 'Aspire', 'Endeavour'],
      'Renault': ['Kwid', 'Triber', 'Kiger', 'Duster']
    };
    
    const reasons = [
      'Faulty airbag deployment system',
      'Brake system malfunction',
      'Fuel pump issues causing engine stalling',
      'Electrical system short circuit risk',
      'Steering column control failure',
      'Seat belt pretensioner malfunction',
      'Engine cooling system leakage',
      'Transmission system software error',
      'Battery management system fault',
      'Suspension component failure'
    ];

    const mockData = [];
    const today = new Date();
    
    for (let i = 0; i < 15; i++) {
      const recallDate = new Date(today);
      recallDate.setDate(recallDate.getDate() - Math.floor(Math.random() * 60));
      
      const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
      const model = models[manufacturer][Math.floor(Math.random() * models[manufacturer].length)];
      const yearFrom = 2015 + Math.floor(Math.random() * 7);
      const yearTo = yearFrom + Math.floor(Math.random() * 3);
      
      mockData.push({
        id: `mock-${i}`,
        manufacturer,
        model,
        year_from: yearFrom,
        year_to: yearTo,
        recall_reason: reasons[Math.floor(Math.random() * reasons.length)],
        recall_date: recallDate.toISOString().split('T')[0],
        affected_parts: ['Engine', 'Brakes', 'Electrical', 'Fuel System', 'Steering']
          .slice(0, Math.floor(Math.random() * 3) + 1),
        recommended_action: "Visit your nearest authorized service center for a free inspection and repair",
        contact_info: `${manufacturer} Customer Care: 1800-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        city: ['Warangal', 'Hyderabad', 'Secunderabad', 'Hanamkonda', 'Khammam', 'All Cities'][Math.floor(Math.random() * 6)],
        district: 'Telangana'
      });
    }
    
    return mockData;
  };

  useEffect(() => {
    if (locationPermission === null) {
      requestLocationPermission();
    }
  }, []);

  // Filter recalls based on search query and make filter
  const filteredRecalls = recalls.filter(recall => {
    const matchesSearch = searchQuery === "" || 
      recall.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recall.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recall.recall_reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMake = filterMake === "" || recall.manufacturer === filterMake;
    
    return matchesSearch && matchesMake;
  });

  // Get unique manufacturers for filter
  const uniqueManufacturers = [...new Set(recalls.map(recall => recall.manufacturer))];

  // Mark a vehicle as notified
  const markAsNotified = (recallId: string) => {
    setNotifiedVehicles(prev => [...prev, recallId]);
    toast({
      title: "Notification saved",
      description: "You'll be reminded about this recall",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-titeh-primary">Vehicle Recall Alerts</h1>
        <p className="text-gray-600">Stay informed about safety recalls affecting vehicles in Telangana</p>
        
        {!locationPermission && locationPermission !== null && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Location access recommended</h3>
                  <p className="text-sm text-amber-700 mb-3">
                    To provide recall information relevant to your area, we recommend allowing location access.
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
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Latest Vehicle Recalls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search recalls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select
                value={filterMake}
                onValueChange={setFilterMake}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Manufacturers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Manufacturers</SelectItem>
                  {uniqueManufacturers.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner mb-4"></div>
                <p className="text-gray-500">Loading recall information...</p>
              </div>
            ) : filteredRecalls.length > 0 ? (
              <div className="space-y-4">
                {filteredRecalls.map((recall) => (
                  <Card key={recall.id} className="p-4 hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <Car className="h-5 w-5 text-titeh-primary mr-2" />
                          <h3 className="font-medium">
                            {recall.manufacturer} {recall.model} ({recall.year_from}
                            {recall.year_to > recall.year_from ? `-${recall.year_to}` : ''})
                          </h3>
                          {recall.city && recall.city !== 'All Cities' && (
                            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs">
                              {recall.city}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm mb-2 text-red-700">{recall.recall_reason}</p>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mb-2">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Recall Date: {new Date(recall.recall_date).toLocaleDateString('en-IN')}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{recall.contact_info?.substring(0, 30)}...</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {recall.affected_parts && recall.affected_parts.map((part, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {part}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {notifiedVehicles.includes(recall.id) ? (
                            <Button size="sm" variant="outline" className="border-green-200 bg-green-50 text-green-700" disabled>
                              Notification Saved
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => markAsNotified(recall.id)}
                              className="bg-titeh-primary"
                            >
                              Notify Me
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No recalls found matching your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About Vehicle Recalls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Vehicle recalls are issued when a manufacturer or the government determines that a vehicle model 
              has a safety-related defect or does not comply with a federal safety standard. Vehicle recalls 
              are serious safety matters that should be addressed promptly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card className="p-3">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">Why Are Recalls Important?</h3>
                    <p className="text-xs text-gray-600">
                      Recalls address safety defects that could cause accidents, injuries, or fatalities.
                      Addressing recalls promptly keeps you and others safe on the road.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full mt-1">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">What Should You Do?</h3>
                    <p className="text-xs text-gray-600">
                      If your vehicle is affected by a recall, contact the manufacturer immediately.
                      Repairs for safety recalls are usually free of charge at authorized service centers.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => window.open("https://vahan.parivahan.gov.in/vahan/", "_blank")}>
              Check Your Vehicle Registration Details
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VehicleRecalls;
