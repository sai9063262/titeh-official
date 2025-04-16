import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  Car,
  CreditCard,
  FileText,
  Map,
  BookOpen,
  Shield,
  Search,
  User,
  Bell,
} from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout>
      <div className="px-4 py-8">
        {!isAuthenticated && (
          <div className="mb-8 p-6 bg-gradient-to-r from-titeh-primary to-blue-600 rounded-lg text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome to TITEH</h2>
            <p className="mb-4 text-blue-100">
              Sign in to access all features and personalize your experience.
            </p>
            <Button asChild className="bg-white text-blue-600 hover:bg-blue-50">
              <Link to="/auth">Login / Sign Up</Link>
            </Button>
          </div>
        )}
        
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">TITEH Services</h1>
        
        {/* Module Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Link to="/vehicle" className="module-tile">
            <Car className="module-icon" />
            <span className="text-sm font-medium text-center">Vehicle Management</span>
          </Link>
          
          <Link to="/rto-exam" className="module-tile">
            <School className="module-icon" />
            <span className="text-sm font-medium text-center">RTO Exam & Learning</span>
          </Link>
          
          <Link to="/traffic-safety" className="module-tile">
            <Shield className="module-icon" />
            <span className="text-sm font-medium text-center">Traffic Enforcement & Safety</span>
          </Link>
          
          <Link to="/attendance" className="module-tile">
            <User className="module-icon" />
            <span className="text-sm font-medium text-center">Attendance Tracking</span>
          </Link>
          
          <Link to="/parivahan-services" className="module-tile">
            <CreditCard className="module-icon" />
            <span className="text-sm font-medium text-center">Parivahan Services</span>
          </Link>
          
          <Link to="/settings" className="module-tile">
            <Settings className="module-icon" />
            <span className="text-sm font-medium text-center">Settings</span>
          </Link>
        </div>
        
        {/* What's New Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-titeh-primary">What's New</h2>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Version 1.2.0
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/device-settings" className="titeh-card hover:bg-gray-50 transition-colors relative">
              <div className="absolute top-2 right-2">
                <Badge className="bg-blue-500">New</Badge>
              </div>
              <div className="flex items-center mb-2">
                <Bluetooth className="text-blue-500 mr-2" />
                <h3 className="font-medium">Real Device Connectivity</h3>
              </div>
              <p className="text-sm text-gray-600">Connect to your vehicle's OBD scanner using your device's Bluetooth.</p>
            </Link>
            
            <Link to="/device-settings?tab=wifi" className="titeh-card hover:bg-gray-50 transition-colors relative">
              <div className="absolute top-2 right-2">
                <Badge className="bg-blue-500">New</Badge>
              </div>
              <div className="flex items-center mb-2">
                <Wifi className="text-blue-500 mr-2" />
                <h3 className="font-medium">Wi-Fi Integration</h3>
              </div>
              <p className="text-sm text-gray-600">Connect to Wi-Fi networks for vehicle diagnostics and location services.</p>
            </Link>
            
            <Link to="/admin-driver-details" className="titeh-card hover:bg-gray-50 transition-colors relative">
              <div className="absolute top-2 right-2">
                <Badge className="bg-purple-500">Admin</Badge>
              </div>
              <div className="flex items-center mb-2">
                <FileSpreadsheet className="text-titeh-primary mr-2" />
                <h3 className="font-medium">Driver Management</h3>
              </div>
              <p className="text-sm text-gray-600">Admin-only access with Google Sheets integration for driver details.</p>
            </Link>
          </div>
        </div>
        
        {/* Security Features Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-titeh-primary">Enhanced Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="titeh-card">
              <div className="flex items-center mb-2">
                <Shield className="text-green-500 mr-2" />
                <h3 className="font-medium">AES-256 Encryption</h3>
              </div>
              <p className="text-sm text-gray-600">All your data is now protected with military-grade encryption for maximum security.</p>
            </div>
            
            <div className="titeh-card">
              <div className="flex items-center mb-2">
                <Smartphone className="text-green-500 mr-2" />
                <h3 className="font-medium">OTP Verification</h3>
              </div>
              <p className="text-sm text-gray-600">Secure access to administrative features with one-time password authentication.</p>
            </div>
          </div>
        </div>
        
        {/* Future Enhancements Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-titeh-primary">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="titeh-card">
              <div className="flex items-center mb-2">
                <AlertTriangle className="text-yellow-500 mr-2" />
                <h3 className="font-medium">Public Safety Alerts</h3>
              </div>
              <p className="text-sm text-gray-600">Real-time alerts for road hazards and traffic incidents coming in next update.</p>
            </div>
            
            <div className="titeh-card">
              <div className="flex items-center mb-2">
                <Leaf className="text-green-500 mr-2" />
                <h3 className="font-medium">Eco-Friendly Driving</h3>
              </div>
              <p className="text-sm text-gray-600">Track fuel efficiency with real-time sensor data coming soon.</p>
            </div>
            
            <div className="titeh-card">
              <div className="flex items-center mb-2">
                <MapPin className="text-titeh-primary mr-2" />
                <h3 className="font-medium">Enhanced GPS Features</h3>
              </div>
              <p className="text-sm text-gray-600">Advanced route tracking and navigation features in development.</p>
            </div>
          </div>
        </div>
        
        <GovernmentBranding />
      </div>
    </Layout>
  );
};

export default Index;
