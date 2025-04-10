
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, User } from "lucide-react";

interface DriverInfo {
  licenseNumber: string;
  name: string;
  fatherName?: string;
  address: string;
  dob: string;
  bloodGroup?: string;
  dateOfIssue: string;
  dateOfValidity: string;
  vehicleCategories: string[];
  issuedBy?: string;
  originalAuthority?: string;
  referenceNumber?: string;
  badgeNumber?: string;
  photo?: string;
}

const driverDatabase: DriverInfo[] = [
  {
    licenseNumber: "AP03620130001956",
    name: "KOTRAGATTIESINGARAM SHAMAME",
    address: "SHAYALMET WARANGAL-506313",
    dob: "20/03/1986",
    dateOfIssue: "30/03/2013",
    dateOfValidity: "29/03/2033",
    vehicleCategories: ["Non Transport", "Autorickshaw Non Transport", "Light Motor Vehicle Non Transport", "Motor Cycle With Gear"],
    originalAuthority: "RTA WARANGAL",
    referenceNumber: "AP03620130001956",
    photo: "/placeholder.svg"
  },
  {
    licenseNumber: "TG02420240005306",
    name: "NALLA RAHUL",
    fatherName: "NALLA DEVENDER",
    address: "1-95/1, KONKAPAKA, PARVATHAGIRI, WARANGAL - 506336",
    dob: "24/12/2005",
    dateOfIssue: "03/08/2024",
    dateOfValidity: "24/12/2045",
    vehicleCategories: ["Invalid Carriage (Regn. Numbers)", "Hazardous Validity", "Hill Validity", "LMV", "MCWG"],
    issuedBy: "TG024",
    photo: "/placeholder.svg"
  }
];

const DriverDetails = () => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [notFound, setNotFound] = useState(false);

  const searchLicense = () => {
    setNotFound(false);
    const driver = driverDatabase.find(d => d.licenseNumber === licenseNumber);
    
    if (driver) {
      setDriverInfo(driver);
    } else {
      setDriverInfo(null);
      setNotFound(true);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Driver Details</h1>
        
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <User className="text-titeh-primary mr-2" />
            License Search
          </h2>
          <div className="flex flex-col md:flex-row gap-2">
            <Input 
              placeholder="Enter License Number (e.g., AP03620130001956)" 
              className="flex-1"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
            <Button onClick={searchLicense} className="bg-titeh-primary hover:bg-blue-600">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
          {notFound && (
            <p className="text-red-500 mt-2">No driver found with this license number.</p>
          )}
        </Card>
        
        {driverInfo && (
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
                <div className="w-40 h-48 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
                  <img 
                    src={driverInfo.photo} 
                    alt={driverInfo.name} 
                    className="max-w-full max-h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-2/3 md:pl-6">
                <h2 className="text-xl font-bold text-titeh-primary mb-4">{driverInfo.name}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="font-medium">{driverInfo.licenseNumber}</p>
                  </div>
                  
                  {driverInfo.fatherName && (
                    <div>
                      <p className="text-sm text-gray-500">Father's Name</p>
                      <p className="font-medium">{driverInfo.fatherName}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{driverInfo.dob}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{driverInfo.address}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Date of Issue</p>
                    <p className="font-medium">{driverInfo.dateOfIssue}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Valid Until</p>
                    <p className="font-medium">{driverInfo.dateOfValidity}</p>
                  </div>
                  
                  {driverInfo.issuedBy && (
                    <div>
                      <p className="text-sm text-gray-500">Issued By</p>
                      <p className="font-medium">{driverInfo.issuedBy}</p>
                    </div>
                  )}
                  
                  {driverInfo.originalAuthority && (
                    <div>
                      <p className="text-sm text-gray-500">Original Licensing Authority</p>
                      <p className="font-medium">{driverInfo.originalAuthority}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Vehicle Categories</p>
                  <ul className="list-disc list-inside">
                    {driverInfo.vehicleCategories.map((category, index) => (
                      <li key={index} className="text-sm">{category}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        <div className="text-sm text-gray-600 italic">
          <p>Note: Enter either "AP03620130001956" or "TG02420240005306" to view sample driver details.</p>
        </div>
      </div>
    </Layout>
  );
};

export default DriverDetails;
