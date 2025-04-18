
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { 
  School, 
  BookOpen, 
  FileText, 
  PlayCircle, 
  Store, 
  FileType, 
  Building, 
  ListChecks, 
  Gavel,
  Clock,
  Signpost,
  Eye,
  Calendar,
  BookMarked,
  HelpCircle,
  Car,
  AlertTriangle,
  Video,
  FileCheck,
  MessageSquare,
  Brain,
  Camera,
  Mic,
  HeartPulse
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const RtoExam = () => {
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const [locationPermission, setLocationPermission] = useState<string>("prompt");
  const { toast } = useToast();

  // Request location permission when component mounts
  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setLocationPermission(status.state);
        
        status.onchange = () => {
          setLocationPermission(status.state);
        };
        
        if (status.state === 'granted') {
          requestLocation();
        }
      } catch (error) {
        console.error("Error checking permission:", error);
      }
    };
    
    checkLocationPermission();
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
          toast({
            title: "Location access granted",
            description: "We'll show you nearby services based on your location.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location access error",
            description: "Could not access your location. Some features may be limited.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleLocationRequest = () => {
    if (locationPermission === "prompt") {
      requestLocation();
    } else if (locationPermission === "denied") {
      toast({
        title: "Location access required",
        description: "Please enable location access in your browser settings for better service.",
        variant: "destructive",
      });
    }
  };

  const examItems = [
    { icon: <School className="text-titeh-primary text-xl" />, label: "Practice Driving Licence Exam", link: "/rto-exam/practice" },
    { icon: <BookOpen className="text-titeh-primary text-xl" />, label: "Question Bank", link: "/rto-exam/questions" },
    { icon: <FileText className="text-titeh-primary text-xl" />, label: "DL Que. & Sign", link: "/traffic-signs" },
    { icon: <PlayCircle className="text-titeh-primary text-xl" />, label: "Exam Preparation", link: "/rto-exam/practice-exam" },
    { icon: <Store className="text-titeh-primary text-xl" />, label: "Driving Schools", link: "/rto-exam/schools", needsLocation: true },
    { icon: <FileType className="text-titeh-primary text-xl" />, label: "License Procedure", link: "/rto-exam/license-procedure" },
    { icon: <Building className="text-titeh-primary text-xl" />, label: "RTO Offices", link: "/rto-exam/offices" },
    { icon: <ListChecks className="text-titeh-primary text-xl" />, label: "Valid Document List", link: "/rto-exam/documents" },
    { icon: <Gavel className="text-titeh-primary text-xl" />, label: "Driving Laws", link: "/rto-exam/laws" },
    // New Features - Group 1
    { icon: <Clock className="text-titeh-primary text-xl" />, label: "Mock Test Simulator", link: "/rto-exam/mock-test" },
    { icon: <Signpost className="text-titeh-primary text-xl" />, label: "Road Sign Recognition", link: "/rto-exam/road-signs" },
    { icon: <Eye className="text-titeh-primary text-xl" />, label: "Driving Tips & Techniques", link: "/rto-exam/driving-tips" },
    { icon: <Calendar className="text-titeh-primary text-xl" />, label: "RTO Exam Schedule", link: "/rto-exam/exam-schedule" },
    { icon: <BookMarked className="text-titeh-primary text-xl" />, label: "Learner's Logbook", link: "/rto-exam/learners-logbook" },
    { icon: <HelpCircle className="text-titeh-primary text-xl" />, label: "Traffic Rules Quiz", link: "/rto-exam/traffic-quiz" },
    // New Features - Group 2
    { icon: <Car className="text-titeh-primary text-xl" />, label: "Virtual Driving Simulator", link: "/rto-exam/simulator" },
    { icon: <AlertTriangle className="text-titeh-primary text-xl" />, label: "Penalty Points Tracker", link: "/rto-exam/penalty-tracker" },
    { icon: <Video className="text-titeh-primary text-xl" />, label: "Road Safety Videos", link: "/rto-exam/safety-videos" },
    { icon: <FileCheck className="text-titeh-primary text-xl" />, label: "License Renewal Guide", link: "/rto-exam/renewal-guide" },
    { icon: <MessageSquare className="text-titeh-primary text-xl" />, label: "Community Discussion Forum", link: "/rto-exam/forum" },
    // New Features - Group 3
    { icon: <Brain className="text-titeh-primary text-xl" />, label: "Adaptive Learning Module", link: "/rto-exam/adaptive-learning" },
    { icon: <Camera className="text-titeh-primary text-xl" />, label: "Real-Time Traffic Violation Alerts", link: "/rto-exam/violation-alerts" },
    { icon: <Mic className="text-titeh-primary text-xl" />, label: "Expert Q&A Session", link: "/rto-exam/expert-qa" },
    { icon: <Eye className="text-titeh-primary text-xl" />, label: "Hazard Perception Training", link: "/rto-exam/hazard-perception" },
    { icon: <HeartPulse className="text-titeh-primary text-xl" />, label: "Driver Fitness Assessment", link: "/rto-exam/fitness-assessment" },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">RTO Exam & Learning</h1>
        
        {locationPermission === "prompt" && (
          <Card className="p-4 mb-6 border-blue-200 bg-blue-50">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="font-medium mb-1">Location Access</h3>
                <p className="text-sm text-gray-600 mb-2">Enable location access to see nearby driving schools and RTO offices.</p>
                <button 
                  onClick={handleLocationRequest}
                  className="text-sm bg-titeh-primary text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors"
                >
                  Grant Permission
                </button>
              </div>
            </div>
          </Card>
        )}
        
        <div className="space-y-4">
          {examItems.map((item, index) => (
            <Link 
              to={item.link} 
              key={index} 
              onClick={(e) => {
                if (item.needsLocation && locationPermission !== "granted") {
                  e.preventDefault();
                  handleLocationRequest();
                }
              }}
            >
              <Card className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="mr-4 w-8">{item.icon}</div>
                  <span className="font-medium">{item.label}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RtoExam;
