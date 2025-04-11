
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, History, RefreshCw, Car, Calendar, FileBarChart, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define Zod schema for form validation
const searchSchema = z.object({
  challanNumber: z.string().optional(),
  vehicleNumber: z.string()
    .optional()
    .refine(val => !val || /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{1,4}$/.test(val), {
      message: "Please enter a valid vehicle number format (e.g., TS01AB1234)",
    }),
  licenseNumber: z.string().optional(),
});

// Ensure at least one field is filled
const formSchema = searchSchema.refine(
  data => !!data.challanNumber || !!data.vehicleNumber || !!data.licenseNumber,
  {
    message: "At least one search criteria is required",
    path: ["_errors"],
  }
);

type SearchFormValues = z.infer<typeof searchSchema>;

interface ChallanDetail {
  id: string;
  vehicleNumber: string;
  challanDate: string;
  violationType: string;
  amount: number;
  location: string;
  status: "unpaid" | "paid" | "disputed";
  dueDate: string;
}

const PayChallan = () => {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [foundChallans, setFoundChallans] = useState<ChallanDetail[]>([]);
  const [selectedChallan, setSelectedChallan] = useState<ChallanDetail | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  
  // Sample challan data
  const sampleChallans: ChallanDetail[] = [
    {
      id: "CHN123456789",
      vehicleNumber: "TS07AB1234",
      challanDate: "2025-03-25",
      violationType: "Speeding",
      amount: 1000,
      location: "Hitec City Flyover, Hyderabad",
      status: "unpaid",
      dueDate: "2025-04-24"
    },
    {
      id: "CHN987654321",
      vehicleNumber: "TS07AB1234",
      challanDate: "2025-02-15",
      violationType: "No Parking",
      amount: 500,
      location: "Begumpet Signal, Hyderabad",
      status: "unpaid",
      dueDate: "2025-03-14"
    },
    {
      id: "CHN456123789",
      vehicleNumber: "TS07AB1234",
      challanDate: "2025-01-10",
      violationType: "Red Light Violation",
      amount: 1500,
      location: "Panjagutta Junction, Hyderabad",
      status: "paid",
      dueDate: "2025-02-09"
    }
  ];
  
  // Create form
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      challanNumber: "",
      vehicleNumber: "",
      licenseNumber: "",
    },
  });

  // Handle search submission
  const onSubmit = (values: SearchFormValues) => {
    setIsSearching(true);
    setSearchPerformed(false);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSearching(false);
      setSearchPerformed(true);
      
      // Filter challans based on search criteria (in a real app, this would be a server call)
      let filteredChallans: ChallanDetail[] = [];
      
      if (values.challanNumber) {
        filteredChallans = sampleChallans.filter(
          challan => challan.id.toLowerCase().includes(values.challanNumber!.toLowerCase())
        );
      } else if (values.vehicleNumber) {
        filteredChallans = sampleChallans.filter(
          challan => challan.vehicleNumber.toLowerCase() === values.vehicleNumber!.toLowerCase()
        );
      } else {
        // License number search would typically involve a different API call
        // For demo, just show all sample challans
        filteredChallans = sampleChallans;
      }
      
      setFoundChallans(filteredChallans);
      
      if (filteredChallans.length === 0) {
        toast({
          title: "No Challans Found",
          description: "No unpaid challans found for the given criteria.",
          variant: "default",
        });
      } else {
        toast({
          title: "Challans Found",
          description: `Found ${filteredChallans.length} challan(s) for your search.`,
          variant: "default",
        });
      }
    }, 1500);
  };

  // Handle payment initiation
  const initiatePayment = (challan: ChallanDetail) => {
    setSelectedChallan(challan);
    setIsPaymentDialogOpen(true);
  };
  
  // Process payment
  const processPayment = () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentDialogOpen(false);
      
      // Update the paid status in the list
      if (selectedChallan) {
        setFoundChallans(foundChallans.map(c => 
          c.id === selectedChallan.id ? { ...c, status: "paid" } : c
        ));
      }
      
      toast({
        title: "Payment Successful",
        description: `Challan ${selectedChallan?.id} has been paid successfully.`,
        variant: "default",
      });
      
      // Reset selected challan
      setSelectedChallan(null);
    }, 2000);
  };
  
  // Download receipt
  const downloadReceipt = (challan: ChallanDetail) => {
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for challan ${challan.id} has been downloaded.`,
      variant: "default",
    });
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold text-titeh-primary mb-2">Pay e-Challan</h1>
        <p className="text-gray-500 mb-6">Search and pay your traffic violation challans online</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Search Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Search Challans</CardTitle>
                <CardDescription>
                  Enter any one of the details below to find your challans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="challanNumber">Challan Number</Label>
                        <FormField
                          control={form.control}
                          name="challanNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input id="challanNumber" placeholder="e.g. CHN123456789" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                        <FormField
                          control={form.control}
                          name="vehicleNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input id="vehicleNumber" placeholder="e.g. TS07AB1234" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <FormField
                          control={form.control}
                          name="licenseNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input id="licenseNumber" placeholder="e.g. TG0220210123456" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-titeh-primary"
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search Challans
                        </>
                      )}
                    </Button>
                    
                    {/* Form Error */}
                    {form.formState.errors._errors && (
                      <p className="text-sm text-red-500 text-center">
                        {form.formState.errors._errors.message}
                      </p>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Search Results */}
            {searchPerformed && (
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Search Results</CardTitle>
                  <CardDescription>
                    {foundChallans.length > 0 
                      ? `Found ${foundChallans.length} challan(s)`
                      : "No challans found for your search criteria"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {foundChallans.length > 0 ? (
                    <div className="space-y-4">
                      {foundChallans.map((challan) => (
                        <div key={challan.id} className="border rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                            <div>
                              <h3 className="font-medium flex items-center">
                                <span className="mr-2">Challan #{challan.id}</span>
                                {challan.status === "paid" ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Paid
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                    Unpaid
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Issue Date: {challan.challanDate} | Due Date: {challan.dueDate}
                              </p>
                            </div>
                            <div className="text-lg font-semibold text-titeh-primary mt-2 sm:mt-0">
                              ₹{challan.amount.toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                            <div className="flex items-start gap-2">
                              <Car className="h-4 w-4 text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-600">Vehicle Number</p>
                                <p className="text-sm">{challan.vehicleNumber}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-600">Violation</p>
                                <p className="text-sm">{challan.violationType}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:col-span-2">
                              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-600">Location</p>
                                <p className="text-sm">{challan.location}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {challan.status === "unpaid" ? (
                              <Button 
                                className="bg-titeh-primary flex-1 sm:flex-none"
                                onClick={() => initiatePayment(challan)}
                              >
                                Pay Now
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="flex-1 sm:flex-none"
                                onClick={() => downloadReceipt(challan)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download Receipt
                              </Button>
                            )}
                            
                            <Button variant="outline" className="flex-1 sm:flex-none">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchPerformed && (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <FileBarChart className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="font-medium mb-1">No Challans Found</h3>
                      <p className="text-sm text-gray-500 max-w-md mb-4">
                        We couldn't find any challan matching your search criteria. 
                        If you believe you have pending challans, please try with a different search criteria.
                      </p>
                      <Button variant="outline" onClick={() => form.reset()}>
                        Clear Search
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => form.reset()}>
                  <Search className="h-4 w-4 mr-2" />
                  New Search
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <History className="h-4 w-4 mr-2" />
                  Payment History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipts
                </Button>
              </CardContent>
            </Card>
            
            {/* Help Card */}
            <Card>
              <CardHeader>
                <CardTitle>How to Pay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <span className="text-titeh-primary text-sm font-semibold">1</span>
                  </div>
                  <p className="text-sm">Enter your vehicle number, challan number, or license number</p>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <span className="text-titeh-primary text-sm font-semibold">2</span>
                  </div>
                  <p className="text-sm">View the list of unpaid challans associated with your search</p>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <span className="text-titeh-primary text-sm font-semibold">3</span>
                  </div>
                  <p className="text-sm">Click "Pay Now" and select your preferred payment method</p>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <span className="text-titeh-primary text-sm font-semibold">4</span>
                  </div>
                  <p className="text-sm">Complete the payment and download your e-receipt</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Sample Vehicle Numbers */}
            <Card>
              <CardHeader>
                <CardTitle>Demo Vehicle Numbers</CardTitle>
                <CardDescription>
                  For testing, use this vehicle number:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-2 rounded-md text-center font-medium">
                  TS07AB1234
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Payment Dialog */}
      {selectedChallan && (
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Pay e-Challan</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-lg bg-gray-50 p-4 mb-4">
                <h4 className="font-medium text-sm mb-2">Challan Details</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Challan Number:</span>
                    <span className="font-medium">{selectedChallan.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Number:</span>
                    <span className="font-medium">{selectedChallan.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Violation:</span>
                    <span className="font-medium">{selectedChallan.violationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{selectedChallan.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">₹{selectedChallan.amount}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-sm font-medium">Select Payment Method</label>
                <Tabs defaultValue="upi" value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="upi">UPI</TabsTrigger>
                    <TabsTrigger value="card">Card</TabsTrigger>
                    <TabsTrigger value="netbanking">Net Banking</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upi" className="space-y-4">
                    <div className="border rounded-lg p-4 text-center">
                      <div className="mx-auto bg-gray-100 p-4 rounded-lg w-32 h-32 mb-2">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" 
                          alt="UPI QR Code" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-sm">Scan QR code with any UPI app</p>
                      <p className="text-xs text-gray-500 mt-1">or</p>
                      <div className="mt-2">
                        <Input placeholder="Enter UPI ID (e.g. name@upi)" />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="card" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9101 1121" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" type="password" maxLength={3} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Card Holder Name</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="netbanking" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank">Select Your Bank</Label>
                      <select id="bank" className="w-full p-2 border rounded-md">
                        <option value="">Select a bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="bob">Bank of Baroda</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        You will be redirected to your bank's website to complete the payment.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} disabled={isProcessingPayment}>
                Cancel
              </Button>
              <Button 
                className="bg-titeh-primary" 
                onClick={processPayment}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${selectedChallan.amount}`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default PayChallan;
