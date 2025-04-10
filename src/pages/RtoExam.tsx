
import Layout from "@/components/Layout";
import { School, BookOpen, FileText, PlayCircle, Store, FileType, Building, ListChecks, Gavel } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const RtoExam = () => {
  const examItems = [
    { icon: <School className="text-titeh-primary text-xl" />, label: "Practice Driving Licence Exam", link: "/rto-exam/practice" },
    { icon: <BookOpen className="text-titeh-primary text-xl" />, label: "Question Bank", link: "/rto-exam/questions" },
    { icon: <FileText className="text-titeh-primary text-xl" />, label: "DL Que. & Sign", link: "/traffic-signs" },
    { icon: <PlayCircle className="text-titeh-primary text-xl" />, label: "Exam Preparation", link: "/rto-exam/preparation" },
    { icon: <Store className="text-titeh-primary text-xl" />, label: "Driving Schools", link: "/rto-exam/schools" },
    { icon: <FileType className="text-titeh-primary text-xl" />, label: "License Procedure", link: "/rto-exam/license-procedure" },
    { icon: <Building className="text-titeh-primary text-xl" />, label: "RTO Offices", link: "/rto-exam/offices" },
    { icon: <ListChecks className="text-titeh-primary text-xl" />, label: "Valid Document List", link: "/rto-exam/documents" },
    { icon: <Gavel className="text-titeh-primary text-xl" />, label: "Driving Laws", link: "/rto-exam/laws" },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">RTO Exam & Learning</h1>
        
        <div className="space-y-4">
          {examItems.map((item, index) => (
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
      </div>
    </Layout>
  );
};

export default RtoExam;
