
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, Activity, Calendar, AreaChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Dashboard</h1>

        <Tabs defaultValue="telangana" className="mb-8">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="telangana" className="flex-1">Telangana</TabsTrigger>
            <TabsTrigger value="national" className="flex-1">National</TabsTrigger>
          </TabsList>
          
          <TabsContent value="telangana">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-titeh-primary" />
                    <span>New DLs Issued</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 px-4">
                  <div className="text-2xl font-bold mb-1">2,453</div>
                  <div className="text-xs text-green-600 flex items-center">
                    +15% from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-titeh-primary" />
                    <span>Vehicles Registered</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 px-4">
                  <div className="text-2xl font-bold mb-1">5,872</div>
                  <div className="text-xs text-green-600 flex items-center">
                    +8% from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-titeh-primary" />
                    <span>E-Challans Issued</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 px-4">
                  <div className="text-2xl font-bold mb-1">12,845</div>
                  <div className="text-xs text-red-600 flex items-center">
                    +23% from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-titeh-primary" />
                    <span>Online Services Used</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 px-4">
                  <div className="text-2xl font-bold mb-1">28,567</div>
                  <div className="text-xs text-green-600 flex items-center">
                    +32% from last month
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-titeh-primary" />
                    <span>Vehicle Registrations by Type</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500 text-sm">Chart visualization will appear here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-titeh-primary" />
                    <span>Monthly Service Usage Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500 text-sm">Chart visualization will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-titeh-primary" />
                    <span>E-Challans by Violation Type</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500 text-sm">Chart visualization will appear here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AreaChart className="h-4 w-4 text-titeh-primary" />
                    <span>Traffic Density by Hour</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500 text-sm">Chart visualization will appear here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-titeh-primary" />
                    <span>Accident Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500 text-sm">Chart visualization will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="national">
            <div className="flex items-center justify-center p-12 bg-gray-50 rounded-md">
              <p className="text-gray-500">National data will be available soon</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <Card className="p-4 bg-blue-50 mb-6">
          <h3 className="font-medium mb-2">Key Contributions and Growth</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Digitization of 95% of transport services in Telangana</li>
            <li>Reduction in waiting time for DL services by 60%</li>
            <li>Over 2 million online transactions processed in the last quarter</li>
            <li>Successfully integrated with Central Motor Vehicles database</li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
