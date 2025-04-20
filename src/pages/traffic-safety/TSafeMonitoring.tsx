
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MapPin, Calendar, Clock, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TSafeMonitoring = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-titeh-primary mb-2">T-Safe Monitoring</h1>
          <p className="text-gray-500 mb-6">Real-time traffic safety alerts and notifications</p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Active Alerts</h2>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Manage Notifications
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-red-800">Heavy Traffic Alert</h3>
                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-100">High Priority</Badge>
                  </div>
                  <p className="text-sm text-red-700 mt-1">Major congestion on NH-44 between Shamshabad and Aramghar Junction. Expect 25-30 minute delays.</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-red-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> NH-44
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Today
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 10:30 AM
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-full">
                  <ShieldAlert className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-amber-800">Weather Warning</h3>
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-100">Moderate</Badge>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">Heavy rainfall expected in Hyderabad and surrounding areas. Drive with caution and reduce speed.</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-amber-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Hyderabad
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Today
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 09:15 AM
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">Routine Speed Check</h3>
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Info</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Speed cameras active on ORR between Gachibowli and Shamshabad exits. Speed limit 100 km/h.</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> ORR
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Today
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 08:00 AM
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-lg font-medium mt-8">Recent Notifications</h2>
        <div className="space-y-3">
          <div className="p-3 border rounded-lg flex items-start gap-3">
            <div className="bg-green-100 p-1.5 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Road construction completed on Begumpet Main Road</p>
              <p className="text-xs text-gray-500">Yesterday, 3:45 PM</p>
            </div>
          </div>

          <div className="p-3 border rounded-lg flex items-start gap-3">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <Bell className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">New traffic signal installed at Kukatpally Housing Board Junction</p>
              <p className="text-xs text-gray-500">Yesterday, 1:30 PM</p>
            </div>
          </div>

          <div className="p-3 border rounded-lg flex items-start gap-3">
            <div className="bg-amber-100 p-1.5 rounded-full">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Temporary road closure on Tank Bund for event preparation</p>
              <p className="text-xs text-gray-500">Mar 15, 9:00 AM</p>
            </div>
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Monitoring Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Proximity Alerts</h3>
                  <p className="text-sm text-gray-500">Notify about events within 5km radius</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Alert Types</h3>
                  <p className="text-sm text-gray-500">Manage which types of alerts you receive</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Notification Schedule</h3>
                  <p className="text-sm text-gray-500">Set quiet hours and priority times</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TSafeMonitoring;
