import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, FileText, Check, Download, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: string;
  whereToObtain: string;
}

const ValidDocuments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const documents: Document[] = [
    // Identity Proof
    {
      id: "aadhar",
      name: "Aadhaar Card",
      description: "Universal identity card issued by the Government of India",
      required: true,
      category: "identity",
      whereToObtain: "Nearest Aadhaar Enrollment Center or update online at uidai.gov.in"
    },
    {
      id: "voter",
      name: "Voter ID Card",
      description: "Election card issued by the Election Commission of India",
      required: false,
      category: "identity",
      whereToObtain: "Electoral Registration Office in your constituency or online at nvsp.in"
    },
    {
      id: "pan",
      name: "PAN Card",
      description: "Permanent Account Number card issued by the Income Tax Department",
      required: false,
      category: "identity",
      whereToObtain: "Online at incometaxindiaefiling.gov.in or through authorized centers"
    },
    {
      id: "passport",
      name: "Passport",
      description: "International travel document issued by the Government of India",
      required: false,
      category: "identity",
      whereToObtain: "Passport Seva Kendra or online at passportindia.gov.in"
    },
    
    // Address Proof
    {
      id: "utility",
      name: "Utility Bill",
      description: "Electricity/Water/Gas bill (not older than 3 months)",
      required: false,
      category: "address",
      whereToObtain: "From your utility service provider or download from their website"
    },
    {
      id: "rent",
      name: "Rent Agreement",
      description: "Legally valid rent agreement (notarized)",
      required: false,
      category: "address",
      whereToObtain: "Create with your landlord and get it notarized at a Notary office"
    },
    {
      id: "bank",
      name: "Bank Statement",
      description: "Bank account statement with address (not older than 3 months)",
      required: false,
      category: "address",
      whereToObtain: "From your bank branch or download from net banking"
    },
    
    // Age Proof
    {
      id: "birth",
      name: "Birth Certificate",
      description: "Certificate issued by Municipal Corporation",
      required: false,
      category: "age",
      whereToObtain: "Municipal Corporation or online at indiancitizenshiponline.nic.in"
    },
    {
      id: "leaving",
      name: "School Leaving Certificate",
      description: "Certificate issued by school with date of birth",
      required: false,
      category: "age",
      whereToObtain: "From your school administration office"
    },
    {
      id: "ssc",
      name: "10th Marksheet",
      description: "Secondary School Certificate with date of birth",
      required: false,
      category: "age",
      whereToObtain: "From your school or board website"
    },
    
    // Other Documents
    {
      id: "photo",
      name: "Recent Photographs",
      description: "3 passport-sized color photographs with white background",
      required: true,
      category: "other",
      whereToObtain: "Any photo studio"
    },
    {
      id: "form1",
      name: "Form 1A (Medical Certificate)",
      description: "Certificate of medical fitness for transport vehicle license",
      required: false,
      category: "other",
      whereToObtain: "Any registered medical practitioner"
    },
    {
      id: "form2",
      name: "Form 2 (Learner's License Application)",
      description: "Application form for a learner's license",
      required: true,
      category: "other",
      whereToObtain: "Download from parivahan.gov.in or collect from RTO"
    },
    {
      id: "form4",
      name: "Form 4 (Permanent License Application)",
      description: "Application form for a permanent driving license",
      required: true,
      category: "other",
      whereToObtain: "Download from parivahan.gov.in or collect from RTO"
    },
    {
      id: "fee",
      name: "Fee Receipt",
      description: "Payment receipt for license fee",
      required: true,
      category: "other",
      whereToObtain: "Generated during online payment or from RTO counter"
    }
  ];
  
  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group documents by category
  const identityDocs = filteredDocuments.filter(doc => doc.category === "identity");
  const addressDocs = filteredDocuments.filter(doc => doc.category === "address");
  const ageDocs = filteredDocuments.filter(doc => doc.category === "age");
  const otherDocs = filteredDocuments.filter(doc => doc.category === "other");
  
  // Download checklist function (placeholder)
  const downloadChecklist = () => {
    alert("Checklist download feature will be implemented soon.");
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/rto-exam" className="mr-2">
              <ChevronLeft className="text-titeh-primary" />
            </Link>
            <h1 className="text-2xl font-bold text-titeh-primary">Valid Document List</h1>
          </div>
          <Button onClick={downloadChecklist} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Download Checklist</span>
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search for documents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="age">Age</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map(doc => (
                <DocumentCard key={doc.id} document={doc} />
              ))
            ) : (
              <Card className="p-6 text-center">
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-medium">No documents found</p>
                <p className="text-sm text-gray-600">Try a different search term</p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="identity" className="space-y-4 mt-4">
            {identityDocs.length > 0 ? (
              identityDocs.map(doc => (
                <DocumentCard key={doc.id} document={doc} />
              ))
            ) : (
              <Card className="p-6 text-center">
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-medium">No identity documents found</p>
                <p className="text-sm text-gray-600">Try a different search term</p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="address" className="space-y-4 mt-4">
            {addressDocs.length > 0 ? (
              addressDocs.map(doc => (
                <DocumentCard key={doc.id} document={doc} />
              ))
            ) : (
              <Card className="p-6 text-center">
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-medium">No address documents found</p>
                <p className="text-sm text-gray-600">Try a different search term</p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="age" className="space-y-4 mt-4">
            {ageDocs.length > 0 ? (
              ageDocs.map(doc => (
                <DocumentCard key={doc.id} document={doc} />
              ))
            ) : (
              <Card className="p-6 text-center">
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-medium">No age proof documents found</p>
                <p className="text-sm text-gray-600">Try a different search term</p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="other" className="space-y-4 mt-4">
            {otherDocs.length > 0 ? (
              otherDocs.map(doc => (
                <DocumentCard key={doc.id} document={doc} />
              ))
            ) : (
              <Card className="p-6 text-center">
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-medium">No other documents found</p>
                <p className="text-sm text-gray-600">Try a different search term</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <Card className="p-4 bg-blue-50 mb-6">
          <div className="flex items-start">
            <FileText className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Document Requirements</h3>
              <p className="text-sm text-gray-600 mt-1">
                All documents must be original and valid. Photocopies must be self-attested. 
                Aadhaar and recent photographs are mandatory for all license applications.
                For transport license applications, a medical certificate (Form 1A) is required.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

// Document Card Component
const DocumentCard = ({ document }: { document: Document }) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{document.name}</h3>
            {document.required && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Required</span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{document.description}</p>
        </div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${document.required ? 'bg-red-100' : 'bg-gray-100'}`}>
          {document.required ? (
            <Check className="h-5 w-5 text-red-500" />
          ) : (
            <Check className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      <div className="mt-3 text-sm">
        <p className="font-medium text-gray-600">Where to obtain:</p>
        <p className="text-gray-600">{document.whereToObtain}</p>
      </div>
    </Card>
  );
};

export default ValidDocuments;
