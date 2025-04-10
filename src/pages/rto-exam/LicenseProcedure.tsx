
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft, Globe, Building, ListOrdered, FileText, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const LicenseProcedure = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">License Procedure</h1>
        </div>
        
        <Tabs defaultValue="online">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="online" className="w-1/2">
              <Globe className="mr-2 h-4 w-4" />
              Online Process
            </TabsTrigger>
            <TabsTrigger value="offline" className="w-1/2">
              <Building className="mr-2 h-4 w-4" />
              Offline Process
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="online">
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <ListOrdered className="text-titeh-primary mr-2" />
                Online Application Steps
              </h2>
              
              <ol className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-titeh-primary text-white flex items-center justify-center mr-3">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Visit Sarathi.nic.in and register</h3>
                    <p className="text-sm text-gray-600 mt-1">Go to the official Sarathi website and create an account using your Aadhar details.</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Globe className="mr-2 h-3 w-3" />
                      Visit Website
                    </Button>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-titeh-primary text-white flex items-center justify-center mr-3">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Upload Required Documents</h3>
                    <p className="text-sm text-gray-600 mt-1">Submit digital copies of your address proof, ID proof, recent photograph, and other required documents.</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Aadhar Card</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Passport Size Photo</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Address Proof</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Age Proof</span>
                    </div>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-titeh-primary text-white flex items-center justify-center mr-3">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Schedule a Driving Test</h3>
                    <p className="text-sm text-gray-600 mt-1">Select your preferred RTO location and book a slot for the driving test.</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-titeh-primary text-white flex items-center justify-center mr-3">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Pay the Fee Online</h3>
                    <p className="text-sm text-gray-600 mt-1">Make an online payment of ₹600 for the license fee using credit/debit card, UPI, or net banking.</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-titeh-primary text-white flex items-center justify-center mr-3">
                    5
                  </div>
                  <div>
                    <h3 className="font-medium">Receive License</h3>
                    <p className="text-sm text-gray-600 mt-1">After passing the test, your license will be sent by post or available for digital download.</p>
                  </div>
                </li>
              </ol>
            </Card>
          </TabsContent>
          
          <TabsContent value="offline">
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <ListOrdered className="text-titeh-primary mr-2" />
                Offline Application Steps
              </h2>
              
              <ol className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-titeh-primary text-white flex items-center justify-center mr-3">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Visit the nearest RTO office</h3>
                    <p className="text-sm text-gray-600 mt-1">Find your local RTO office (e.g., RTA WARANGAL) and visit during working hours.</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-titeh-primary text-white flex items-center justify-center mr-3">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Submit Form and Documents</h3>
                    <p className="text-sm text-gray-600 mt-1">Fill out the license application form and submit it along with required documents.</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Aadhar Card</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">SSC Certificate</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Passport Photos</span>
                    </div>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-titeh-primary text-white flex items-center justify-center mr-3">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Appear for Driving Test</h3>
                    <p className="text-sm text-gray-600 mt-1">Take the driving test administered by the RTO officer.</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-titeh-primary text-white flex items-center justify-center mr-3">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Pay Fee at Counter</h3>
                    <p className="text-sm text-gray-600 mt-1">Pay the license fee at the designated counter.</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-titeh-primary text-white flex items-center justify-center mr-3">
                    5
                  </div>
                  <div>
                    <h3 className="font-medium">Collect License in Person</h3>
                    <p className="text-sm text-gray-600 mt-1">After approval, collect your physical license from the RTO office.</p>
                  </div>
                </li>
              </ol>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <FileText className="text-titeh-primary mr-2" />
            Required Documents
          </h2>
          
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Age Proof (Aadhar Card, Birth Certificate, Passport)</li>
            <li>Address Proof (Voter ID, Electricity Bill, Passport)</li>
            <li>Identity Proof (Aadhar Card, PAN Card, Voter ID)</li>
            <li>Medical Certificate (Form 1A) for transport license</li>
            <li>Passport size photographs (recent)</li>
            <li>Form 2 (Learner's License application)</li>
            <li>Form 4 (Driving License application)</li>
          </ul>
          
          <Button variant="outline" size="sm" className="mt-4">
            Download Forms
          </Button>
        </Card>
        
        <Card className="p-4 bg-blue-50">
          <div className="flex items-start">
            <AlertCircle className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Important Rules</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mt-2">
                <li>Minimum age: 18 for LMV, 20 for transport vehicles</li>
                <li>License valid for 20 years or until 50, then renewed every 5 years</li>
                <li>Always carry your license while driving; penalty for non-compliance: ₹500</li>
                <li>Medical certificate required for commercial driving license</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LicenseProcedure;
