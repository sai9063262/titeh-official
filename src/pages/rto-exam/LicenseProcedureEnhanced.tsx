
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Globe, Building, ListOrdered, FileText, AlertCircle, CheckSquare, CheckCircle } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  details: string[];
  isCompleted?: boolean;
}

const onlineSteps: Step[] = [
  {
    id: 1,
    title: "Register on Sarathi Portal",
    description: "Visit https://sarathi.parivahan.gov.in and create an account",
    details: [
      "Go to https://sarathi.parivahan.gov.in",
      "Select Telangana state",
      "Click on 'New User Registration'",
      "Create an account with your mobile number",
      "Verify with OTP sent to your mobile"
    ]
  },
  {
    id: 2,
    title: "Fill Form 4 (DL Application)",
    description: "Complete the online application form with personal details",
    details: [
      "Login to your Sarathi account",
      "Select 'Apply Online' and then 'New Driving License'",
      "Fill in personal details (name, date of birth, address)",
      "Upload a scanned copy of your signature",
      "Preview and confirm your application details"
    ]
  },
  {
    id: 3,
    title: "Upload Required Documents",
    description: "Submit digital copies of all necessary documents",
    details: [
      "Upload Aadhaar card for identity verification",
      "Upload address proof (Voter ID, utility bill, etc.)",
      "Upload passport-sized photograph (recent, white background)",
      "Upload medical certificate (Form 1A) if applying for transport license",
      "Ensure all documents are clear and in JPG/PDF format under 200KB"
    ]
  },
  {
    id: 4,
    title: "Pay Application Fee",
    description: "Pay ₹200 fee online for learner's license",
    details: [
      "Select payment option (credit/debit card, UPI, net banking)",
      "Pay the application fee of ₹200",
      "Save the payment receipt and note the application number",
      "Fee may vary based on license type and validity period",
      "Additional ₹50 may be charged for postal delivery"
    ]
  },
  {
    id: 5,
    title: "Schedule Learner's Test",
    description: "Book a slot for the computer-based test at the RTO",
    details: [
      "Login to Sarathi portal",
      "Select 'Book Slot' for learner's license test",
      "Choose your preferred RTO location in Telangana",
      "Select an available date and time slot",
      "Download the test appointment slip and carry it to the RTO"
    ]
  },
  {
    id: 6,
    title: "Appear for Learner's Test",
    description: "Take the computer-based test with 20 questions",
    details: [
      "Visit the RTO on the scheduled date and time",
      "Carry your original documents for verification",
      "Take the computer-based test (20 questions, 12 correct to pass)",
      "Results are usually displayed immediately after completion",
      "Learner's license is issued on passing the test"
    ]
  },
  {
    id: 7,
    title: "Apply for Permanent License",
    description: "Apply after 30 days of having a valid learner's license",
    details: [
      "Login to Sarathi portal after 30 days of getting learner's license",
      "Apply for permanent driving license",
      "Book a slot for driving test",
      "Pay the permanent license fee of ₹300",
      "Download the driving test appointment slip"
    ]
  },
  {
    id: 8,
    title: "Take the Driving Test",
    description: "Demonstrate driving skills at the RTO test track",
    details: [
      "Visit the RTO with your own or rented vehicle",
      "Perform driving tasks as instructed by the examiner",
      "Tasks include starting, stopping, parking, and navigating obstacles",
      "Results are typically shared on the same day",
      "License is issued if you pass the driving test"
    ]
  },
  {
    id: 9,
    title: "Receive Driving License",
    description: "Get your license by post or collect in person",
    details: [
      "License is usually sent to your address within 2-3 weeks",
      "Track the status on the Sarathi portal using your application number",
      "Alternatively, collect it in person from the RTO if selected",
      "Verify all details on the license upon receipt",
      "Valid for 20 years or until the age of 50, whichever is earlier"
    ]
  }
];

const offlineSteps: Step[] = [
  {
    id: 1,
    title: "Visit the nearest RTO office",
    description: "Find and visit your local RTO during working hours",
    details: [
      "Locate the nearest RTO office in your district (e.g., RTA WARANGAL)",
      "Visit during working hours (typically 10 AM to 5 PM, Monday to Saturday)",
      "Check holiday calendar before visiting",
      "Bring identification documents with you",
      "You may need to take a token number for your turn"
    ]
  },
  {
    id: 2,
    title: "Collect and Fill Forms",
    description: "Obtain Form 2 for learner's license and fill it completely",
    details: [
      "Collect Form 2 (Learner's License application) from the RTO counter",
      "Fill in all details accurately (name, address, vehicle category)",
      "Sign the form in the designated areas",
      "Have two passport-sized photographs ready",
      "Complete any additional forms if applying for transport vehicles"
    ]
  },
  {
    id: 3,
    title: "Submit Documents",
    description: "Submit application with all required documents",
    details: [
      "Submit filled Form 2 at the application counter",
      "Attach copies of Aadhaar card, address proof, and age proof",
      "Include original documents for verification",
      "Submit medical certificate (Form 1A) if required",
      "Ensure all photocopies are clear and legible"
    ]
  },
  {
    id: 4,
    title: "Pay Application Fee",
    description: "Pay the required fee at the designated counter",
    details: [
      "Pay ₹200 for learner's license at the fee counter",
      "Keep the receipt safely as proof of payment",
      "Fee may be higher for multiple vehicle categories",
      "Some RTOs may accept only cash payment",
      "Ask for a proper receipt with RTO stamp"
    ]
  },
  {
    id: 5,
    title: "Take Learner's Test",
    description: "Appear for the computer-based test at the RTO",
    details: [
      "Take the computerized test on traffic signs and rules",
      "Answer 20 multiple-choice questions",
      "Need at least 12 correct answers (60%) to pass",
      "Test is available in multiple languages including Telugu",
      "Results are usually declared immediately"
    ]
  },
  {
    id: 6,
    title: "Receive Learner's License",
    description: "Collect your learner's license after passing the test",
    details: [
      "Collect your learner's license from the counter if you pass",
      "Verify all details are correct before leaving",
      "Valid for 6 months from the date of issue",
      "Practice driving with a licensed driver during this period",
      "Keep it safe for applying for the permanent license"
    ]
  },
  {
    id: 7,
    title: "Apply for Permanent License",
    description: "Apply after 30 days of having a valid learner's license",
    details: [
      "Visit the RTO after 30 days of getting the learner's license",
      "Collect and fill Form 4 (Permanent License application)",
      "Submit learner's license, application form, and documents",
      "Pay the fee of ₹300 at the counter",
      "Book a slot for the driving test"
    ]
  },
  {
    id: 8,
    title: "Take the Driving Test",
    description: "Demonstrate driving skills to the RTO inspector",
    details: [
      "Bring your own or rented vehicle of the category applied for",
      "Report at the testing ground on the scheduled date and time",
      "Perform various driving maneuvers as instructed",
      "Common tests include figure-of-eight, parallel parking, etc.",
      "Examiner marks your performance on various parameters"
    ]
  },
  {
    id: 9,
    title: "Collect Permanent License",
    description: "Receive your driving license after passing the test",
    details: [
      "If you pass, your license is typically processed within a week",
      "Collect it in person from the RTO",
      "Verify all details on the license before leaving",
      "License is usually printed on a smart card",
      "Valid for 20 years or until the age of 50, whichever is earlier"
    ]
  }
];

