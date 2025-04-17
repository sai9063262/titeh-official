
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Phone, Clock, Globe, MapPin, Star, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Import driving schools data
import { drivingSchools } from "@/utils/ExamData";

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Hanamkonda");
  const { toast } = useToast();

  // Filter schools by search term and location
  const filteredSchools = drivingSchools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        school.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === "All" || school.address.includes(selectedLocation);
    return matchesSearch && matchesLocation;
  });

  // Handle booking appointment
  const handleBookAppointment = (schoolName: string) => {
    toast({
      title: "Appointment Request Sent",
      description: `Your appointment request with ${schoolName} has been sent. They will contact you shortly.`,
      variant: "default",
    });
  };

  // Get unique locations from schools
  const locations = ["All", "Hanamkonda", "Warangal"];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Driving Schools</h1>
        </div>
        
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search by name or address..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs 
              value={selectedLocation} 
              onValueChange={setSelectedLocation}
              className="w-full md:w-auto"
            >
              <TabsList>
                {locations.map((location, index) => (
                  <TabsTrigger key={index} value={location}>
                    {location}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="space-y-6 mb-6">
          {filteredSchools.length > 0 ? (
            filteredSchools.map((school) => (
              <SchoolCard 
                key={school.id} 
                school={school} 
                onBookAppointment={handleBookAppointment}
              />
            ))
          ) : (
            <Card className="p-6 text-center">
              <p className="text-lg font-medium">No driving schools found</p>
              <p className="text-sm text-gray-600">Try a different search term or location</p>
            </Card>
          )}
        </div>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Why Choose a Registered Driving School?</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Professional instructors with RTO certification</li>
            <li>Structured learning curriculum</li>
            <li>Access to training vehicles equipped with safety features</li>
            <li>Higher success rate in driving tests</li>
            <li>Assistance with license application process</li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
};

// Driving School Card Component
const SchoolCard = ({ 
  school, 
  onBookAppointment 
}: { 
  school: any, 
  onBookAppointment: (schoolName: string) => void
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-4 md:mb-0">
            <img 
              src={school.image} 
              alt={school.name} 
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
          
          <div className="md:w-3/4 md:pl-6">
            <div className="flex flex-col md:flex-row md:justify-between mb-2">
              <h3 className="text-xl font-semibold">{school.name}</h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="font-medium">{school.rating}</span>
                <span className="text-gray-500">/5</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                <p className="text-sm text-gray-600">{school.address}</p>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-2" />
                <p className="text-sm text-gray-600">{school.phone}</p>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <p className="text-sm text-gray-600">{school.timings}</p>
              </div>
              
              {school.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-500 mr-2" />
                  <a 
                    href={school.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Services:</h4>
              <div className="flex flex-wrap gap-2">
                {school.services.map((service: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Fees:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="text-sm">
                  <span className="font-medium">Two Wheeler:</span> {school.fees.twoWheeler}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Four Wheeler:</span> {school.fees.fourWheeler}
                </div>
                {school.fees.commercial && (
                  <div className="text-sm">
                    <span className="font-medium">Commercial:</span> {school.fees.commercial}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View Details</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{school.name}</DialogTitle>
                    <DialogDescription>
                      Complete details about the driving school
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <img 
                      src={school.image} 
                      alt={school.name} 
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold">Address:</h4>
                        <p className="text-sm">{school.address}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Contact:</h4>
                        <p className="text-sm">{school.phone}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Hours:</h4>
                        <p className="text-sm">{school.timings}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Services:</h4>
                        <ul className="list-disc pl-5 text-sm">
                          {school.services.map((service: string, index: number) => (
                            <li key={index}>{service}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Fees:</h4>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Two Wheeler: {school.fees.twoWheeler}</li>
                          <li>Four Wheeler: {school.fees.fourWheeler}</li>
                          {school.fees.commercial && (
                            <li>Commercial: {school.fees.commercial}</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                className="bg-titeh-primary hover:bg-blue-600"
                onClick={() => onBookAppointment(school.name)}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Schools;
