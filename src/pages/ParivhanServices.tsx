
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DLServices from "@/components/parivahan/DLServices";
import VehicleServices from "@/components/parivahan/VehicleServices";
import EChallanServices from "@/components/parivahan/EChallanServices";
import GovernmentBranding from "@/components/GovernmentBranding";
import { Card } from "@/components/ui/card";
import { FileText, BarChart, Mail, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ParivhanServices = () => {
  const { toast } = useToast();
  
  const showComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available shortly",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Parivahan Sewa Services</h1>

        <Tabs defaultValue="dl" className="mb-8">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="dl" className="flex-1">Driving License</TabsTrigger>
            <TabsTrigger value="vehicle" className="flex-1">Vehicle Services</TabsTrigger>
            <TabsTrigger value="echallan" className="flex-1">e-Challan</TabsTrigger>
            <TabsTrigger value="other" className="flex-1">Other Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dl">
            <DLServices />
          </TabsContent>
          
          <TabsContent value="vehicle">
            <VehicleServices />
          </TabsContent>
          
          <TabsContent value="echallan">
            <EChallanServices />
          </TabsContent>
          
          <TabsContent value="other">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-titeh-primary mb-4">Other Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card className="p-4 flex items-start gap-3">
                  <FileText className="h-5 w-5 text-titeh-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">FAQ Section</h3>
                    <p className="text-sm text-gray-600 mb-2">Find answers to commonly asked questions about vehicle registration, driving licenses, and more.</p>
                    <Button variant="outline" size="sm" onClick={showComingSoon}>View FAQs</Button>
                  </div>
                </Card>
                
                <Card className="p-4 flex items-start gap-3">
                  <Mail className="h-5 w-5 text-titeh-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Monthly Newsletter</h3>
                    <p className="text-sm text-gray-600 mb-2">Subscribe to our newsletter for updates on new services, policies, and transportation news.</p>
                    <Button variant="outline" size="sm" onClick={showComingSoon}>Subscribe</Button>
                  </div>
                </Card>
                
                <Card className="p-4 flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-titeh-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Service Guides</h3>
                    <p className="text-sm text-gray-600 mb-2">Step-by-step guides on how to use various services offered by the Transport Department.</p>
                    <Button variant="outline" size="sm" onClick={showComingSoon}>View Guides</Button>
                  </div>
                </Card>
                
                <Card className="p-4 flex items-start gap-3">
                  <BarChart className="h-5 w-5 text-titeh-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Dashboard</h3>
                    <p className="text-sm text-gray-600 mb-2">View state-wise and national progress data on various transportation parameters.</p>
                    <Button variant="outline" size="sm" onClick={showComingSoon}>View Dashboard</Button>
                  </div>
                </Card>
              </div>
              
              <Card className="p-4 bg-blue-50">
                <h3 className="font-medium mb-2">Coming Soon</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>mParivahan App Integration</li>
                  <li>Contact Directory</li>
                  <li>UMANG Integration</li>
                  <li>User Registration with OTP</li>
                </ul>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <GovernmentBranding />
      </div>
    </Layout>
  );
};

export default ParivhanServices;