const faqs = [
  {
    question: "What if I fail the learner's license test?",
    answer: "You can reapply after 7 days. There's no limit on the number of attempts, but you'll need to pay the application fee each time."
  },
  {
    question: "Can I apply for multiple vehicle categories in one application?",
    answer: "Yes, you can apply for multiple categories (e.g., motorcycle and car) in the same application by selecting all relevant options and paying the applicable fees."
  },
  {
    question: "Is the driving test difficult in Telangana?",
    answer: "The difficulty varies by RTO, but generally includes basic maneuvers like starting on an incline, figure-of-eight, parallel parking, and following traffic rules. Practice these skills during your learner's period."
  },
  {
    question: "What is the minimum age requirement for different licenses?",
    answer: "16 years for motorcycle without gear (<50cc), 18 years for motorcycles with gear and cars (non-transport), and 20 years for transport vehicles."
  },
  {
    question: "How long is my driving license valid?",
    answer: "A driving license is valid for 20 years or until you reach 50 years of age, whichever comes earlier. After 50, it needs renewal every 5 years."
  },
  {
    question: "Can I drive during the learner's license period?",
    answer: "Yes, but only when accompanied by a fully licensed driver with at least 1 year of experience, and you must display an 'L' sign on the vehicle."
  }
];

const LicenseProcedureEnhanced = () => {
  const [steps, setSteps] = useState<Step[]>(onlineSteps.map(step => ({ ...step, isCompleted: false })));
  const [activeTab, setActiveTab] = useState('online');
  
  // Toggle step completion status
  const toggleStepCompletion = (id: number) => {
    if (activeTab === 'online') {
      setSteps(steps.map(step => 
        step.id === id ? { ...step, isCompleted: !step.isCompleted } : step
      ));
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'online') {
      setSteps(onlineSteps.map(step => ({ ...step, isCompleted: false })));
    } else {
      setSteps(offlineSteps.map(step => ({ ...step, isCompleted: false })));
    }
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">License Procedure</h1>
        </div>
        
        <Tabs defaultValue="online" className="mb-6" onValueChange={handleTabChange}>
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
                {steps.map((step) => (
                  <li key={step.id} className="flex">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-titeh-primary text-white flex items-center justify-center mr-3">
                      {step.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium">{step.title}</h3>
                        {activeTab === 'online' && (
                          <button 
                            onClick={() => toggleStepCompletion(step.id)}
                            className="ml-2 text-gray-400 hover:text-titeh-primary"
                          >
                            <CheckSquare className={`h-5 w-5 ${step.isCompleted ? 'fill-titeh-primary text-titeh-primary' : ''}`} />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      
                      <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                        <ul className="text-sm space-y-1">
                          {step.details.map((detail, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-titeh-primary mr-2">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {step.id === 1 && (
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open('https://sarathi.parivahan.gov.in', '_blank')}>
                          <Globe className="mr-2 h-3 w-3" />
                          Visit Sarathi Website
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
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
                {steps.map((step) => (
                  <li key={step.id} className="flex">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-titeh-primary text-white flex items-center justify-center mr-3">
                      {step.id}
                    </div>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      
                      <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                        <ul className="text-sm space-y-1">
                          {step.details.map((detail, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-titeh-primary mr-2">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
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
            <li>Age Proof (Aadhaar Card, Birth Certificate, Passport)</li>
            <li>Address Proof (Voter ID, Electricity Bill, Passport)</li>
            <li>Identity Proof (Aadhaar Card, PAN Card, Voter ID)</li>
            <li>Medical Certificate (Form 1A) for transport license</li>
            <li>Passport size photographs (recent, white background)</li>
            <li>Form 2 (Learner's License application)</li>
            <li>Form 4 (Driving License application)</li>
          </ul>
          
          <Button variant="outline" size="sm" className="mt-4">
            Download Forms
          </Button>
        </Card>
        
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <AlertCircle className="text-titeh-primary mr-2" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                <h3 className="font-medium mb-1">{faq.question}</h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
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

export default LicenseProcedureEnhanced;
