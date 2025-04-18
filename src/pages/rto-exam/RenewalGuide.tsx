
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  ChevronLeft, 
  FileCheck, 
  CheckCircle, 
  Clock, 
  Calendar,
  Wallet,
  PenTool,
  Building,
  Printer,
  Download,
  Upload,
  CreditCard,
  User,
  CheckSquare,
  AlertTriangle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const RenewalGuide = () => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
    6: false
  });
  
  // Calculate progress percentage
  const totalSteps = 6;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  // Toggle step completion
  const toggleStepCompletion = (stepNumber: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">License Renewal Guide</h1>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Renewal Process Tracker</h2>
              <p className="text-sm text-gray-600">
                Step-by-step guide for renewing your driving license in Telangana.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-sm mr-2">Progress:</span>
              <span className="font-medium">{completedCount}/{totalSteps} Steps</span>
            </div>
          </div>

          <div className="mb-6">
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="space-y-4">
            {/* Step 1: Check Eligibility */}
            <div className={`p-4 border rounded-md ${completedSteps[1] ? 'bg-green-50 border-green-200' : ''}`}>
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 w-6 p-0 rounded-full ${completedSteps[1] ? 'bg-green-500 text-white hover:bg-green-600' : 'border border-gray-300'}`}
                    onClick={() => toggleStepCompletion(1)}
                  >
                    {completedSteps[1] ? <CheckCircle className="h-4 w-4" /> : <span>1</span>}
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium flex items-center">
                    Check Eligibility 
                    <Badge className="ml-2 bg-green-100 text-green-800">Required</Badge>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    Verify if your license is eligible for renewal. Licenses can be renewed up to 
                    1 year before expiry or within 5 years after expiry.
                  </p>
                  <div className="text-sm bg-gray-50 p-3 rounded-md">
                    <div className="flex items-start mb-1">
                      <Clock className="h-4 w-4 text-titeh-primary mr-2 mt-0.5" />
                      <span>Optimal renewal period: 30-60 days before expiry</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span>Driving with an expired license may result in fines up to ₹10,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Gather Documents */}
            <div className={`p-4 border rounded-md ${completedSteps[2] ? 'bg-green-50 border-green-200' : ''}`}>
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 w-6 p-0 rounded-full ${completedSteps[2] ? 'bg-green-500 text-white hover:bg-green-600' : 'border border-gray-300'}`}
                    onClick={() => toggleStepCompletion(2)}
                  >
                    {completedSteps[2] ? <CheckCircle className="h-4 w-4" /> : <span>2</span>}
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium flex items-center">
                    Gather Required Documents
                    <Badge className="ml-2 bg-green-100 text-green-800">Required</Badge>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    Collect all necessary documents for license renewal.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-start bg-gray-50 p-3 rounded-md">
                      <FileCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Original License</span>
                        <p className="text-xs text-gray-600">Current driving license</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-gray-50 p-3 rounded-md">
                      <User className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">ID Proof</span>
                        <p className="text-xs text-gray-600">Aadhaar, PAN, or Passport</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-gray-50 p-3 rounded-md">
                      <Building className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Address Proof</span>
                        <p className="text-xs text-gray-600">Utility bill, Aadhaar, etc.</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-gray-50 p-3 rounded-md">
                      <User className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Photographs</span>
                        <p className="text-xs text-gray-600">2 passport-sized photos</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    <Printer className="h-3 w-3 mr-1" />
                    Print Checklist
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 3: Online Application */}
            <div className={`p-4 border rounded-md ${completedSteps[3] ? 'bg-green-50 border-green-200' : ''}`}>
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 w-6 p-0 rounded-full ${completedSteps[3] ? 'bg-green-500 text-white hover:bg-green-600' : 'border border-gray-300'}`}
                    onClick={() => toggleStepCompletion(3)}
                  >
                    {completedSteps[3] ? <CheckCircle className="h-4 w-4" /> : <span>3</span>}
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium flex items-center">
                    Submit Online Application
                    <Badge className="ml-2 bg-green-100 text-green-800">Required</Badge>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    Fill and submit the renewal application form on the Telangana Transport Department website.
                  </p>
                  <div className="text-sm bg-gray-50 p-3 rounded-md mb-3">
                    <div className="flex items-start mb-2">
                      <Upload className="h-4 w-4 text-titeh-primary mr-2 mt-0.5" />
                      <span>Upload scanned copies of all required documents</span>
                    </div>
                    <div className="flex items-start">
                      <PenTool className="h-4 w-4 text-titeh-primary mr-2 mt-0.5" />
                      <span>Fill form accurately - errors may delay processing</span>
                    </div>
                  </div>
                  <Button 
                    className="text-sm bg-titeh-primary hover:bg-blue-600"
                  >
                    Go to Transport Department Website
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 4: Fee Payment */}
            <div className={`p-4 border rounded-md ${completedSteps[4] ? 'bg-green-50 border-green-200' : ''}`}>
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 w-6 p-0 rounded-full ${completedSteps[4] ? 'bg-green-500 text-white hover:bg-green-600' : 'border border-gray-300'}`}
                    onClick={() => toggleStepCompletion(4)}
                  >
                    {completedSteps[4] ? <CheckCircle className="h-4 w-4" /> : <span>4</span>}
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium flex items-center">
                    Pay Renewal Fee
                    <Badge className="ml-2 bg-green-100 text-green-800">Required</Badge>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    Pay the license renewal fee online or at the RTO office.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-start bg-gray-50 p-3 rounded-md">
                      <Wallet className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Two-wheeler License</span>
                        <p className="text-xs text-gray-600">₹200 for 5-year renewal</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-gray-50 p-3 rounded-md">
                      <Wallet className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Four-wheeler License</span>
                        <p className="text-xs text-gray-600">₹250 for 5-year renewal</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-gray-50 p-3 rounded-md">
                      <Wallet className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Commercial License</span>
                        <p className="text-xs text-gray-600">₹300 for 5-year renewal</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-gray-50 p-3 rounded-md">
                      <CreditCard className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Payment Methods</span>
                        <p className="text-xs text-gray-600">Debit/Credit card, UPI, NetBanking</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Visit RTO */}
            <div className={`p-4 border rounded-md ${completedSteps[5] ? 'bg-green-50 border-green-200' : ''}`}>
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 w-6 p-0 rounded-full ${completedSteps[5] ? 'bg-green-500 text-white hover:bg-green-600' : 'border border-gray-300'}`}
                    onClick={() => toggleStepCompletion(5)}
                  >
                    {completedSteps[5] ? <CheckCircle className="h-4 w-4" /> : <span>5</span>}
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium flex items-center">
                    Visit RTO Office
                    <Badge className="ml-2 bg-amber-100 text-amber-800">Conditional</Badge>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    Visit the RTO office with original documents if required. Some renewals can be processed entirely online.
                  </p>
                  <div className="text-sm bg-gray-50 p-3 rounded-md mb-3">
                    <div className="flex items-start mb-2">
                      <Calendar className="h-4 w-4 text-titeh-primary mr-2 mt-0.5" />
                      <span>Book an appointment online to avoid waiting</span>
                    </div>
                    <div className="flex items-start">
                      <CheckSquare className="h-4 w-4 text-titeh-primary mr-2 mt-0.5" />
                      <span>Carry all original documents and application printout</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Book RTO Appointment
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 6: Receive License */}
            <div className={`p-4 border rounded-md ${completedSteps[6] ? 'bg-green-50 border-green-200' : ''}`}>
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 w-6 p-0 rounded-full ${completedSteps[6] ? 'bg-green-500 text-white hover:bg-green-600' : 'border border-gray-300'}`}
                    onClick={() => toggleStepCompletion(6)}
                  >
                    {completedSteps[6] ? <CheckCircle className="h-4 w-4" /> : <span>6</span>}
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium flex items-center">
                    Receive Renewed License
                    <Badge className="ml-2 bg-green-100 text-green-800">Required</Badge>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    Receive your renewed license by mail or collect it from the RTO office.
                  </p>
                  <div className="text-sm bg-gray-50 p-3 rounded-md">
                    <div className="flex items-start mb-2">
                      <Download className="h-4 w-4 text-titeh-primary mr-2 mt-0.5" />
                      <span>Download e-copy of license while physical card is processed</span>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 text-titeh-primary mr-2 mt-0.5" />
                      <span>Physical license typically arrives within 7-14 working days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>

        <Card className="p-6 mb-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What happens if my license has expired?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600 mb-2">
                  If your license has expired, you can still renew it with additional steps:
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Within 5 years of expiry: Pay a late fee (typically ₹300 to ₹1,000 depending on delay)</li>
                  <li>More than 5 years after expiry: You may need to retake the driving test</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  Driving with an expired license can result in fines up to ₹10,000 under the Motor Vehicles Act.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I renew my license online completely?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  Yes, Telangana offers a complete online renewal process for many cases. You can apply, 
                  upload documents, pay fees, and receive an e-license online. However, in some situations 
                  (like if your license expired more than 1 year ago or if you're changing address), 
                  you may need to visit the RTO office for biometric verification or document checks.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How long is the renewed license valid?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  Standard driving licenses in Telangana are renewed for 20 years or until the holder turns 
                  50 years of age, whichever is earlier. For applicants over 50, the license is valid for 
                  5 years at a time. Commercial driving licenses are typically renewed for 3 years.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Do I need a medical certificate for renewal?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  A medical certificate is required for license renewal if:
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 mt-2">
                  <li>You are above 40 years of age</li>
                  <li>You hold a commercial driving license</li>
                  <li>You have certain medical conditions that may affect driving ability</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  The certificate must be issued by a registered medical practitioner and should not be 
                  older than 1 month from the date of application.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Can I track my license renewal status?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  Yes, you can track your license renewal application status on the Telangana Transport 
                  Department website using your application number. You can also check status through 
                  the Parivahan Sewa portal or by using the mParivahan mobile app. SMS updates are sent 
                  to your registered mobile number at key stages of the renewal process.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <div className="flex items-start">
            <FileCheck className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">RTO Contact Information</h3>
              <p className="text-sm text-gray-600 mt-1">
                If you need assistance with your license renewal, contact your nearest Telangana RTO office:
              </p>
              <Separator className="my-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">Hyderabad RTO Office</h4>
                  <p className="text-xs text-gray-600">Khairatabad, Hyderabad</p>
                  <p className="text-xs text-gray-600">Phone: 040-23261088</p>
                  <p className="text-xs text-gray-600">Hours: Mon-Sat, 10:00 AM to 5:30 PM</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Secunderabad RTO Office</h4>
                  <p className="text-xs text-gray-600">Secunderabad</p>
                  <p className="text-xs text-gray-600">Phone: 040-27733349</p>
                  <p className="text-xs text-gray-600">Hours: Mon-Sat, 10:00 AM to 5:30 PM</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Warangal RTO Office</h4>
                  <p className="text-xs text-gray-600">Hanamkonda, Warangal</p>
                  <p className="text-xs text-gray-600">Phone: 0870-2566064</p>
                  <p className="text-xs text-gray-600">Hours: Mon-Sat, 10:00 AM to 5:30 PM</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Nizamabad RTO Office</h4>
                  <p className="text-xs text-gray-600">Nizamabad</p>
                  <p className="text-xs text-gray-600">Phone: 08462-224501</p>
                  <p className="text-xs text-gray-600">Hours: Mon-Sat, 10:00 AM to 5:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default RenewalGuide;
