
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, Phone, MapPin, Clock, Calendar, Building } from "lucide-react";

interface RtoOffice {
  code: string;
  district: string;
  office: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  services: string[];
}

const rtoOffices: RtoOffice[] = [
  {
    code: "TG-01",
    district: "Adilabad",
    office: "Adilabad",
    address: "RTO Office, Main Road, Adilabad - 504001",
    phone: "+91-8732-220456",
    email: "adilabad.rto@telangana.gov.in",
    hours: "9 AM - 5 PM, Monday to Saturday",
    services: ["License Issuance", "Vehicle Registration", "PUC Verification"]
  },
  {
    code: "TG-02",
    district: "Bhadradri Kothagudem",
    office: "Kothagudem",
    address: "RTO Office, Kothagudem Main Road, Bhadradri Kothagudem - 507101",
    phone: "+91-8744-241234",
    email: "kothagudem.rto@telangana.gov.in",
    hours: "9 AM - 5 PM, Monday to Saturday",
    services: ["License Issuance", "Vehicle Registration", "Permit Renewal"]
  },
  {
    code: "TG-03",
    district: "Hyderabad",
    office: "Hyderabad Central",
    address: "5-9-22, Secretariat Road, Hyderabad - 500063",
    phone: "+91-40-23494777",
    email: "hyderabad.rto@telangana.gov.in",
    hours: "9 AM - 5 PM, Monday to Saturday",
    services: ["License Issuance", "Vehicle Registration", "Fitness Certificate", "International Driving Permit"]
  },
  {
    code: "TG-09",
    district: "Karimnagar",
    office: "Karimnagar",
    address: "RTO Office, District Collectorate, Karimnagar - 505001",
    phone: "+91-878-224567",
    email: "karimnagar.rto@telangana.gov.in",
    hours: "9 AM - 5 PM, Monday to Saturday",
    services: ["License Issuance", "Vehicle Registration", "Tax Collection"]
  },
  {
    code: "TG-10",
    district: "Khammam",
    office: "Khammam",
    address: "RTO Office, Bypass Road, Khammam - 507002",
    phone: "+91-8742-255678",
    email: "khammam.rto@telangana.gov.in",
    hours: "9 AM - 5 PM, Monday to Saturday",
    services: ["License Issuance", "Vehicle Registration", "Learner's License"]
  },
  {
    code: "TG-16",
    district: "Medchal-Malkajgiri",
    office: "Medchal",
    address: "RTO Office, Medchal Highway, Medchal - 501401",
    phone: "+91-40-27567890",
    email: "medchal.rto@telangana.gov.in",
    hours: "9 AM - 5 PM, Monday to Saturday",
    services: ["License Issuance", "Vehicle Registration", "NOC Issuance"]
  },
  {
    code: "TG-25",
    district: "Rangareddy",
    office: "LB Nagar",
    address: "RTO Office, LB Nagar X Road, Hyderabad - 500074",
    phone: "+91-40-24023456",
    email: "rangareddy.rto@telangana.gov.in",
    hours: "9 AM - 5 PM, Monday to Saturday",
    services: ["License Issuance", "Vehicle Registration", "Driving Test"]
  },
  {
    code: "TG-32",
    district: "Warangal Urban",
    office: "Hanamkonda",
    address: "RTO Office, Hanamkonda Main Road, Warangal - 506001",
    phone: "+91-870-255678",
    email: "warangal.rto@telangana.gov.in",
    hours: "9 AM - 5 PM, Monday to Saturday",
    services: ["License Issuance", "Vehicle Registration", "Vehicle Fitness"]
  }
  // More offices would be added here in a complete implementation
];

const RtoOffices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffice, setSelectedOffice] = useState<RtoOffice | null>(null);
  
  // Filter offices based on search term
  const filteredOffices = rtoOffices.filter(office => 
    office.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.office.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // View office details
  const viewOfficeDetails = (office: RtoOffice) => {
    setSelectedOffice(office);
  };
  
  // Close office details
  const closeOfficeDetails = () => {
    setSelectedOffice(null);
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">RTO Offices in Telangana</h1>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search by district, code or office name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {selectedOffice ? (
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedOffice.office} RTO</h2>
                <p className="text-sm text-gray-500">{selectedOffice.district} District - {selectedOffice.code}</p>
              </div>
              <Button variant="outline" size="sm" onClick={closeOfficeDetails}>
                Go Back
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Building className="h-5 w-5 text-titeh-primary mr-3 mt-1" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-gray-600">{selectedOffice.address}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-titeh-primary mr-3 mt-1" />
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-sm text-gray-600">Phone: {selectedOffice.phone}</p>
                  <p className="text-sm text-gray-600">Email: {selectedOffice.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-titeh-primary mr-3 mt-1" />
                <div>
                  <p className="font-medium">Working Hours</p>
                  <p className="text-sm text-gray-600">{selectedOffice.hours}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-titeh-primary mr-3 mt-1" />
                <div>
                  <p className="font-medium">Services Offered</p>
                  <ul className="text-sm text-gray-600 mt-1">
                    {selectedOffice.services.map((service, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-titeh-primary mr-2">•</span>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4">
                <Button size="sm" onClick={() => window.open(`https://maps.google.com/?q=${selectedOffice.address}`, '_blank')}>
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {filteredOffices.map((office) => (
              <Card key={office.code} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{office.office}</h3>
                    <p className="text-sm text-gray-500">{office.district} - {office.code}</p>
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                    RTO
                  </div>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-titeh-primary" />
                    <span>{office.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-titeh-primary" />
                    <span>Office Hours: 9 AM - 5 PM</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full"
                  onClick={() => viewOfficeDetails(office)}
                >
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        )}
        
        {filteredOffices.length === 0 && (
          <Card className="p-6 text-center">
            <Building className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-lg font-medium">No RTO offices found</p>
            <p className="text-sm text-gray-600">Try searching for a different district or office name</p>
          </Card>
        )}
        
        <Card className="p-4 bg-blue-50">
          <div className="flex items-start">
            <MapPin className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Finding Your RTO</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your RTO is determined by your residential address. For most services like license application or vehicle registration, 
                you should visit the RTO office in your district. Always check for holiday announcements before visiting.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default RtoOffices;
