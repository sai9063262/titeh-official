
import { useState } from "react";
import Layout from "@/components/Layout";
import { 
  CreditCard, FileText, Gauge, Shield, Mic, Image, Map, Camera, 
  AlertTriangle, Upload, Calendar, ClipboardCheck, Clock, Search, Phone, Bookmark
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const TrafficSafety = () => {
  const [challanNumber, setChallanNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handlePayChallan = () => {
    if (!challanNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a challan number",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Challan Payment Initiated",
      description: `Processing payment for challan ${challanNumber}`,
      variant: "default",
    });
  };

  const handleReport = () => {
    toast({
      title: "Incident Report",
      description: "Your report has been submitted. Reference #TG2504",
      variant: "default",
    });
  };

  const filterItems = (items) => {
    if (!searchQuery.trim()) return items;
    return items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const safetyItems = [
    { icon: <CreditCard className="text-titeh-primary text-xl" />, label: "Pay Challan", link: "/traffic-safety/pay-challan", badge: "Popular" },
    { icon: <FileText className="text-titeh-primary text-xl" />, label: "Incident Reporting", link: "/traffic-safety/incident" },
    { icon: <Gauge className="text-titeh-primary text-xl" />, label: "Speedometer & Black Spot Alerts", link: "/traffic-safety/alerts", badge: "New" },
    { icon: <Shield className="text-titeh-primary text-xl" />, label: "T-Safe Monitoring", link: "/traffic-safety/monitoring" },
    { icon: <Mic className="text-titeh-primary text-xl" />, label: "Voice/Mobile Complaint", link: "/traffic-safety/complaint" },
    { icon: <Image className="text-titeh-primary text-xl" />, label: "Driver Document Display", link: "/traffic-safety/documents" },
    { icon: <Map className="text-titeh-primary text-xl" />, label: "Black Spot Map", link: "/traffic-safety/black-spots" },
    { icon: <Camera className="text-titeh-primary text-xl" />, label: "Traffic Camera Feed", link: "/traffic-safety/cameras", badge: "Live" },
  ];

  const filteredItems = filterItems(safetyItems);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-titeh-primary">Traffic Enforcement & Safety</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              className="pl-10"
              placeholder="Search features..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <CreditCard className="text-titeh-primary mr-2" size={16} />
                Quick Pay Challan
              </h3>
              <div className="flex flex-col gap-2">
                <Input 
                  placeholder="Enter Challan Number" 
                  value={challanNumber}
                  onChange={(e) => setChallanNumber(e.target.value)}
                />
                <Button onClick={handlePayChallan} className="bg-titeh-primary hover:bg-blue-600 w-full">
                  Pay Now
                </Button>
                <a 
                  href="https://parivahan.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Check on Parivahan
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-50 to-amber-100">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <AlertTriangle className="text-amber-500 mr-2" size={16} />
                Report Incident
              </h3>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleReport} 
                  className="bg-amber-500 hover:bg-amber-600 w-full flex items-center justify-center"
                >
                  <Upload className="mr-2" size={16} />
                  Report Now
                </Button>
                <a 
                  href="https://transport.telangana.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-amber-600 hover:underline"
                >
                  Telangana Transport Guidelines
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Features */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Features</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredItems.map((item, index) => (
              <Link to={item.link} key={index}>
                <Card className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 w-8">{item.icon}</div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge 
                        className={`${
                          item.badge === 'Popular' ? 'bg-blue-500' : 
                          item.badge === 'New' ? 'bg-green-500' : 
                          item.badge === 'Live' ? 'bg-red-500' : 'bg-gray-500'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </TabsContent>
          
          <TabsContent value="popular" className="space-y-4">
            {filterItems(safetyItems.filter(item => item.badge === 'Popular')).map((item, index) => (
              <Link to={item.link} key={index}>
                <Card className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 w-8">{item.icon}</div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && <Badge className="bg-blue-500">{item.badge}</Badge>}
                  </div>
                </Card>
              </Link>
            ))}
          </TabsContent>
          
          <TabsContent value="new" className="space-y-4">
            {filterItems(safetyItems.filter(item => item.badge === 'New')).map((item, index) => (
              <Link to={item.link} key={index}>
                <Card className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 w-8">{item.icon}</div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && <Badge className="bg-green-500">{item.badge}</Badge>}
                  </div>
                </Card>
              </Link>
            ))}
          </TabsContent>
        </Tabs>
        
        {/* Emergency Section */}
        <Card className="p-4 bg-red-50 mb-6">
          <div className="flex items-center mb-2">
            <Phone className="text-red-500 mr-2" />
            <h3 className="font-semibold">Emergency Contacts</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Traffic Police</span>
              <span className="font-medium">100</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ambulance</span>
              <span className="font-medium">108</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Fire</span>
              <span className="font-medium">101</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Women Helpline</span>
              <span className="font-medium">1098</span>
            </div>
          </div>
        </Card>

        {/* Quick Resources */}
        <Card className="p-4 bg-blue-50 mb-6">
          <div className="flex items-center mb-2">
            <Bookmark className="text-titeh-primary mr-2" />
            <h3 className="font-semibold">Quick Resources</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <a 
              href="https://www.nhtsa.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-2 bg-white rounded hover:bg-gray-50"
            >
              <Shield className="text-titeh-primary mr-2" size={14} />
              <span>NHTSA Safety Tips</span>
            </a>
            
            <a 
              href="https://parivahan.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-2 bg-white rounded hover:bg-gray-50"
            >
              <CreditCard className="text-titeh-primary mr-2" size={14} />
              <span>Parivahan Challan Payment</span>
            </a>
            
            <a 
              href="https://transport.telangana.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-2 bg-white rounded hover:bg-gray-50"
            >
              <ClipboardCheck className="text-titeh-primary mr-2" size={14} />
              <span>Telangana Transport</span>
            </a>
            
            <a 
              href="https://www.tspolice.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-2 bg-white rounded hover:bg-gray-50"
            >
              <Mic className="text-titeh-primary mr-2" size={14} />
              <span>TS Police Complaints</span>
            </a>
          </div>
        </Card>
        
        {/* Future Enhancements Section */}
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center mb-2">
            <Calendar className="text-gray-500 mr-2" />
            <h3 className="font-semibold">Coming Soon (Q3 2025)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <AlertTriangle className="text-amber-500 mr-2 flex-shrink-0" size={16} />
              <p className="text-sm text-gray-600">AI traffic prediction with real-time congestion alerts</p>
            </div>
            <div className="flex items-center">
              <FileText className="text-amber-500 mr-2 flex-shrink-0" size={16} />
              <p className="text-sm text-gray-600">Digital FIR filing with instant acknowledgment</p>
            </div>
            <a 
              href="https://www.nhtsa.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline md:col-span-2"
            >
              Learn more about upcoming traffic safety technologies
            </a>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default TrafficSafety;
