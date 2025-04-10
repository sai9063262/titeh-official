
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Search, Gavel, AlertCircle, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Define types for laws
interface DrivingLaw {
  id: number;
  offense: string;
  penalty: string;
  section: string;
  category: string;
  severity: "Low" | "Medium" | "High";
}

const DrivingLaws = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Driving laws data
  const laws: DrivingLaw[] = [
    // General Traffic Violations
    {
      id: 1,
      offense: "Driving without a valid license",
      penalty: "₹5,000 fine or imprisonment or both",
      section: "MV Act Section 3/181",
      category: "General",
      severity: "High"
    },
    {
      id: 2,
      offense: "Driving without insurance",
      penalty: "₹2,000 fine or imprisonment up to 3 months or both",
      section: "MV Act Section 146/196",
      category: "General",
      severity: "High"
    },
    {
      id: 3,
      offense: "Driving without registration",
      penalty: "₹5,000 fine for first offense, ₹10,000 for subsequent offenses",
      section: "MV Act Section 39/192",
      category: "General",
      severity: "Medium"
    },
    {
      id: 4,
      offense: "Driving an unregistered vehicle",
      penalty: "₹5,000 fine",
      section: "MV Act Section 39/192",
      category: "General",
      severity: "Medium"
    },
    {
      id: 5,
      offense: "Driving without PUC certificate",
      penalty: "₹10,000 fine",
      section: "MV Act Section 190(2)",
      category: "General",
      severity: "Medium"
    },
    
    // Speeding and Dangerous Driving
    {
      id: 6,
      offense: "Over speeding",
      penalty: "₹1,000 to ₹2,000 fine",
      section: "MV Act Section 183",
      category: "Speeding",
      severity: "Medium"
    },
    {
      id: 7,
      offense: "Racing on public roads",
      penalty: "₹5,000 fine or imprisonment up to 3 months or both",
      section: "MV Act Section 189",
      category: "Speeding",
      severity: "High"
    },
    {
      id: 8,
      offense: "Rash and negligent driving",
      penalty: "₹5,000 fine or imprisonment for 6 months to 1 year",
      section: "MV Act Section 184",
      category: "Speeding",
      severity: "High"
    },
    {
      id: 9,
      offense: "Driving in a manner dangerous to public",
      penalty: "₹5,000 fine or imprisonment up to 6 months or both",
      section: "MV Act Section 184",
      category: "Speeding",
      severity: "High"
    },
    {
      id: 10,
      offense: "Crossing speed limit in school zones",
      penalty: "₹2,000 fine",
      section: "MV Act Section 183",
      category: "Speeding",
      severity: "Medium"
    },
    
    // Alcohol and Substance Abuse
    {
      id: 11,
      offense: "Drunk driving (BAC over 0.00%)",
      penalty: "₹10,000 fine or 6 months imprisonment or both",
      section: "MV Act Section 185",
      category: "Alcohol",
      severity: "High"
    },
    {
      id: 12,
      offense: "Refusal to undergo alcohol testing",
      penalty: "₹10,000 fine or imprisonment up to 6 months or both",
      section: "MV Act Section 205",
      category: "Alcohol",
      severity: "High"
    },
    {
      id: 13,
      offense: "Repeat offense of drunk driving",
      penalty: "₹15,000 fine or 2 years imprisonment or both",
      section: "MV Act Section 185",
      category: "Alcohol",
      severity: "High"
    },
    {
      id: 14,
      offense: "Driving under influence of drugs",
      penalty: "₹10,000 fine or imprisonment up to 6 months or both",
      section: "MV Act Section 185",
      category: "Alcohol",
      severity: "High"
    },
    {
      id: 15,
      offense: "Allowing an intoxicated person to drive",
      penalty: "₹10,000 fine or imprisonment up to 3 months or both",
      section: "MV Act Section 186",
      category: "Alcohol",
      severity: "High"
    },
    
    // Safety Equipment Violations
    {
      id: 16,
      offense: "Not wearing a helmet (two-wheeler)",
      penalty: "₹1,000 fine and license suspension for 3 months",
      section: "MV Act Section 194D",
      category: "Safety",
      severity: "Medium"
    },
    {
      id: 17,
      offense: "Not wearing seat belt",
      penalty: "₹1,000 fine",
      section: "MV Act Section 194B",
      category: "Safety",
      severity: "Medium"
    },
    {
      id: 18,
      offense: "Carrying children under 14 without safety belt/child restraint",
      penalty: "₹1,000 fine",
      section: "MV Act Section 194B",
      category: "Safety",
      severity: "Medium"
    },
    {
      id: 19,
      offense: "Riding more than two persons on a two-wheeler",
      penalty: "₹1,000 fine",
      section: "MV Act Section 194C",
      category: "Safety",
      severity: "Medium"
    },
    {
      id: 20,
      offense: "Overloading a vehicle",
      penalty: "₹20,000 fine plus ₹2,000 per ton of excess load",
      section: "MV Act Section 194",
      category: "Safety",
      severity: "High"
    },
    
    // Traffic Signal and Sign Violations
    {
      id: 21,
      offense: "Running a red light",
      penalty: "₹1,000 fine for first offense, ₹5,000 for subsequent offenses",
      section: "MV Act Section 184",
      category: "Traffic",
      severity: "Medium"
    },
    {
      id: 22,
      offense: "Violating stop sign",
      penalty: "₹500 fine",
      section: "MV Act Section 177",
      category: "Traffic",
      severity: "Low"
    },
    {
      id: 23,
      offense: "Wrong-way driving (against traffic)",
      penalty: "₹5,000 fine",
      section: "MV Act Section 177",
      category: "Traffic",
      severity: "High"
    },
    {
      id: 24,
      offense: "Not yielding to emergency vehicles",
      penalty: "₹10,000 fine or imprisonment for 6 months",
      section: "MV Act Section 194E",
      category: "Traffic",
      severity: "High"
    },
    {
      id: 25,
      offense: "Illegal parking",
      penalty: "₹500 fine",
      section: "MV Act Section 177",
      category: "Traffic",
      severity: "Low"
    },
    
    // Distracted Driving
    {
      id: 26,
      offense: "Using mobile phone while driving",
      penalty: "₹1,000 fine for first offense, ₹5,000 for subsequent offenses",
      section: "MV Act Section 184",
      category: "Distracted",
      severity: "Medium"
    },
    {
      id: 27,
      offense: "Use of handheld device while driving",
      penalty: "₹1,000 fine for first offense, ₹5,000 for subsequent offenses",
      section: "MV Act Section 184",
      category: "Distracted",
      severity: "Medium"
    },
    {
      id: 28,
      offense: "Texting while driving",
      penalty: "₹5,000 fine",
      section: "MV Act Section 184",
      category: "Distracted",
      severity: "High"
    },
    {
      id: 29,
      offense: "Watching videos while driving",
      penalty: "₹5,000 fine",
      section: "MV Act Section 184",
      category: "Distracted",
      severity: "High"
    },
    {
      id: 30,
      offense: "Distracted driving causing accident",
      penalty: "₹10,000 fine and/or imprisonment",
      section: "MV Act Section 184",
      category: "Distracted",
      severity: "High"
    }
  ];
  
  // Filter laws based on search term
  const filteredLaws = laws.filter(law => 
    law.offense.toLowerCase().includes(searchTerm.toLowerCase()) ||
    law.penalty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    law.section.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter laws by category
  const getFilteredLawsByCategory = (category: string) => {
    return filteredLaws.filter(law => law.category === category);
  };
  
  const generalLaws = getFilteredLawsByCategory("General");
  const speedingLaws = getFilteredLawsByCategory("Speeding");
  const alcoholLaws = getFilteredLawsByCategory("Alcohol");
  const safetyLaws = getFilteredLawsByCategory("Safety");
  const trafficLaws = getFilteredLawsByCategory("Traffic");
  const distractedLaws = getFilteredLawsByCategory("Distracted");
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Telangana Driving Laws</h1>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search for laws, penalties, or sections..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="speeding">Speeding</TabsTrigger>
            <TabsTrigger value="alcohol">Alcohol</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="distracted">Distracted</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <LawsTable laws={filteredLaws} />
          </TabsContent>
          
          <TabsContent value="general" className="mt-4">
            <LawsTable laws={generalLaws} />
          </TabsContent>
          
          <TabsContent value="speeding" className="mt-4">
            <LawsTable laws={speedingLaws} />
          </TabsContent>
          
          <TabsContent value="alcohol" className="mt-4">
            <LawsTable laws={alcoholLaws} />
          </TabsContent>
          
          <TabsContent value="safety" className="mt-4">
            <LawsTable laws={safetyLaws} />
          </TabsContent>
          
          <TabsContent value="traffic" className="mt-4">
            <LawsTable laws={trafficLaws} />
          </TabsContent>
          
          <TabsContent value="distracted" className="mt-4">
            <LawsTable laws={distractedLaws} />
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-blue-50">
            <div className="flex items-start">
              <AlertCircle className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Important Notice</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Laws and penalties are subject to change. Always refer to the latest Motor Vehicles Act 
                  and Telangana state regulations for the most current information.
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-blue-50">
            <div className="flex items-start">
              <DollarSign className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Penalty Calculator</h3>
                <p className="text-sm text-gray-600 mt-1">
                  The penalties shown are based on the amended Motor Vehicles Act 2019, 
                  as implemented in Telangana. Multiple violations can lead to cumulative penalties.
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        <Card className="p-4">
          <div className="flex items-start">
            <Gavel className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Law Enforcement Contact</h3>
              <p className="text-sm text-gray-600 mt-1">
                For traffic violations and disputes, contact Telangana Traffic Police at 040-27852482 
                or visit <a href="https://www.tgpolice.gov.in" className="text-blue-600 hover:underline">www.tgpolice.gov.in</a>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                To pay traffic challans online, visit <a href="https://echallan.tspolice.gov.in" className="text-blue-600 hover:underline">https://echallan.tspolice.gov.in</a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

// Laws Table Component
const LawsTable = ({ laws }: { laws: DrivingLaw[] }) => {
  if (laws.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Gavel className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-lg font-medium">No laws found</p>
        <p className="text-sm text-gray-600">Try a different search term</p>
      </Card>
    );
  }
  
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Offense</TableHead>
            <TableHead>Penalty</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Severity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {laws.map(law => (
            <TableRow key={law.id}>
              <TableCell className="font-medium">{law.offense}</TableCell>
              <TableCell>{law.penalty}</TableCell>
              <TableCell>{law.section}</TableCell>
              <TableCell>
                <Badge variant={
                  law.severity === "Low" ? "outline" : 
                  law.severity === "Medium" ? "secondary" : 
                  "destructive"
                }>
                  {law.severity}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DrivingLaws;
