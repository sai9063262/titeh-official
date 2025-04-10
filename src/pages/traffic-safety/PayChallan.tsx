
import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, CreditCard, Search, Clock, AlertTriangle, FileText, Check, Download, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  challanNumber: z.string().min(6, "Challan number must be at least 6 characters"),
  vehicleNumber: z.string().min(6, "Vehicle number must be at least 6 characters"),
});

const PayChallan = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [penalty, setPenalty] = useState({ 
    base: 1000, 
    lateFee: 20, 
    gst: 36, 
    total: 1056 
  });
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      challanNumber: "",
      vehicleNumber: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Simulate API call
    setTimeout(() => {
      setSearchResults({
        challanNumber: values.challanNumber,
        vehicleNumber: values.vehicleNumber,
        violationType: "Speeding (60 km/h in 50 km/h zone)",
        dateOfViolation: "2025-04-01",
        location: "NH-44, Hyderabad",
        amount: 1000,
        status: "Unpaid",
        dueDate: "2025-04-15",
      });

      setPenalty({
        base: 1000,
        lateFee: 20,
        gst: 36,
        total: 1056
      });

      toast({
        title: "Challan Found",
        description: "Found challan details for your vehicle",
      });
    }, 1000);
  };

  const handlePayment = () => {
    toast({
      title: "Payment Successful",
      description: `Paid ₹${penalty.total} for challan ${searchResults?.challanNumber}`,
      variant: "default",
    });

    setSearchResults(prev => prev ? { ...prev, status: "Paid" } : null);
  };

  const calculateLateFee = () => {
    const baseAmount = 1000;
    const lateFee = 20; // 2% of 1000
    const gst = Math.round((baseAmount + lateFee) * 0.03); // 3% GST
    const total = baseAmount + lateFee + gst;
    
    setPenalty({
      base: baseAmount,
      lateFee,
      gst,
      total
    });

    toast({
      title: "Fee Calculated",
      description: `Total amount: ₹${total} including late fee and GST`,
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/traffic-safety" className="mr-4">
            <ArrowLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Pay Traffic Challan</h1>
        </div>

        <Tabs defaultValue="search" className="mb-8">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="search">Search Challan</TabsTrigger>
            <TabsTrigger value="calculator">Penalty Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Find Challan</CardTitle>
                <CardDescription>
                  Enter challan or vehicle number to find pending challans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="challanNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Challan Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., TG1234567890" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the challan reference number if available
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="text-center my-2">OR</div>

                    <FormField
                      control={form.control}
                      name="vehicleNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., TG05AB1234" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your complete vehicle registration number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-titeh-primary hover:bg-blue-600"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Search Challan
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col items-start text-xs text-gray-500">
                <p className="mb-1 flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  Receive instant results for challans issued in Telangana
                </p>
                <a 
                  href="https://parivahan.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-titeh-primary hover:underline"
                >
                  Check on Parivahan Portal
                </a>
              </CardFooter>
            </Card>

            {searchResults && (
              <Card className={searchResults.status === "Paid" ? "bg-green-50" : "bg-amber-50"}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>Challan Details</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      searchResults.status === "Paid" ? "bg-green-200 text-green-800" : "bg-amber-200 text-amber-800"
                    }`}>
                      {searchResults.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Challan Number</p>
                      <p className="font-medium">{searchResults.challanNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Vehicle Number</p>
                      <p className="font-medium">{searchResults.vehicleNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Violation Type</p>
                      <p className="font-medium">{searchResults.violationType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date of Violation</p>
                      <p className="font-medium">{searchResults.dateOfViolation}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium">{searchResults.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className="font-medium">{searchResults.dueDate}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Amount</p>
                      <div className="font-medium">
                        <div className="flex justify-between">
                          <span>Base Amount:</span>
                          <span>₹{penalty.base}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Late Fee (2%):</span>
                          <span>₹{penalty.lateFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST (3%):</span>
                          <span>₹{penalty.gst}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t mt-1 pt-1">
                          <span>Total:</span>
                          <span>₹{penalty.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {searchResults.status === "Unpaid" ? (
                    <Button 
                      className="w-full bg-titeh-primary hover:bg-blue-600"
                      onClick={handlePayment}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay Now ₹{penalty.total}
                    </Button>
                  ) : (
                    <div className="flex space-x-4">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          toast({
                            title: "Receipt Downloaded",
                            description: "E-receipt has been downloaded to your device",
                          });
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Receipt
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSearchResults(null);
                          form.reset();
                        }}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        New Search
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="w-full text-sm">
                    <div className="flex items-start mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <p>Non-payment of challans may result in additional penalties and vehicle detention during enforcement drives.</p>
                    </div>
                    <a 
                      href="https://transport.telangana.gov.in" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-titeh-primary hover:underline text-xs"
                    >
                      Telangana Transport Guidelines
                    </a>
                  </div>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Penalty Calculator</CardTitle>
                <CardDescription>
                  Calculate fine with late fees and applicable GST
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <FormLabel>Violation Type</FormLabel>
                    <select className="w-full border border-gray-300 rounded-md p-2">
                      <option value="speeding">Speeding (₹1,000)</option>
                      <option value="signal">Red Light Jump (₹1,000)</option>
                      <option value="helmet">No Helmet (₹1,000)</option>
                      <option value="parking">No Parking (₹500)</option>
                      <option value="documents">No Documents (₹5,000)</option>
                    </select>
                  </div>
                  
                  <div>
                    <FormLabel>Date of Violation</FormLabel>
                    <Input type="date" defaultValue="2025-04-01" />
                  </div>
                  
                  <div>
                    <FormLabel>Current Date</FormLabel>
                    <Input type="date" defaultValue="2025-04-10" />
                  </div>
                  
                  <Button 
                    className="w-full bg-titeh-primary hover:bg-blue-600"
                    onClick={calculateLateFee}
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Penalty
                  </Button>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <div className="font-medium">
                    <div className="flex justify-between">
                      <span>Base Amount:</span>
                      <span>₹{penalty.base}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late Fee (2%):</span>
                      <span>₹{penalty.lateFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (3%):</span>
                      <span>₹{penalty.gst}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t mt-1 pt-1">
                      <span>Total:</span>
                      <span>₹{penalty.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <div className="flex items-start mb-2">
                    <FileText className="h-4 w-4 text-titeh-primary mr-2 mt-0.5" />
                    <p className="text-sm">
                      Rates as per Telangana Motor Vehicles Act. GST rate is 3% on service fee, late fees are calculated at 2% per month.
                    </p>
                  </div>
                  <a 
                    href="https://parivahan.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-titeh-primary hover:underline text-xs"
                  >
                    Learn more on Parivahan Portal
                  </a>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment FAQs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Payment FAQs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-medium">How can I pay my challan?</h3>
              <p className="text-sm text-gray-600">You can pay online through this app, Parivahan portal, or visit your nearest RTO office.</p>
            </div>
            <div>
              <h3 className="font-medium">What payment methods are accepted?</h3>
              <p className="text-sm text-gray-600">UPI, credit/debit cards, net banking, and wallet payments are accepted for online payments.</p>
            </div>
            <div>
              <h3 className="font-medium">How long does it take to update payment status?</h3>
              <p className="text-sm text-gray-600">Online payments are updated instantly. You will receive an SMS confirmation.</p>
            </div>
            <div>
              <h3 className="font-medium">Can I dispute a challan?</h3>
              <p className="text-sm text-gray-600">Yes, visit your local RTO with supporting evidence within 15 days of challan issue.</p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="https://parivahan.gov.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 bg-white rounded-md border hover:bg-gray-50 transition-colors"
          >
            <CreditCard className="text-titeh-primary mb-2" />
            <span className="text-sm font-medium">Parivahan Portal</span>
          </a>
          
          <a 
            href="https://transport.telangana.gov.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 bg-white rounded-md border hover:bg-gray-50 transition-colors"
          >
            <FileText className="text-titeh-primary mb-2" />
            <span className="text-sm font-medium">Telangana Transport</span>
          </a>
          
          <a 
            href="https://www.tspolice.gov.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 bg-white rounded-md border hover:bg-gray-50 transition-colors"
          >
            <Check className="text-titeh-primary mb-2" />
            <span className="text-sm font-medium">TS Police</span>
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default PayChallan;
