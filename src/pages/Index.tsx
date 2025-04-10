
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Car, School, Shield, User, Settings, AlertTriangle, Leaf, MapPin } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-titeh-primary">Welcome to TITEH</h1>
        
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
          
          <Link to="/settings" className="module-tile">
            <Settings className="module-icon" />
            <span className="text-sm font-medium text-center">Settings</span>
          </Link>
          
          <Link to="/driver-details" className="module-tile">
            <User className="module-icon" />
            <span className="text-sm font-medium text-center">Driver Details</span>
          </Link>
        </div>
        
        {/* Future Enhancements Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-titeh-primary">Future Enhancements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="titeh-card">
              <div className="flex items-center mb-2">
                <AlertTriangle className="text-yellow-500 mr-2" />
                <h3 className="font-medium">Public Safety Alerts</h3>
              </div>
              <p className="text-sm text-gray-600">Add buzzer integration via ESP32 in future.</p>
            </div>
            
            <div className="titeh-card">
              <div className="flex items-center mb-2">
                <Leaf className="text-green-500 mr-2" />
                <h3 className="font-medium">Eco-Friendly Driving</h3>
              </div>
              <p className="text-sm text-gray-600">Track fuel usage with sensors later.</p>
            </div>
            
            <div className="titeh-card">
              <div className="flex items-center mb-2">
                <MapPin className="text-titeh-primary mr-2" />
                <h3 className="font-medium">Police Patrol Tracker</h3>
              </div>
              <p className="text-sm text-gray-600">Integrate GPS module in future.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
