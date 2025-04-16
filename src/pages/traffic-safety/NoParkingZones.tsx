
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, MapPin, AlertTriangle, Search, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ParkingZone {
  id: string;
  area: string;
  description: string;
  timings: string;
  penalty: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  severity: "high" | "medium" | "low";
}

const noParkingZones: ParkingZone[] = [
  {
    id: "np-001",
    area: "Punjagutta Main Road",
    description: "Complete stretch from Punjagutta Circle to Greenlands Junction",
    timings: "24 hours",
    penalty: "₹1,000",
    coordinates: {
      lat: 17.425678,
      lng: 78.446789
    },
    severity: "high"
  },
  {
    id: "np-002",
    area: "Begumpet Flyover",
    description: "Both sides of the Begumpet Flyover",
    timings: "24 hours",
    penalty: "₹1,000",
    coordinates: {
      lat: 17.435123,
      lng: 78.459876
    },
    severity: "high"
  },
  {
    id: "np-003",
    area: "Secunderabad Station Road",
    description: "From Paradise Circle to Secunderabad Station",
    timings: "24 hours",
    penalty: "₹1,000",
    coordinates: {
      lat: 17.443871,
      lng: 78.501234
    },
    severity: "high"
  },
  {
    id: "np-004",
    area: "Ameerpet Metro Station",
    description: "100m radius around Ameerpet Metro Station",
    timings: "6 AM - 10 PM",
    penalty: "₹500",
    coordinates: {
      lat: 17.437834,
      lng: 78.447381
    },
    severity: "medium"
  },
  {
    id: "np-005",
    area: "KPHB Colony Main Road",
    description: "From JNTU to KPHB Phase 6",
    timings: "8 AM - 8 PM",
    penalty: "₹500",
    coordinates: {
      lat: 17.494567,
      lng: 78.391234
    },
    severity: "medium"
  },
  {
    id: "np-006",
    area: "Gachibowli Flyover",
    description: "Complete stretch of Gachibowli Flyover",
    timings: "24 hours",
    penalty: "₹1,000",
    coordinates: {
      lat: 17.442346,
      lng: 78.354678
    },
    severity: "high"
  },
  {
    id: "np-007",
    area: "Jubilee Hills Road No. 36",
    description: "Complete stretch of Road No. 36",
    timings: "10 AM - 10 PM",
    penalty: "₹500",
    coordinates: {
      lat: 17.431234,
      lng: 78.407834
    },
    severity: "medium"
  },
  {
    id: "np-008",
    area: "Lakdikapul Metro Station",
    description: "Surrounding areas of Lakdikapul Metro Station",
    timings: "7 AM - 11 PM",
    penalty: "₹500",
    coordinates: {
      lat: 17.407834,
      lng: 78.465678
    },
    severity: "medium"
  }
];

const NoParkingZones = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedZone, setSelectedZone] = React.useState<ParkingZone | null>(null);
  
  const filteredZones = noParkingZones.filter(zone => 
    zone.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const viewZoneDetails = (zone: ParkingZone) => {
    setSelectedZone(zone);
  };
  
  const closeZoneDetails = () => {
    setSelectedZone(null);
  };
  
  const getSeverityColor = (severity: ParkingZone["severity"]) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "amber";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/traffic-safety" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">No Parking Zones</h1>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search by area or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs defaultValue="list" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4 mt-4">
            {selectedZone ? (
              <Card className="p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedZone.area}</h2>
                    <Badge variant={getSeverityColor(selectedZone.severity) as any}>
                      {selectedZone.severity.toUpperCase()} Restriction
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={closeZoneDetails}>
                    Go Back
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-titeh-primary mr-3 mt-1" />
                    <div>
                      <p className="font-medium">Description</p>
                      <p className="text-sm text-gray-600">{selectedZone.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-titeh-primary mr-3 mt-1" />
                    <div>
                      <p className="font-medium">Penalty</p>
                      <p className="text-sm text-gray-600">{selectedZone.penalty} fine</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-titeh-primary mr-3 mt-1" />
                    <div>
                      <p className="font-medium">Timings</p>
                      <p className="text-sm text-gray-600">{selectedZone.timings}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button size="sm" onClick={() => window.open(`https://maps.google.com/?q=${selectedZone.coordinates.lat},${selectedZone.coordinates.lng}`, '_blank')}>
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredZones.map((zone) => (
                  <Card key={zone.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{zone.area}</h3>
                        <p className="text-sm text-gray-500">{zone.description.length > 60 ? 
                          zone.description.substring(0, 60) + "..." : 
                          zone.description}
                        </p>
                      </div>
                      <Badge variant={getSeverityColor(zone.severity) as any} className="ml-2">
                        {zone.severity.charAt(0).toUpperCase() + zone.severity.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Penalty:</span> {zone.penalty}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewZoneDetails(zone)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {filteredZones.length === 0 && (
                  <Card className="p-6 text-center">
                    <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-lg font-medium">No parking zones found</p>
                    <p className="text-sm text-gray-600">Try searching for a different area</p>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="map" className="mt-4">
            <Card className="p-4">
              <div className="bg-gray-200 h-[400px] rounded-md flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-sm text-gray-600 mb-4">View no parking zones on a map</p>
                  <Button onClick={() => window.open(`https://maps.google.com/?q=Hyderabad+no+parking+zones`, '_blank')}>
                    Open in Google Maps
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="p-4 bg-blue-50">
          <div className="flex items-start">
            <AlertTriangle className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Parking Violation Information</h3>
              <p className="text-sm text-gray-600 mt-1">
                Parking in no-parking zones can result in fines ranging from ₹500 to ₹1,000. 
                Repeated violations may lead to vehicle impounding or license suspension. 
                Always look for official no-parking signs before leaving your vehicle.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default NoParkingZones;
