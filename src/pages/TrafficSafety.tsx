
import Layout from "@/components/Layout";
import { CreditCard, FileText, Gauge, Shield, Mic, Image } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const TrafficSafety = () => {
  const safetyItems = [
    { icon: <CreditCard className="text-titeh-primary text-xl" />, label: "Pay Challan", link: "/traffic-safety/pay-challan" },
    { icon: <FileText className="text-titeh-primary text-xl" />, label: "Incident Reporting", link: "/traffic-safety/incident" },
    { icon: <Gauge className="text-titeh-primary text-xl" />, label: "Speedometer & Black Spot Alerts", link: "/traffic-safety/alerts" },
    { icon: <Shield className="text-titeh-primary text-xl" />, label: "T-Safe Monitoring", link: "/traffic-safety/monitoring" },
    { icon: <Mic className="text-titeh-primary text-xl" />, label: "Voice/Mobile Complaint", link: "/traffic-safety/complaint" },
    { icon: <Image className="text-titeh-primary text-xl" />, label: "Driver Document Display", link: "/traffic-safety/documents" },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Traffic Enforcement & Safety</h1>
        
        <div className="space-y-4 mb-8">
          {safetyItems.map((item, index) => (
            <Link to={item.link} key={index}>
              <Card className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="mr-4 w-8">{item.icon}</div>
                  <span className="font-medium">{item.label}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        <Card className="p-4 bg-blue-50">
          <h2 className="font-semibold mb-2">Future Enhancements</h2>
          <p className="text-sm text-gray-600">Support for AI traffic prediction and digital FIR filing to be added later.</p>
        </Card>
      </div>
    </Layout>
  );
};

export default TrafficSafety;
