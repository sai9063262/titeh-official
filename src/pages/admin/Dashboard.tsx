
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, Line, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from "recharts";
import { 
  Car, TrendingUp, Map, Shield, Users, Calendar, 
  AlertTriangle, CheckCircle, RefreshCw, Clock, Info
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

// Sample data for charts
const trafficData = [
  { name: "Mon", cars: 150, trucks: 35, bikes: 90 },
  { name: "Tue", cars: 200, trucks: 40, bikes: 120 },
  { name: "Wed", cars: 250, trucks: 45, bikes: 140 },
  { name: "Thu", cars: 180, trucks: 40, bikes: 100 },
  { name: "Fri", cars: 300, trucks: 55, bikes: 160 },
  { name: "Sat", cars: 250, trucks: 30, bikes: 190 },
  { name: "Sun", cars: 170, trucks: 25, bikes: 150 }
];

const driverStatusData = [
  { name: "Valid", value: 850, color: "#4ade80" },
  { name: "Expired", value: 120, color: "#fb923c" },
  { name: "Suspended", value: 30, color: "#f87171" }
];

const incidentData = [
  { name: "Jan", accidents: 12, violations: 85 },
  { name: "Feb", accidents: 15, violations: 78 },
  { name: "Mar", accidents: 8, violations: 93 },
  { name: "Apr", accidents: 10, violations: 65 },
  { name: "May", accidents: 6, violations: 72 },
  { name: "Jun", accidents: 9, violations: 80 }
];

// Sample recent activities
const recentActivities = [
  { id: 1, action: "Driver license verified", user: "Traffic Officer A123", time: "10 minutes ago", status: "success" },
  { id: 2, action: "Challan payment received", user: "Parivahan System", time: "25 minutes ago", status: "success" },
  { id: 3, action: "Failed verification attempt", user: "Unknown User", time: "1 hour ago", status: "error" },
  { id: 4, action: "Breaking news published", user: "Admin User", time: "2 hours ago", status: "info" },
  { id: 5, action: "System alert sent", user: "System", time: "3 hours ago", status: "info" }
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDrivers: 1000,
    activeUsers: 325,
    verificationToday: 48,
    challansCollected: 28000
  });
  
  useEffect(() => {
    // Simulate fetching dashboard data
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    // Setup real-time listener for stats updates
    const channel = supabase
      .channel('dashboard_updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'drivers' 
      }, (payload) => {
        // In a real implementation, you would refresh stats
        console.log('Drivers table changed:', payload);
        // fetchDashboardData();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-titeh-primary">Admin Dashboard</h1>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="h-12 w-12 text-titeh-primary animate-spin mb-4" />
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Drivers</p>
                      <p className="text-3xl font-bold">{stats.totalDrivers.toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        +5% from last month
                      </p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Active Users</p>
                      <p className="text-3xl font-bold">{stats.activeUsers}</p>
                      <p className="text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        +12% from yesterday
                      </p>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Verifications Today</p>
                      <p className="text-3xl font-bold">{stats.verificationToday}</p>
                      <p className="text-xs text-amber-600 mt-1">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        Same as yesterday
                      </p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Challans Collected</p>
                      <p className="text-3xl font-bold">₹{stats.challansCollected.toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        +18% from last week
                      </p>
                    </div>
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Calendar className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Analysis</CardTitle>
                  <CardDescription>Daily vehicle count for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="cars" name="Cars" fill="#3b82f6" />
                        <Bar dataKey="trucks" name="Trucks" fill="#6366f1" />
                        <Bar dataKey="bikes" name="Bikes" fill="#a855f7" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Incident Reports</CardTitle>
                  <CardDescription>Monthly incidents and violations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={incidentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="accidents" name="Accidents" stroke="#f87171" strokeWidth={2} />
                        <Line type="monotone" dataKey="violations" name="Traffic Violations" stroke="#fb923c" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Driver License Status</CardTitle>
                  <CardDescription>Distribution of license statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={driverStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {driverStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest system activities and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-72 overflow-y-auto pr-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentActivities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell>{activity.action}</TableCell>
                            <TableCell className="text-sm">{activity.user}</TableCell>
                            <TableCell className="text-sm text-gray-500">{activity.time}</TableCell>
                            <TableCell>
                              {activity.status === "success" ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : activity.status === "error" ? (
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                              ) : (
                                <Info className="h-5 w-5 text-blue-500" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800">System Health: Excellent</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    All systems are operational with 99.9% uptime over the past 30 days. 
                    Last database backup completed 4 hours ago.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
