
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, User, UserCheck, UserCog, Shield, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const UserRoles = () => {
  const [currentRole, setCurrentRole] = useState("citizen");
  const { toast } = useToast();
  
  const handleRoleChange = (role: string) => {
    setCurrentRole(role);
    toast({
      title: "Role Updated",
      description: `Your role has been updated to ${role}`,
      variant: "default",
    });
  };

  const roleConfirmation = (role: string) => {
    if (role !== "citizen") {
      toast({
        title: "Verification Required",
        description: "Please verify your identity to access these features",
        variant: "default",
      });
    } else {
      handleRoleChange(role);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/settings" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">User Roles</h1>
        </div>
        
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Current Role</h2>
          
          <RadioGroup 
            value={currentRole} 
            onValueChange={roleConfirmation}
            className="mb-6"
          >
            <div className="border rounded-lg p-4 mb-3 hover:bg-gray-50">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="citizen" id="citizen" className="mt-1" />
                <div>
                  <Label htmlFor="citizen" className="flex items-center text-base font-medium">
                    <User className="h-5 w-5 mr-2 text-titeh-primary" />
                    Citizen
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Access vehicle information, pay challans, and use basic RTO services.
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      Default Access
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 mb-3 hover:bg-gray-50">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="police" id="police" className="mt-1" />
                <div>
                  <Label htmlFor="police" className="flex items-center text-base font-medium">
                    <Shield className="h-5 w-5 mr-2 text-titeh-primary" />
                    Police
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Issue challans, verify vehicles and licenses, access reporting tools.
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                      Requires Verification
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 mb-3 hover:bg-gray-50">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="agent" id="agent" className="mt-1" />
                <div>
                  <Label htmlFor="agent" className="flex items-center text-base font-medium">
                    <UserCog className="h-5 w-5 mr-2 text-titeh-primary" />
                    Agent
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Process applications, manage registrations, and handle customer requests.
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                      Requires Verification
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={() => toast({
                title: "Request Submitted",
                description: "Your verification request has been submitted. We'll contact you shortly.",
              })}
              className="bg-titeh-primary hover:bg-blue-600"
              disabled={currentRole === "citizen"}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Request Verification
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <div className="flex items-center mb-4">
            <Shield className="text-titeh-primary mr-2" />
            <h2 className="text-lg font-semibold">Role Permissions</h2>
          </div>
          
          <div className="space-y-4">
            <div className="border-b pb-2 mb-2">
              <h3 className="font-medium text-base mb-1">Citizen</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Access personal vehicle information</li>
                <li>Pay challans and view history</li>
                <li>Apply for licenses and permits</li>
                <li>Practice RTO exams and access learning materials</li>
                <li>Report traffic incidents (citizen view only)</li>
              </ul>
            </div>
            
            <div className="border-b pb-2 mb-2">
              <h3 className="font-medium text-base mb-1">Police</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>All Citizen permissions</li>
                <li>Issue and manage challans</li>
                <li>Verify vehicle and license details</li>
                <li>Access violation reports and analytics</li>
                <li>Manage traffic incident reports</li>
                <li>View patrol and assignment data</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-1">Agent</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>All Citizen permissions</li>
                <li>Process vehicle registration applications</li>
                <li>Manage license applications</li>
                <li>Handle permit requests and renewals</li>
                <li>Access RTO office-specific tools</li>
                <li>View application status and manage requests</li>
              </ul>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-yellow-50">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-600 mr-2" />
            <h2 className="font-semibold">Role Verification</h2>
          </div>
          <p className="text-sm text-gray-600 mt-2">Police and Agent roles require official verification. You will need to provide your badge ID or agent license number, which will be verified before access is granted.</p>
        </Card>
      </div>
    </Layout>
  );
};

export default UserRoles;
