
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Copy, FileText, Clock, RefreshCw, FileCheck, Plus, School } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const DLServices = () => {
  const { toast } = useToast();
  
  const showComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available shortly",
      variant: "default",
    });
  };

  const dlServices = [
    { 
      icon: <Calendar className="h-5 w-5 text-titeh-primary" />, 
      title: "Appointment Booking", 
      description: "Book a slot for DL test",
      link: "/appointment-booking"
    },
    { 
      icon: <Copy className="h-5 w-5 text-titeh-primary" />, 
      title: "Duplicate DL", 
      description: "Apply for duplicate license",
      link: "/duplicate-dl"
    },
    { 
      icon: <Clock className="h-5 w-5 text-titeh-primary" />, 
      title: "Application Status", 
      description: "Check your DL application status",
      link: "/application-status"
    },
    { 
      icon: <FileText className="h-5 w-5 text-titeh-primary" />, 
      title: "Online LL Test", 
      description: "Take Learner's License test online",
      link: "/ll-test"
    },
    { 
      icon: <RefreshCw className="h-5 w-5 text-titeh-primary" />, 
      title: "DL Renewal", 
      description: "Apply for DL renewal",
      link: "/dl-renewal"
    },
    { 
      icon: <FileCheck className="h-5 w-5 text-titeh-primary" />, 
      title: "Learner's License", 
      description: "Apply for new Learner's License",
      link: "/new-ll"
    },
    { 
      icon: <Copy className="h-5 w-5 text-titeh-primary" />, 
      title: "DL Replacement", 
      description: "Replace damaged or lost DL",
      link: "/dl-replacement"
    },
    { 
      icon: <Plus className="h-5 w-5 text-titeh-primary" />, 
      title: "Add Vehicle Class", 
      description: "Add new class of vehicle to DL",
      link: "/add-vehicle-class"
    },
    { 
      icon: <School className="h-5 w-5 text-titeh-primary" />, 
      title: "Driving School License", 
      description: "Apply for driving school license",
      link: "/driving-school-license"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-titeh-primary mb-4">Driving License Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dlServices.map((service, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {service.icon}
                <CardTitle className="text-base">{service.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-2">{service.description}</CardDescription>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={showComingSoon}
              >
                Access
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DLServices;
