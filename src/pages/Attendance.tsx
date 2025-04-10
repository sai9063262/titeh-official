
import { useState } from "react";
import Layout from "@/components/Layout";
import { Bluetooth, User, Save, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const { toast } = useToast();

  const scanRFID = () => {
    // Simulate RFID scan with sample data
    const sampleData = {
      type: 'attendance',
      policeName: 'John Doe',
      inTime: new Date().toISOString(),
      rfidTag: '12345678',
      location: 'HYDERABAD',
      department: 'Traffic'
    };
    
    setAttendanceData(sampleData);
    
    toast({
      title: "RFID Scanned",
      description: "Attendance data received successfully",
      variant: "default",
    });
  };

  const saveAttendance = () => {
    if (attendanceData) {
      // Save to localStorage
      const savedAttendances = JSON.parse(localStorage.getItem('attendances') || '[]');
      savedAttendances.push(attendanceData);
      localStorage.setItem('attendances', JSON.stringify(savedAttendances));
      
      toast({
        title: "Attendance Saved",
        description: "Data stored successfully",
        variant: "default",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Attendance Tracking</h1>
        
        <div className="mb-6">
          <Button onClick={scanRFID} className="mb-4 bg-titeh-primary hover:bg-blue-600">
            <Bluetooth className="mr-2 h-4 w-4" />
            Scan RFID
          </Button>
          
          {attendanceData && (
            <Card className="p-4 mb-4">
              <div className="flex items-start">
                <User className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">{attendanceData.policeName}</h3>
                  <p className="text-sm text-gray-600">In Time: {new Date(attendanceData.inTime).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Location: {attendanceData.location}</p>
                  <p className="text-sm text-gray-600">Department: {attendanceData.department}</p>
                  <p className="text-sm text-gray-600">RFID Tag: {attendanceData.rfidTag}</p>
                </div>
              </div>
            </Card>
          )}
          
          {attendanceData && (
            <Button onClick={saveAttendance} className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />
              Save Attendance
            </Button>
          )}
        </div>
        
        <Card className="p-4 bg-blue-50">
          <div className="flex items-start">
            <Clock className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Daily Calculation</h3>
              <p className="text-sm text-gray-600 mb-2">Track attendance hours and generate reports.</p>
              <Button variant="outline" size="sm" disabled>View History</Button>
            </div>
          </div>
        </Card>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600 italic">Note: Full ESP32 Bluetooth integration requires a custom backend API; simulated for now.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
