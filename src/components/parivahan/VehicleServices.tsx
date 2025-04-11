
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Copy, MapPin, Transfer, Bank, RefreshCw, Check, Clock, ClipboardCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VehicleServices = () => {
  const { toast } = useToast();
  
  const showComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available shortly",
      variant: "default",
    });
  };

  const vehicleServices = [
    { 
      icon: <Calendar className="h-5 w-5 text-titeh-primary" />, 
      title: "Registration Appointment", 
      description: "Book a slot for vehicle registration"
    },
    { 
      icon: <FileText className="h-5 w-5 text-titeh-primary" />, 
      title: "Application Status", 
      description: "Check registration application status"
    },
    { 
      icon: <Copy className="h-5 w-5 text-titeh-primary" />, 
      title: "Duplicate RC", 
      description: "Apply for duplicate registration certificate"
    },
    { 
      icon: <MapPin className="h-5 w-5 text-titeh-primary" />, 
      title: "Address Change", 
      description: "Update address on RC"
    },
    { 
      icon: <Transfer className="h-5 w-5 text-titeh-primary" />, 
      title: "Transfer Ownership", 
      description: "Transfer vehicle ownership"
    },
    { 
      icon: <Bank className="h-5 w-5 text-titeh-primary" />, 
      title: "Hypothecation", 
      description: "Add or remove hypothecation"
    },
    { 
      icon: <RefreshCw className="h-5 w-5 text-titeh-primary" />, 
      title: "Registration Renewal", 
      description: "Renew your vehicle registration"
    },
    { 
      icon: <Check className="h-5 w-5 text-titeh-primary" />, 
      title: "Fitness Certificate", 
      description: "Renew fitness certificate"
    },
    { 
      icon: <Clock className="h-5 w-5 text-titeh-primary" />, 
      title: "Temporary Registration", 
      description: "Apply for temporary registration"
    },
    { 
      icon: <ClipboardCheck className="h-5 w-5 text-titeh-primary" />, 
      title: "Permanent Registration", 
      description: "Apply for permanent registration"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-titeh-primary mb-4">Vehicle Registration Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicleServices.map((service, index) => (
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

export default VehicleServices;
