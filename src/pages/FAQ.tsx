
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const faqCategories = [
    {
      category: "driving-license",
      title: "Driving License",
      questions: [
        {
          q: "What is the minimum age requirement for a driving license?",
          a: "The minimum age for a motorcycle without gear (below 50cc) is 16 years, while for motorcycles with gear and light motor vehicles, it is 18 years. For transport vehicles, the minimum age is 20 years."
        },
        {
          q: "What documents are required for a driving license?",
          a: "For a driving license, you need to submit: 1) Proof of address (Aadhaar, Utility bill, etc.), 2) Proof of age (Birth Certificate, Passport, etc.), 3) Recent passport-sized photographs, 4) Form 1A Medical Certificate (for commercial driving license), and 5) Learner's License."
        },
        {
          q: "How long is a driving license valid in India?",
          a: "A driving license is valid for 20 years or until the age of 50, whichever is earlier. After 50 years of age, the license needs to be renewed every 5 years."
        },
        {
          q: "How do I apply for an international driving permit?",
          a: "To apply for an International Driving Permit (IDP), visit your local RTO with your valid Indian driving license, proof of identity, proof of address, visa and travel documents, fee payment (around ₹1,000), and Form 4A. The IDP is typically valid for 1 year."
        },
        {
          q: "What is the difference between a Learner's License and a Permanent License?",
          a: "A Learner's License is a temporary license valid for 6 months that allows you to practice driving under the supervision of a licensed driver. A Permanent License is issued after passing a driving test and allows you to drive independently."
        }
      ]
    },
    {
      category: "vehicle-registration",
      title: "Vehicle Registration",
      questions: [
        {
          q: "How do I transfer vehicle ownership?",
          a: "To transfer vehicle ownership, submit Form 29 (notice of transfer) and Form 30 (report of transfer) to the RTO, along with the original Registration Certificate, insurance certificate, and a transfer fee. Both buyer and seller should be present, or the seller can provide a No Objection Certificate."
        },
        {
          q: "What is the validity of a vehicle registration?",
          a: "For non-transport vehicles (private vehicles), registration is valid for 15 years from the date of initial registration. For transport vehicles, the registration is valid for a period as specified by the registering authority."
        },
        {
          q: "How can I get a duplicate RC if the original is lost?",
          a: "To get a duplicate RC, submit Form 26 at your RTO along with an FIR copy for the lost RC, proof of identity, proof of address, and the requisite fee. You may also need to provide the original insurance certificate and tax payment receipts."
        },
        {
          q: "What is hypothecation in vehicle registration?",
          a: "Hypothecation refers to a condition where the ownership of the vehicle is pledged to a financial institution or bank until the loan taken for the vehicle is fully repaid. It is marked on the RC as 'With Bank/Financial Institution Name'."
        },
        {
          q: "How do I remove hypothecation after loan repayment?",
          a: "After fully repaying your vehicle loan, obtain a No Objection Certificate (NOC) from the bank/financial institution. Submit Form 35 along with the NOC, original RC, and fee payment at the RTO to remove the hypothecation."
        }
      ]
    },
    {
      category: "permits",
      title: "Permits & Licenses",
      questions: [
        {
          q: "What is a National Permit and who needs it?",
          a: "A National Permit allows transport vehicles to operate across multiple states in India. It is required for commercial vehicles like trucks and buses that operate interstate. The permit is issued by the State Transport Authority and is valid for a specified period, typically 5 years."
        },
        {
          q: "How do I apply for a tourist permit for my vehicle?",
          a: "To apply for a tourist permit, submit Form 45 along with proof of vehicle registration, insurance certificate, tax payment receipts, and the required fee to your Regional Transport Office. The vehicle must meet specific criteria including seating capacity and amenities."
        },
        {
          q: "What is the difference between All India Tourist Permit and National Permit?",
          a: "An All India Tourist Permit is specifically for vehicles engaged in tourist activities, allowing them to operate across states. A National Permit is for goods carriers/commercial vehicles to transport goods across states. Both permits have different fee structures and compliance requirements."
        }
      ]
    },
    {
      category: "e-challan",
      title: "E-Challan & Fines",
      questions: [
        {
          q: "How can I check if I have pending e-challans?",
          a: "You can check pending e-challans by visiting the Parivahan Sewa website, using the mParivahan mobile app, or checking the e-challan official portal. Enter your vehicle registration number or driving license number to view any pending challans."
        },
        {
          q: "What happens if I don't pay an e-challan?",
          a: "Non-payment of e-challans can lead to increased penalties, refusal of RTO services (like license renewal or vehicle re-registration), and in severe cases, legal action including court summons or vehicle impoundment."
        },
        {
          q: "How can I contest an e-challan if I believe it was issued incorrectly?",
          a: "To contest an e-challan, visit the local traffic police station mentioned on the challan with supporting evidence (like CCTV footage request, photographs, or witness statements). You may need to fill a formal appeal form. Alternatively, some jurisdictions allow online appeals through their e-challan portal."
        }
      ]
    },
    {
      category: "technical",
      title: "Technical Support",
      questions: [
        {
          q: "How do I reset my Parivahan Sewa password?",
          a: "To reset your Parivahan Sewa password, click on 'Forgot Password' on the login page, enter your registered mobile number or email, verify using the OTP sent, and then create a new password."
        },
        {
          q: "Why am I not receiving the OTP for login?",
          a: "If you're not receiving OTPs, check if your mobile number is correctly registered, ensure you have network coverage, check your SMS inbox isn't full, verify the number isn't on DND, or try after some time as there might be system delays."
        },
        {
          q: "How can I update my mobile number in the Parivahan system?",
          a: "To update your mobile number, visit your local RTO with your identity proof, address proof, and a written application requesting the change. Some RTOs also offer this service online through the Parivahan portal."
        }
      ]
    }
  ];
  
  // Filter FAQs based on search query
  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Frequently Asked Questions</h1>
        
        {/* Search Box */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              className="pl-10"
              placeholder="Search FAQs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>
        
        {/* FAQ Categories */}
        {searchQuery ? (
          <div className="space-y-6">
            {filteredFAQs.map((category) => (
              <div key={category.category}>
                <h2 className="text-lg font-semibold mb-3">{category.title}</h2>
                <Accordion type="single" collapsible className="mb-6">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.category}-${index}`}>
                      <AccordionTrigger>{faq.q}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">{faq.a}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
            {filteredFAQs.length === 0 && (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No FAQs matching your search were found.</p>
              </Card>
            )}
          </div>
        ) : (
          <Tabs defaultValue="driving-license">
            <TabsList className="w-full mb-6">
              {faqCategories.map((category) => (
                <TabsTrigger 
                  key={category.category} 
                  value={category.category}
                  className="flex-1"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {faqCategories.map((category) => (
              <TabsContent key={category.category} value={category.category}>
                <Accordion type="single" collapsible className="mb-6">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.category}-${index}`}>
                      <AccordionTrigger>{faq.q}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">{faq.a}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        )}
        
        <Card className="p-4 bg-blue-50">
          <h3 className="font-medium mb-2">Didn't find what you're looking for?</h3>
          <p className="text-sm text-gray-600 mb-3">Contact our support team for assistance with any questions not covered in the FAQ.</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Helpline:</span>
            <a href="tel:1800-123-4567" className="text-titeh-primary hover:underline">1800-123-4567</a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Email:</span>
            <a href="mailto:support@titeh.gov.in" className="text-titeh-primary hover:underline">support@titeh.gov.in</a>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default FAQ;
