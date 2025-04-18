
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Bell, AlertTriangle, MapPin, Filter, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ViolationAlerts = () => {
  const { toast } = useToast();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const handleToggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
    toast({
      title: isNotificationsEnabled ? "Notifications disabled" : "Notifications enabled",
      description: isNotificationsEnabled 
        ? "You will no longer receive traffic violation alerts" 
        : "You will now receive alerts about potential traffic violations",
    });
  };

  const recentViolations = [
    { 
      id: 1, 
      type: "Speed Limit Exceeded", 
      location: "Hitech City Road", 
      time: "Today, 10:23 AM", 
      details: "Recorded speed: 68 km/h in a 50 km/h zone",
      penalty: "₹1,000"
    },
    { 
      id: 2, 
      type: "Red Light Violation", 
      location: "Jubilee Hills Checkpost", 
      time: "Yesterday, 8:15 PM", 
      details: "Signal jumped at intersection",
      penalty: "₹1,500"
    },
    { 
      id: 3, 
      type: "No Helmet", 
      location: "Mehdipatnam", 
      time: "2 days ago, 4:30 PM", 
      details: "Riding two-wheeler without helmet",
      penalty: "₹500"
    }
  ];

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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
              Recent Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                    </div>
                  </div>
                  <p className="text-sm mt-2">{violation.details}</p>
                  <div className="mt-3 flex space-x-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button size="sm" className="bg-titeh-primary">Pay Fine</Button>
                  </div>
                </div>
              ))}
            </div>

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
    </Layout>
  );
};

export default ViolationAlerts;
