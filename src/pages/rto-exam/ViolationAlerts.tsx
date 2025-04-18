import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Check as CircleCheck, 
  Search, 
  Calendar, 
  Car, 
  FileText, 
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Violation {
  id: string;
  vehicle_number: string;
  violation_type: string;
  location: string;
  date: string;
  time: string;
  fine_amount: number;
  status: "paid" | "unpaid" | "disputed";
  image_url?: string;
  officer_notes?: string;
  payment_deadline?: string;
}

const ViolationAlerts = () => {
  const { toast } = useToast();
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [vehicleNumbers, setVehicleNumbers] = useState<string[]>([
    "TS07FX1234",
    "TS09AB5678",
    "AP28CD9012"
  ]);
  const [selectedVehicle, setSelectedVehicle] = useState("all");

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    setLoading(true);
    try {
      // In a real app, we would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('traffic_violations')
      //   .select('*')
      //   .order('date', { ascending: false });
      
      // if (error) throw error;
      // if (data) setViolations(data);

      // For demo, use mock data
      setTimeout(() => {
        const mockData = generateMockViolations();
        setViolations(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching violations:", error);
      toast({
        title: "Error",
        description: "Failed to load violation data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const generateMockViolations = (): Violation[] => {
    const violationTypes = [
      "Speeding",
      "Red Light",
      "No Parking",
      "No Helmet",
      "Wrong Side Driving",
      "No Seatbelt",
      "Using Mobile While Driving",
      "Driving Without License",
      "Expired Registration"
    ];
    
    const locations = [
      "Hanamkonda Main Road",
      "Kazipet Highway Junction",
      "Warangal Bus Stand Road",
      "Hunter Road",
      "Subedari Main Road"
    ];
    
    const mockData: Violation[] = [];
    
    // Generate random violations for each vehicle
    vehicleNumbers.forEach(vehicle => {
      const count = Math.floor(Math.random() * 3) + 1; // 1-3 violations per vehicle
      
      for (let i = 0; i < count; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Within last 60 days
        
        const violationType = violationTypes[Math.floor(Math.random() * violationTypes.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        // Calculate fine based on violation type
        let fineAmount = 0;
        switch (violationType) {
          case "Speeding":
            fineAmount = 1000;
            break;
          case "Red Light":
            fineAmount = 1500;
            break;
          case "No Parking":
            fineAmount = 500;
            break;
          case "No Helmet":
            fineAmount = 1000;
            break;
          case "Wrong Side Driving":
            fineAmount = 1500;
            break;
          case "No Seatbelt":
            fineAmount = 1000;
            break;
          case "Using Mobile While Driving":
            fineAmount = 1500;
            break;
          case "Driving Without License":
            fineAmount = 2000;
            break;
          case "Expired Registration":
            fineAmount = 2000;
            break;
          default:
            fineAmount = 500;
        }
        
        // Random status with higher probability of unpaid
        const statusRandom = Math.random();
        let status: "paid" | "unpaid" | "disputed";
        if (statusRandom < 0.6) {
          status = "unpaid";
        } else if (statusRandom < 0.9) {
          status = "paid";
        } else {
          status = "disputed";
        }
        
        // Payment deadline for unpaid violations
        let paymentDeadline = undefined;
        if (status === "unpaid") {
          const deadlineDate = new Date(date);
          deadlineDate.setDate(deadlineDate.getDate() + 30);
          paymentDeadline = deadlineDate.toISOString().split('T')[0];
        }
        
        mockData.push({
          id: `vio-${Date.now()}-${i}-${vehicle}`,
          vehicle_number: vehicle,
          violation_type: violationType,
          location,
          date: date.toISOString().split('T')[0],
          time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          fine_amount: fineAmount,
          status,
          image_url: Math.random() > 0.3 ? `https://placehold.co/400x300/gray/white?text=${violationType.replace(' ', '+')}` : undefined,
          officer_notes: Math.random() > 0.7 ? "Vehicle was observed violating traffic rules. Digital evidence recorded." : undefined,
          payment_deadline: paymentDeadline
        });
      }
    });
    
    // Sort by date, most recent first
    return mockData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredViolations = violations.filter(violation => {
    const matchesSearch = searchQuery === "" || 
      violation.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.violation_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || violation.status === filterStatus;
    const matchesType = filterType === "all" || violation.violation_type === filterType;
    const matchesVehicle = selectedVehicle === "all" || violation.vehicle_number === selectedVehicle;
    
    return matchesSearch && matchesStatus && matchesType && matchesVehicle;
  });

  const uniqueViolationTypes = [...new Set(violations.map(v => v.violation_type))];

  const handlePayNow = (violation: Violation) => {
    setSelectedViolation(violation);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (!selectedViolation) return;
    
    // Update the violation status to paid
    setViolations(prev => 
      prev.map(v => 
        v.id === selectedViolation.id 
          ? { ...v, status: "paid" } 
          : v
      )
    );
    
    setShowPaymentModal(false);
    
    toast({
      title: "Payment Successful",
      description: `Payment of ₹${selectedViolation.fine_amount} processed successfully.`,
      variant: "default",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "disputed":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isPaymentOverdue = (violation: Violation) => {
    if (violation.status !== "unpaid" || !violation.payment_deadline) return false;
    
    const deadline = new Date(violation.payment_deadline);
    const today = new Date();
    
    return today > deadline;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-titeh-primary">Traffic Violation Alerts</h1>
        <p className="text-gray-600">View and manage traffic violations for your registered vehicles</p>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Traffic Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search violations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  value={selectedVehicle}
                  onValueChange={setSelectedVehicle}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Vehicles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicles</SelectItem>
                    {vehicleNumbers.map((vehicle) => (
                      <SelectItem key={vehicle} value={vehicle}>
                        {vehicle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filterType}
                  onValueChange={setFilterType}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueViolationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner mb-4"></div>
                <p className="text-gray-500">Loading violation data...</p>
              </div>
            ) : filteredViolations.length > 0 ? (
              <div className="space-y-4">
                {filteredViolations.map((violation) => (
                  <Card key={violation.id} className="p-4 hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row gap-4">
                      {violation.image_url && (
                        <div className="w-full md:w-1/4 lg:w-1/5">
                          <img 
                            src={violation.image_url} 
                            alt={violation.violation_type}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div className={`flex-1 ${!violation.image_url ? 'md:pl-0' : ''}`}>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <div 
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              violation.violation_type === 'Speeding' ? 'bg-red-100 text-red-800' : 
                              violation.violation_type === 'Red Light' ? 'bg-red-100 text-red-800' :
                              violation.violation_type === 'No Parking' ? 'bg-blue-100 text-blue-800' :
                              violation.violation_type === 'No Helmet' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {violation.violation_type}
                          </div>
                          
                          <div 
                            className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(violation.status)}`}
                          >
                            {violation.status.charAt(0).toUpperCase() + violation.status.slice(1)}
                          </div>
                          
                          {isPaymentOverdue(violation) && (
                            <div className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Overdue
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-medium mb-1">Vehicle: {violation.vehicle_number}</h3>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{violation.date} at {violation.time}</span>
                          </div>
                          <div className="flex items-center">
                            <Car className="h-3 w-3 mr-1" />
                            <span>{violation.location}</span>
                          </div>
                          {violation.payment_deadline && violation.status === "unpaid" && (
                            <div className="flex items-center text-red-600">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Due by: {violation.payment_deadline}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold">
                            ₹{violation.fine_amount.toLocaleString()}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <FileText className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            
                            {violation.status === "unpaid" && (
                              <Button 
                                size="sm" 
                                className="bg-titeh-primary"
                                onClick={() => handlePayNow(violation)}
                              >
                                Pay Now
                              </Button>
                            )}
                            
                            {violation.status === "paid" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-green-200 bg-green-50 text-green-700"
                                disabled
                              >
                                <CircleCheck className="h-3 w-3 mr-1" />
                                Paid
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No violations found matching your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About Traffic Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Traffic violations are issued when a driver breaks traffic laws. These can include speeding,
              running red lights, illegal parking, driving without proper safety equipment, and more.
              Violations typically result in fines and may affect your driving record.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card className="p-3">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">Why Pay On Time?</h3>
                    <p className="text-xs text-gray-600">
                      Unpaid violations may result in additional penalties, license suspension,
                      or vehicle registration holds. Pay on time to avoid these consequences.
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
                    <h3 className="font-medium text-sm mb-1">How to Dispute?</h3>
                    <p className="text-xs text-gray-600">
                      If you believe a violation was issued in error, you can dispute it within 15 days
                      by submitting evidence to your local RTO office or through the mParivahan app.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => window.open("https://echallan.parivahan.gov.in/", "_blank")}>
              Check Official e-Challan Portal
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && selectedViolation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Pay Traffic Violation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Violation Type:</span>
                    <span className="font-medium">{selectedViolation.violation_type}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Vehicle Number:</span>
                    <span className="font-medium">{selectedViolation.vehicle_number}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-medium">{selectedViolation.date} at {selectedViolation.time}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{selectedViolation.location}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600 font-medium">Amount Due:</span>
                    <span className="font-bold text-lg">₹{selectedViolation.fine_amount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Payment Method
                  </label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                      <SelectItem value="wallet">Mobile Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {paymentMethod === "upi" && (
                  <div className="bg-blue-50 p-4 rounded-md text-center">
                    <p className="text-sm text-blue-700 mb-2">
                      Scan the QR code or enter UPI ID to pay
                    </p>
                    <div className="bg-white p-4 rounded-md inline-block mb-2">
                      <img 
                        src="https://placehold.co/200x200/gray/white?text=QR+Code" 
                        alt="QR Code"
                        className="w-32 h-32 mx-auto"
                      />
                    </div>
                    <p className="text-xs text-blue-600">
                      UPI ID: rto.telangana@sbi
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-titeh-primary"
                    onClick={processPayment}
                  >
                    Pay ₹{selectedViolation.fine_amount.toLocaleString()}
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

export default ViolationAlerts;
