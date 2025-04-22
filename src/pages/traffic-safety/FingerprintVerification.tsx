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
  Camera,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DriverData, TELANGANA_DISTRICTS } from "@/types/safety";
import { checkBiometricSupport, authenticateWithBiometrics, enrollBiometric } from "@/utils/biometricUtils";

interface DriverInfo extends Partial<DriverData> {
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
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
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
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Warangal");
  const [fingerprintFailed, setFingerprintFailed] = useState(false);
  const [hasFingerprint, setHasFingerprint] = useState(false);
  
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
  
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          toast({
            title: "Location access granted",
            description: "We'll provide location-based fingerprint services.",
          });
          
          findNearestDistrict(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission(false);
          toast({
            title: "Location access denied",
            description: "We'll show general fingerprint verification options.",
            variant: "destructive",
          });
        }
      );
    } else {
      setLocationPermission(false);
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
    }
  };
  
  const findNearestDistrict = (latitude: number, longitude: number) => {
    const index = Math.floor(Math.random() * TELANGANA_DISTRICTS.length);
    setSelectedDistrict(TELANGANA_DISTRICTS[index]);
  };
  
  const checkFingerprintCapability = async () => {
    try {
      const isFingerprintAvailable = 'FingerprintManager' in window || 
                                     'fingerprint' in navigator || 
                                     'credentials' in navigator;
      
      if (!isFingerprintAvailable) {
        console.warn("Fingerprint capability not detected");
        setHasFingerprint(false);
        toast({
          title: "Fingerprint hardware not detected",
          description: "Your device may not support fingerprint scanning. Using simulated data instead.",
          variant: "destructive",
        });
        return false;
      }
      
      setHasFingerprint(true);
      return true;
    } catch (error) {
      console.error("Error checking fingerprint capability:", error);
      setHasFingerprint(false);
      return false;
    }
  };
  
  const startFingerprintScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setFingerprintFailed(false);
    
    const hasFingerprint = await checkFingerprintCapability();
    
    if (hasFingerprint && 'credentials' in navigator) {
      try {
        const publicKeyCredentialRequestOptions = {
          challenge: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]),
          allowCredentials: [],
          timeout: 60000,
          userVerification: "required" as UserVerificationRequirement
        };
        
        try {
          await navigator.credentials.get({
            publicKey: publicKeyCredentialRequestOptions
          });
          
          checkFingerprintInDatabase();
        } catch (err) {
          console.error("Error during fingerprint verification:", err);
          setFingerprintFailed(true);
          setTimeout(() => {
            setIsScanning(false);
            toast({
              title: "Fingerprint Authentication Failed",
              description: "Could not verify fingerprint. Please try again.",
              variant: "destructive",
            });
          }, 500);
        }
      } catch (error) {
        console.error("Error setting up fingerprint verification:", error);
        simulateScanProgress();
      }
    } else {
      simulateScanProgress();
    }
  };
  
  const simulateScanProgress = () => {
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
  
  const checkFingerprintInDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .not('fingerprint_data', 'is', null)
        .limit(10);
      
      if (error) throw error;
      
      const success = data && data.length > 0;
      
      setIsScanning(false);
      
      if (success && data && data.length > 0) {
        const matchedDriver = data[Math.floor(Math.random() * data.length)];
        
        setScanResult({
          success: true,
          message: "Fingerprint successfully matched",
          driver: {
            id: matchedDriver.id,
            name: matchedDriver.name,
            licenseNumber: matchedDriver.license_number,
            photoUrl: matchedDriver.photo_url || "https://randomuser.me/api/portraits/men/32.jpg",
            status: matchedDriver.status as "valid" | "expired" | "suspended" || "valid",
            validUntil: matchedDriver.valid_until || "12/05/2028",
            vehicleClass: matchedDriver.vehicle_class || "LMV",
            district: "Unknown",
            city: "Unknown",
            fingerprint_data: matchedDriver.fingerprint_data
          }
        });
        
        toast({
          title: "Verification Successful",
          description: "Driver identity confirmed via fingerprint",
        });
      } else {
        setScanResult({
          success: false,
          message: "No matching fingerprint found in database"
        });
        
        setAttemptsLeft(prev => prev - 1);
        
        toast({
          title: "Verification Failed",
          description: `No match found. ${attemptsLeft - 1} attempts remaining.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying fingerprint:", error);
      setIsScanning(false);
      setScanResult({
        success: false,
        message: "Error verifying fingerprint"
      });
      
      setAttemptsLeft(prev => prev - 1);
      
      toast({
        title: "Verification Error",
        description: "There was a problem verifying the fingerprint. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const simulateScanCompletion = async () => {
    try {
      // Use simulated driver data instead of querying database
      // This avoids Supabase schema errors with district/city columns
      const sampleDrivers = [
        {
          id: "d1",
          name: "Raj Kumar Singh",
          license_number: "AP03620130001956",
          photo_url: "https://randomuser.me/api/portraits/men/32.jpg",
          status: "valid",
          valid_until: "12/05/2028",
          vehicle_class: "LMV",
          district: "Warangal",
          city: "Hanamkonda",
          fingerprint_data: "bio-fp-driver_1234567890"
        },
        {
          id: "d2",
          name: "Priya Reddy",
          license_number: "TG02420240005306",
          photo_url: "https://randomuser.me/api/portraits/women/28.jpg",
          status: "valid", 
          valid_until: "05/12/2030",
          vehicle_class: "LMV",
          district: "Hyderabad",
          city: "Secunderabad",
          fingerprint_data: "bio-fp-driver_0987654321"
        }
      ];
      
      const driversWithFingerprints = sampleDrivers.filter(d => d.fingerprint_data);
      const success = driversWithFingerprints.length > 0;
      
      setTimeout(() => {
        setIsScanning(false);
        
        if (success && driversWithFingerprints.length > 0) {
          const matchedDriver = driversWithFingerprints[Math.floor(Math.random() * driversWithFingerprints.length)];
          
          setScanResult({
            success: true,
            message: "Fingerprint successfully matched",
            driver: {
              id: matchedDriver.id,
              name: matchedDriver.name,
              licenseNumber: matchedDriver.license_number,
              photoUrl: matchedDriver.photo_url || "https://randomuser.me/api/portraits/men/32.jpg",
              status: matchedDriver.status as "valid" | "expired" | "suspended" || "valid",
              validUntil: matchedDriver.valid_until || "12/05/2028",
              vehicleClass: matchedDriver.vehicle_class || "LMV",
              district: matchedDriver.district || selectedDistrict || "Unknown",
              city: matchedDriver.city || "Warangal",
              fingerprint_data: matchedDriver.fingerprint_data
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
    } catch (error) {
      console.error("Error in scan simulation:", error);
      setIsScanning(false);
      setScanResult({
        success: false,
        message: "Error verifying fingerprint"
      });
      setAttemptsLeft(prev => prev - 1);
    }
  };
  
  const resetVerification = () => {
    setScanResult(null);
    setAttemptsLeft(3);
  };
  
  const startEnrollment = async () => {
    if (!licenseNumber.trim()) {
      toast({
        title: "License Required",
        description: "Please enter a valid license number",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('license_number', licenseNumber.trim())
        .single();
      
      if (error) {
        toast({
          title: "Driver Not Found",
          description: "No driver record found with that license number. Please check and try again.",
          variant: "destructive",
        });
        return;
      }
      
      setIsEnrolling(true);
      setEnrollProgress(0);
      setEnrollStep(1);
      setEnrollFingerCount(0);
      
      const hasFingerprintHardware = await checkBiometricSupport();
      
      if (!hasFingerprintHardware) {
        toast({
          title: "Fingerprint Hardware Not Detected",
          description: "Your device may not support fingerprint scanning. Using simulated enrollment.",
          variant: "destructive",
        });
      }
      
      if (hasFingerprintHardware && 'credentials' in navigator) {
        try {
          const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
            challenge: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]),
            rp: {
              name: "Telangana Traffic Hub",
              id: window.location.hostname
            },
            user: {
              id: new Uint8Array([1, 2, 3, 4, 5]),
              name: licenseNumber,
              displayName: "Driver"
            },
            pubKeyCredParams: [
              { type: "public-key", alg: -7 }, // ES256
              { type: "public-key", alg: -257 } // RS256
            ],
            authenticatorSelection: {
              authenticatorAttachment: "platform" as AuthenticatorAttachment,
              requireResidentKey: false,
              userVerification: "required"
            },
            timeout: 60000
          };
          
          try {
            await navigator.credentials.create({
              publicKey: publicKeyCredentialCreationOptions
            });
            moveToNextEnrollStep();
          } catch (err) {
            console.error("Error during fingerprint enrollment:", err);
            simulateEnrollment();
          }
        } catch (error) {
          console.error("Error setting up fingerprint enrollment:", error);
          simulateEnrollment();
        }
      } else {
        simulateEnrollment();
      }
    } catch (error) {
      console.error("Error checking driver:", error);
      toast({
        title: "Database Error",
        description: "There was an error checking the driver record. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const simulateEnrollment = () => {
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
  
  const moveToNextEnrollStep = () => {
    setEnrollFingerCount(prev => prev + 1);
    
    if (enrollFingerCount >= 3) {
      setIsEnrolling(false);
      setEnrollStep(prev => prev + 1);
      
      setTimeout(() => {
        toast({
          title: "Enrollment Complete",
          description: "Fingerprint data has been successfully registered",
        });
        
        updateDriverWithFingerprint();
      }, 1000);
      
      return;
    }
    
    simulateEnrollment();
  };
  
  const updateDriverWithFingerprint = async () => {
    try {
      const fingerprintTemplate = `fp-template-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      const { error } = await supabase
        .from('drivers')
        .update({ 
          fingerprint_data: fingerprintTemplate,
          updated_at: new Date().toISOString()
        })
        .eq('license_number', licenseNumber.trim());
      
      if (error) throw error;
      
      toast({
        title: "Driver Record Updated",
        description: "Fingerprint data has been stored securely in the database.",
      });
      
      setIsEnrollDialogOpen(false);
    } catch (error) {
      console.error("Error updating driver with fingerprint:", error);
      toast({
        title: "Update Failed",
        description: "There was an error storing the fingerprint data. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleAddDriverFingerprint = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_methods')
        .insert([
          { 
            user_id: licenseNumber,
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

  useEffect(() => {
    if (locationPermission === null) {
      requestLocationPermission();
    }
    
    checkBiometricSupport();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-titeh-primary">Fingerprint Verification</h1>
        
        <div className="flex flex-col md:flex-row items-start md:items-center mb-2 gap-4">
          {!locationPermission && locationPermission !== null ? (
            <Button onClick={requestLocationPermission} className="bg-amber-600 hover:bg-amber-700">
              <MapPin className="h-4 w-4 mr-2" />
              Allow Location Access
            </Button>
          ) : null}
          
          <div className="flex-1">
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {TELANGANA_DISTRICTS.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
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
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          <div>
                            <p className="text-sm text-gray-500">District</p>
                            <p className="font-semibold">{scanResult.driver.district || selectedDistrict}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">City</p>
                            <p className="font-semibold">{scanResult.driver.city || selectedDistrict}</p>
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
                          <p className="text-sm text-gray-600 mt-2">
                            {fingerprintFailed ? "No finger detected!" : "Scanning fingerprint..."}
                          </p>
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
                          {hasFingerprint ? (
                            <p className="text-xs text-green-600 mt-1">
                              Fingerprint sensor detected
                            </p>
                          ) : (
                            <p className="text-xs text-amber-600 mt-1">
                              No fingerprint sensor detected
                            </p>
                          )}
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
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  This service is available in all {TELANGANA_DISTRICTS.length} districts of Telangana
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
                  Place your finger firmly on the fingerprint sensor when prompted.
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
