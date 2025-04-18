
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Fingerprint, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  User,
  Loader,
  RefreshCw,
  Shield,
  Info,
  FileText,
  Camera
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface DriverInfo {
  id: string;
  name: string;
  licenseNumber: string;
  photoUrl: string;
  status: "valid" | "expired" | "suspended";
  validUntil: string;
  vehicleClass: string;
}

const FingerprintVerification = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | {
    success: boolean;
    message: string;
    driver?: DriverInfo;
  }>(null);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [scanProgress, setScanProgress] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollProgress, setEnrollProgress] = useState(0);
  const [enrollStep, setEnrollStep] = useState(1);
  const [enrollFingerCount, setEnrollFingerCount] = useState(0);
  
  const scannerRef = useRef<HTMLDivElement>(null);
  const enrollScannerRef = useRef<HTMLDivElement>(null);
  
  const progressInterval = useRef<number | null>(null);
  
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);
  
  const startFingerprintScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning progress
    progressInterval.current = window.setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current as number);
          simulateScanCompletion();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  const simulateScanCompletion = () => {
    // Random success/failure for demo purposes
    const success = Math.random() > 0.3; // 70% success rate
    
    setTimeout(() => {
      setIsScanning(false);
      
      if (success) {
        setScanResult({
          success: true,
          message: "Fingerprint successfully matched",
          driver: {
            id: "123456",
            name: "Rahul Sharma",
            licenseNumber: "TS20210034567",
            photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
            status: "valid",
            validUntil: "12/05/2028",
            vehicleClass: "LMV"
          }
        });
        
        toast({
          title: "Verification Successful",
          description: "Driver identity confirmed via fingerprint",
        });
      } else {
        setScanResult({
          success: false,
          message: "No matching fingerprint found"
        });
        
        setAttemptsLeft(prev => prev - 1);
        
        toast({
          title: "Verification Failed",
          description: `No match found. ${attemptsLeft - 1} attempts remaining.`,
          variant: "destructive",
        });
      }
    }, 500);
  };
  
  const resetVerification = () => {
    setScanResult(null);
    setAttemptsLeft(3);
  };
  
  const startEnrollment = () => {
    if (!licenseNumber.trim()) {
      toast({
        title: "License Required",
        description: "Please enter a valid license number",
        variant: "destructive",
      });
      return;
    }
    
    setIsEnrolling(true);
    setEnrollProgress(0);
    setEnrollStep(1);
    setEnrollFingerCount(0);
    
    // Simulate enrollment progress
    progressInterval.current = window.setInterval(() => {
      setEnrollProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current as number);
          moveToNextEnrollStep();
          return 0; // Reset for next finger
        }
        return prev + 5;
      });
    }, 100);
  };
  
  const moveToNextEnrollStep = () => {
    setEnrollFingerCount(prev => prev + 1);
    
    if (enrollFingerCount >= 3) {
      // Final step completed
      setIsEnrolling(false);
      setEnrollStep(prev => prev + 1);
      
      setTimeout(() => {
        toast({
          title: "Enrollment Complete",
          description: "Fingerprint data has been successfully registered",
        });
        setIsEnrollDialogOpen(false);
      }, 1000);
      
      return;
    }
    
    // Start next finger scan
    progressInterval.current = window.setInterval(() => {
      setEnrollProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current as number);
          moveToNextEnrollStep();
          return 0;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  const handleAddDriverFingerprint = async () => {
    try {
      // This is a simulation - in a real app, you'd integrate with a fingerprint API
      // and send data to Supabase
      
      const { data, error } = await supabase
        .from('verification_methods')
        .insert([
          { 
            user_id: '12345', // This would be the actual user ID
            method_type: 'fingerprint',
            reference_data: 'fingerprint-data-' + Date.now(),
            is_active: true
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Fingerprint Registered",
        description: "The driver's fingerprint has been successfully registered in the system",
      });
      
      setIsEnrollDialogOpen(false);
    } catch (error) {
      console.error("Error registering fingerprint:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error registering the fingerprint. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-titeh-primary">Fingerprint Verification</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Fingerprint className="mr-2 h-5 w-5 text-titeh-primary" />
              Driver Identification via Fingerprint
            </CardTitle>
            <CardDescription>
              Verify driver identity using biometric fingerprint scanning
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scanResult ? (
              <div className="space-y-6">
                <div className={`flex items-center justify-center p-4 rounded-lg ${
                  scanResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  {scanResult.success ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-green-700">Verification Successful</h3>
                        <p className="text-sm text-green-600">{scanResult.message}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="h-8 w-8 text-red-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-red-700">Verification Failed</h3>
                        <p className="text-sm text-red-600">{scanResult.message}</p>
                        {attemptsLeft > 0 ? (
                          <p className="text-xs text-red-600 mt-1">{attemptsLeft} attempts remaining</p>
                        ) : (
                          <p className="text-xs text-red-600 mt-1">No attempts remaining. Please contact support.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {scanResult.success && scanResult.driver && (
                  <Card className="p-4 border-green-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-gray-200">
                          <img 
                            src={scanResult.driver.photoUrl} 
                            alt={scanResult.driver.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute bottom-0 left-0 right-0 text-xs text-white text-center py-1 ${
                            scanResult.driver.status === "valid" ? "bg-green-500" :
                            scanResult.driver.status === "expired" ? "bg-amber-500" : "bg-red-500"
                          }`}>
                            {scanResult.driver.status === "valid" ? "Valid" :
                             scanResult.driver.status === "expired" ? "Expired" : "Suspended"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Driver Name</p>
                          <p className="font-semibold">{scanResult.driver.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">License Number</p>
                          <p className="font-semibold">{scanResult.driver.licenseNumber}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Valid Until</p>
                            <p className="font-semibold">{scanResult.driver.validUntil}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Vehicle Class</p>
                            <p className="font-semibold">{scanResult.driver.vehicleClass}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    onClick={resetVerification}
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    New Verification
                  </Button>
                  
                  {scanResult.success && (
                    <Button className="bg-titeh-primary">
                      <FileText className="h-4 w-4 mr-1" />
                      View Full Details
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div 
                    ref={scannerRef}
                    className={`relative w-64 h-64 border-2 rounded-lg mb-4 overflow-hidden ${
                      isScanning ? 'border-titeh-primary' : 'border-gray-300'
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      {isScanning ? (
                        <div className="w-full text-center">
                          <Fingerprint className="h-16 w-16 mx-auto text-titeh-primary animate-pulse" />
                          <p className="text-sm text-gray-600 mt-2">Scanning fingerprint...</p>
                          <div className="mt-4 w-3/4 mx-auto bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-titeh-primary h-2.5 rounded-full" 
                              style={{ width: `${scanProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Fingerprint className="h-16 w-16 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">Place finger on scanner</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={startFingerprintScan}
                    disabled={isScanning || attemptsLeft <= 0} 
                    className={`${isScanning ? 'bg-gray-400' : 'bg-titeh-primary'} w-64`}
                  >
                    {isScanning ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="h-4 w-4 mr-2" />
                        Start Fingerprint Scan
                      </>
                    )}
                  </Button>
                  
                  {attemptsLeft <= 0 && (
                    <div className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Maximum attempts reached
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEnrollDialogOpen(true)}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Enroll New Fingerprint
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-titeh-primary" />
              About Fingerprint Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <p>
                Fingerprint verification offers a secure and reliable method to confirm driver identity. 
                Each person's fingerprint is unique, making it an effective biometric identifier that's 
                difficult to forge.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  How it works
                </h3>
                <ul className="list-disc pl-5 mt-2 text-blue-700 space-y-1">
                  <li>The system captures unique ridges and patterns from your fingerprint</li>
                  <li>It matches these patterns against previously stored fingerprint data</li>
                  <li>Verification is completed in seconds with high accuracy</li>
                  <li>All fingerprint data is encrypted for security</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-medium text-amber-800 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Privacy Notice
                </h3>
                <p className="mt-2 text-amber-700">
                  Your biometric data is stored securely and used only for driver verification purposes.
                  We comply with all relevant data protection regulations and never share your biometric 
                  data with third parties without consent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Enrollment Dialog */}
      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enroll New Fingerprint</DialogTitle>
          </DialogHeader>
          
          {enrollStep === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="license-number" className="block text-sm font-medium mb-1">
                  Driver License Number
                </label>
                <Input
                  id="license-number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="Enter license number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The license number must match an existing driver record.
                </p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                <p className="flex items-start">
                  <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  The enrollment process requires scanning multiple fingerprints to ensure accuracy.
                  Please follow the instructions carefully.
                </p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={startEnrollment}
                  className="bg-titeh-primary"
                >
                  Start Enrollment
                </Button>
              </DialogFooter>
            </div>
          )}
          
          {enrollStep === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-lg">
                  {enrollFingerCount === 0 ? "Place right thumb on scanner" :
                   enrollFingerCount === 1 ? "Place right index finger on scanner" :
                   enrollFingerCount === 2 ? "Place left thumb on scanner" :
                   "Place left index finger on scanner"}
                </h3>
                
                <div 
                  ref={enrollScannerRef}
                  className="relative w-48 h-48 mx-auto border-2 border-titeh-primary rounded-lg my-4"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-full text-center">
                      <Fingerprint className="h-12 w-12 mx-auto text-titeh-primary animate-pulse" />
                      <p className="text-sm text-gray-600 mt-2">Scanning fingerprint...</p>
                      <div className="mt-4 w-3/4 mx-auto bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-titeh-primary h-2.5 rounded-full" 
                          style={{ width: `${enrollProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">
                  Progress: {enrollFingerCount}/4 fingerprints enrolled
                </p>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (progressInterval.current) {
                      clearInterval(progressInterval.current);
                    }
                    setIsEnrolling(false);
                    setIsEnrollDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          )}
          
          {enrollStep === 3 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-green-800">Enrollment Successful</h3>
                <p className="text-sm text-gray-600 mt-2">
                  All fingerprints have been successfully captured and registered.
                </p>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={() => setIsEnrollDialogOpen(false)}
                  className="bg-titeh-primary"
                >
                  Complete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default FingerprintVerification;
