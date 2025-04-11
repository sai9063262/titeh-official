
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  AlertCircle, 
  Search, 
  CircleCheck,
  ArrowRight,
  Truck,
  User,
  FileText,
  Calendar,
  Clock,
  MapPin,
  IndianRupee
} from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import EChallanServices from "@/components/parivahan/EChallanServices";

// Form validation schemas
const searchSchema = z.object({
  vehicleNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  challanNumber: z.string().optional(),
}).refine(data => {
  // At least one field must be provided
  return data.vehicleNumber || data.licenseNumber || data.challanNumber;
}, {
  message: "At least one search field is required",
  path: ["vehicleNumber"]
});

const PayChallan = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("search");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<null | {
    found: boolean;
    type?: "vehicle" | "license" | "challan";
    data?: any;
  }>(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      vehicleNumber: "",
      licenseNumber: "",
      challanNumber: ""
    },
  });

  // Process search submission
  const onSearch = (values: z.infer<typeof searchSchema>) => {
    setIsLoading(true);
    
    // Log search values
    console.log("Search values:", values);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Demo data - in a real app this would come from an API
      if (values.vehicleNumber === "MH02BR5467") {
        setSearchResult({
          found: true,
          type: "vehicle",
          data: {
            vehicleNumber: "MH02BR5467",
            owner: "Rahul Sharma",
            challans: [
              {
                id: "CHN20250411001",
                violation: "Speeding (78 km/h in 50 km/h zone)",
                location: "Bandra Western Express Highway",
                timestamp: "2025-04-01T14:30:00",
                amount: 2000,
                status: "unpaid"
              },
              {
                id: "CHN20250325002",
                violation: "Illegal Parking",
                location: "Juhu Beach Road",
                timestamp: "2025-03-25T18:45:00",
                amount: 1000,
                status: "unpaid"
              }
            ]
          }
        });
      } else if (values.licenseNumber === "MH1420200012345") {
        setSearchResult({
          found: true,
          type: "license",
          data: {
            licenseNumber: "MH1420200012345",
            name: "Rahul Sharma",
            challans: [
              {
                id: "CHN20250411001",
                violation: "Speeding (78 km/h in 50 km/h zone)",
                vehicleNumber: "MH02BR5467",
                location: "Bandra Western Express Highway",
                timestamp: "2025-04-01T14:30:00",
                amount: 2000,
                status: "unpaid"
              }
            ]
          }
        });
      } else if (values.challanNumber === "CHN20250411001") {
        setSearchResult({
          found: true,
          type: "challan",
          data: {
            id: "CHN20250411001",
            violation: "Speeding (78 km/h in 50 km/h zone)",
            vehicleNumber: "MH02BR5467",
            licenseNumber: "MH1420200012345",
            driver: "Rahul Sharma",
            location: "Bandra Western Express Highway",
            timestamp: "2025-04-01T14:30:00",
            amount: 2000,
            status: "unpaid"
          }
        });
      } else {
        setSearchResult({
          found: false
        });
        toast({
          title: "No results found",
          description: "We couldn't find any records matching your search criteria.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  // Handle payment process
  const handlePayment = () => {
    setPaymentDialog(true);
  };
  
  // Process payment
  const processPayment = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setPaymentDialog(false);
      setPaymentSuccess(true);
      
      toast({
        title: "Payment successful",
        description: "Your e-challan has been paid successfully.",
      });
    }, 2000);
  };
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Reset the search and results
  const resetSearch = () => {
    form.reset();
    setSearchResult(null);
    setPaymentSuccess(false);
  };
  
  // Calculate total amount due from multiple challans
  const calculateTotal = (challans: any[]) => {
    return challans.reduce((total, challan) => total + challan.amount, 0);
  };

  // Get a list of field errors
  const getFormErrorMessages = () => {
    const errors = form.formState.errors;
    const errorMessages = [];
    
    if (errors.vehicleNumber) {
      errorMessages.push(errors.vehicleNumber.message);
    }
    
    if (errors.licenseNumber) {
      errorMessages.push(errors.licenseNumber.message);
    }
    
    if (errors.challanNumber) {
      errorMessages.push(errors.challanNumber.message);
    }
    
    return errorMessages;
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold text-titeh-primary mb-2">Pay e-Challan</h1>
        <p className="text-gray-500 mb-6">Search and pay your traffic violation challans online</p>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search e-Challan
            </TabsTrigger>
            <TabsTrigger value="pay" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Quick Payment
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search for e-Challan</CardTitle>
                  <CardDescription>
                    Enter any of the following details to search for your e-Challan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSearch)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="vehicleNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. MH02BR5467" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="licenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Driver's License Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. MH1420200012345" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="challanNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Challan Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. CHN20250411001" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Display validation errors */}
                      {form.formState.errors && getFormErrorMessages().length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4">
                          <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <div>
                              <p className="text-sm text-red-700">Please correct the following:</p>
                              <ul className="list-disc list-inside text-xs text-red-700 mt-1">
                                {getFormErrorMessages().map((message, index) => (
                                  <li key={index}>{message}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          onClick={resetSearch}
                        >
                          Clear
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-titeh-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? "Searching..." : "Search"}
                        </Button>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-md">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">Demo Information</p>
                            <p className="text-xs text-blue-700 mt-1">
                              For testing, use these sample values:
                            </p>
                            <ul className="list-disc list-inside text-xs text-blue-700 mt-1 space-y-1">
                              <li>Vehicle: MH02BR5467</li>
                              <li>License: MH1420200012345</li>
                              <li>Challan: CHN20250411001</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Search results section */}
              {searchResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {searchResult.found ? "Search Results" : "No Results Found"}
                    </CardTitle>
                    <CardDescription>
                      {searchResult.found 
                        ? `Showing ${searchResult.type === "vehicle" || searchResult.type === "license" 
                            ? searchResult.data.challans.length 
                            : "1"} challan(s) found`
                        : "We couldn't find any records matching your search criteria"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {searchResult.found && searchResult.data && (
                      <>
                        {/* Common header information based on search type */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                          {searchResult.type === "vehicle" && (
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <Truck className="h-5 w-5 text-titeh-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">Vehicle: {searchResult.data.vehicleNumber}</h3>
                                <p className="text-sm text-gray-600">Owner: {searchResult.data.owner}</p>
                              </div>
                            </div>
                          )}
                          
                          {searchResult.type === "license" && (
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <User className="h-5 w-5 text-titeh-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">License: {searchResult.data.licenseNumber}</h3>
                                <p className="text-sm text-gray-600">Name: {searchResult.data.name}</p>
                              </div>
                            </div>
                          )}
                          
                          {searchResult.type === "challan" && (
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <FileText className="h-5 w-5 text-titeh-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">Challan: {searchResult.data.id}</h3>
                                <p className="text-sm text-gray-600">
                                  Vehicle: {searchResult.data.vehicleNumber} | 
                                  Driver: {searchResult.data.driver}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Display challan details */}
                        <div className="space-y-4">
                          {(searchResult.type === "vehicle" || searchResult.type === "license") && 
                            searchResult.data.challans.map((challan: any, index: number) => (
                              <div 
                                key={index} 
                                className="border border-gray-200 rounded-lg p-4 hover:border-titeh-primary transition-colors"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-medium">{challan.violation}</h4>
                                    <p className="text-xs text-gray-600">Challan #{challan.id}</p>
                                  </div>
                                  <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                                    Unpaid
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                    <span>{formatDate(challan.timestamp)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-gray-500" />
                                    <span>{formatTime(challan.timestamp)}</span>
                                  </div>
                                  {challan.vehicleNumber && (
                                    <div className="flex items-center gap-1">
                                      <Truck className="h-3 w-3 text-gray-500" />
                                      <span>{challan.vehicleNumber}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-gray-500" />
                                    <span>{challan.location}</span>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-1">
                                    <IndianRupee className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">₹{challan.amount}</span>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    className="bg-titeh-primary"
                                    onClick={handlePayment}
                                  >
                                    Pay Now
                                  </Button>
                                </div>
                              </div>
                            ))
                          }
                          
                          {searchResult.type === "challan" && (
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-medium">{searchResult.data.violation}</h4>
                                  <p className="text-xs text-gray-600">Challan #{searchResult.data.id}</p>
                                </div>
                                <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                                  Unpaid
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-y-2 mb-4 text-sm">
                                <div>
                                  <p className="text-xs text-gray-600">Date</p>
                                  <p>{formatDate(searchResult.data.timestamp)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">Time</p>
                                  <p>{formatTime(searchResult.data.timestamp)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">Vehicle</p>
                                  <p>{searchResult.data.vehicleNumber}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">License</p>
                                  <p>{searchResult.data.licenseNumber}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-xs text-gray-600">Location</p>
                                  <p>{searchResult.data.location}</p>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center border-t pt-4">
                                <div>
                                  <p className="text-xs text-gray-600">Amount Due</p>
                                  <p className="font-medium text-lg">₹{searchResult.data.amount}</p>
                                </div>
                                <Button 
                                  className="bg-titeh-primary"
                                  onClick={handlePayment}
                                >
                                  Pay Now <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* If multiple challans, show the total */}
                          {(searchResult.type === "vehicle" || searchResult.type === "license") && 
                           searchResult.data.challans.length > 1 && (
                            <div className="border-t pt-4 flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-600">Total Due</p>
                                <p className="font-medium text-lg">
                                  ₹{calculateTotal(searchResult.data.challans)}
                                </p>
                              </div>
                              <Button 
                                className="bg-titeh-primary"
                                onClick={handlePayment}
                              >
                                Pay All <ArrowRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    
                    {paymentSuccess && (
                      <div className="text-center py-8">
                        <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                          <CircleCheck className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Payment Successful!</h3>
                        <p className="text-gray-600 mb-6">
                          Your payment has been processed successfully.
                          A receipt has been sent to your registered email.
                        </p>
                        <Button 
                          className="bg-titeh-primary"
                          onClick={resetSearch}
                        >
                          Search Again
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pay">
            <EChallanServices />
          </TabsContent>
        </Tabs>
        
        {/* Payment Dialog */}
        <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Pay e-Challan</DialogTitle>
            </DialogHeader>
            
            <div className="py-6">
              <div className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Total Amount Due</p>
                <p className="text-2xl font-semibold">₹{searchResult?.type === "challan" 
                  ? searchResult.data.amount 
                  : searchResult?.data?.challans 
                    ? calculateTotal(searchResult.data.challans) 
                    : 0
                }</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Select Payment Method</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="justify-start">UPI</Button>
                    <Button variant="outline" className="justify-start">Card</Button>
                    <Button variant="outline" className="justify-start">NetBanking</Button>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <p className="text-xs text-yellow-700">
                      This is a demo. No actual payment will be processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setPaymentDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-titeh-primary"
                onClick={processPayment}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Pay Now"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default PayChallan;
