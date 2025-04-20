
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, File, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DocumentDisplay = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-titeh-primary mb-2">Document Display</h1>
          <p className="text-gray-500 mb-6">View and manage your driving documents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-titeh-primary" />
                Driver's License
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <File className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Tap to view your driver's license</p>
                <Button>View Document</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-titeh-primary" />
                Vehicle Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <File className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Tap to view your vehicle registration</p>
                <Button>View Document</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-titeh-primary" />
                Insurance Certificate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <File className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Tap to view your insurance certificate</p>
                <Button>View Document</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-titeh-primary" />
                PUC Certificate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <File className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Tap to view your PUC certificate</p>
                <Button>View Document</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 mb-1">Important Notice</h3>
                <p className="text-sm text-amber-700">
                  Digital documents are valid for verification purposes in Telangana state. However, 
                  it's recommended to carry physical copies of your documents when traveling outside the state.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DocumentDisplay;
