
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  CreditCard,
  AlertTriangle,
  Camera,
  MapPin,
  UserCheck,
  MessageSquare,
  Map,
  Bell,
  ShieldCheck,
  FileText,
  Gauge,
  CircleDashed
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const TrafficSafety = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const showComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available shortly",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold text-titeh-primary mb-2">Traffic Safety & Enforcement</h1>
        <p className="text-gray-500 mb-6">Monitor and manage traffic safety features</p>
        
        {/* Featured Services */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/traffic-safety/pay-challan">
            <Card className="h-full hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <CreditCard className="h-6 w-6 text-titeh-primary" />
                </div>
                <h3 className="font-medium text-center">Pay e-Challan</h3>
                <p className="text-xs text-gray-500 text-center mt-1">Pay your traffic violation challan online</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/traffic-safety/incident-reporting">
            <Card className="h-full hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-medium text-center">Incident Reporting</h3>
                <p className="text-xs text-gray-500 text-center mt-1">Report accidents and traffic issues</p>
                <span className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Popular
                </span>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/traffic-safety/driver-verification">
            <Card className="h-full hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-center">Driver Verification</h3>
                <p className="text-xs text-gray-500 text-center mt-1">Verify driver identity and documents</p>
                <span className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  New
                </span>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/traffic-safety/camera-feed">
            <Card className="h-full hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                <div className="bg-yellow-100 p-4 rounded-full mb-4">
                  <Camera className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-medium text-center">Camera Feed</h3>
                <p className="text-xs text-gray-500 text-center mt-1">View live traffic camera feeds</p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        {/* All Services */}
        <h2 className="text-lg font-semibold mb-4">All Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {/* Already linked services */}
          <Link to="/traffic-safety/pay-challan" className="block">
            <div className="border rounded-lg p-4 flex flex-col items-center hover:border-titeh-primary hover:shadow-sm transition-all h-full">
              <CreditCard className="h-5 w-5 text-titeh-primary mb-2" />
              <span className="text-sm text-center">Pay e-Challan</span>
            </div>
          </Link>
          
          <Link to="/traffic-safety/incident-reporting" className="block">
            <div className="border rounded-lg p-4 flex flex-col items-center hover:border-titeh-primary hover:shadow-sm transition-all h-full">
              <AlertTriangle className="h-5 w-5 text-titeh-primary mb-2" />
              <span className="text-sm text-center">Incident Reporting</span>
            </div>
          </Link>
          
          <Link to="/traffic-safety/driver-verification" className="block">
            <div className="border rounded-lg p-4 flex flex-col items-center hover:border-titeh-primary hover:shadow-sm transition-all h-full">
              <UserCheck className="h-5 w-5 text-titeh-primary mb-2" />
              <span className="text-sm text-center">Driver Verification</span>
            </div>
          </Link>
          
          <Link to="/traffic-safety/camera-feed" className="block">
            <div className="border rounded-lg p-4 flex flex-col items-center hover:border-titeh-primary hover:shadow-sm transition-all h-full">
              <Camera className="h-5 w-5 text-titeh-primary mb-2" />
              <span className="text-sm text-center">Camera Feed</span>
            </div>
          </Link>
          
          {/* Coming soon services */}
          <Button 
            variant="ghost" 
            className="block border rounded-lg p-4 h-full w-full"
            onClick={showComingSoon}
          >
            <div className="flex flex-col items-center w-full">
              <MessageSquare className="h-5 w-5 text-titeh-primary mb-2" />
              <span className="text-sm text-center">Voice/Mobile Complaint</span>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            className="block border rounded-lg p-4 h-full w-full"
            onClick={showComingSoon}
          >
            <div className="flex flex-col items-center w-full">
              <Map className="h-5 w-5 text-titeh-primary mb-2" />
              <span className="text-sm text-center">Black Spot Map</span>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            className="block border rounded-lg p-4 h-full w-full"
            onClick={showComingSoon}
          >
            <div className="flex flex-col items-center w-full">
              <Bell className="h-5 w-5 text-titeh-primary mb-2" />
              <span className="text-sm text-center">T-Safe Monitoring</span>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            className="block border rounded-lg p-4 h-full w-full"
            onClick={showComingSoon}
          >
            <div className="flex flex-col items-center w-full">
              <FileText className="h-5 w-5 text-titeh-primary mb-2" />
              <span className="text-sm text-center">Document Display</span>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            className="block border rounded-lg p-4 h-full w-full"
            onClick={showComingSoon}
          >
            <div className="flex flex-col items-center w-full">
              <Gauge className="h-5 w-5 text-titeh-primary mb-2" />
              <span className="text-sm text-center">Speedometer Alerts</span>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            className="block border rounded-lg p-4 h-full w-full"
            onClick={showComingSoon}
          >
            <div className="flex flex-col items-center w-full">
              <MapPin className="h-5 w-5 text-titeh-primary mb-2" />
              <span className="text-sm text-center">No Parking Zones</span>
            </div>
          </Button>
        </div>
        
        {/* Statistics */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Safety Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total e-Challans</p>
                    <p className="text-2xl font-semibold">3,456</p>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-md">
                    <CreditCard className="h-5 w-5 text-titeh-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Cameras</p>
                    <p className="text-2xl font-semibold">427</p>
                    <p className="text-xs text-green-600">+5 new added</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-md">
                    <Camera className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Traffic Incidents</p>
                    <p className="text-2xl font-semibold">85</p>
                    <p className="text-xs text-red-600">+3% from last month</p>
                  </div>
                  <div className="bg-red-100 p-2 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Verified Drivers</p>
                    <p className="text-2xl font-semibold">12,589</p>
                    <p className="text-xs text-green-600">+8% from last month</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-md">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="bg-titeh-primary/10 p-2 rounded-full">
                <ShieldCheck className="h-5 w-5 text-titeh-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Traffic Rules Handbook</h3>
                <p className="text-xs text-gray-500">Latest traffic regulations and penalties</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="bg-titeh-primary/10 p-2 rounded-full">
                <CircleDashed className="h-5 w-5 text-titeh-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Helmet Awareness Program</h3>
                <p className="text-xs text-gray-500">Campaign to promote helmet usage</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="bg-titeh-primary/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-titeh-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Safe Driving Guidelines</h3>
                <p className="text-xs text-gray-500">Tips for safe and responsible driving</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrafficSafety;
