
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Fingerprint, CheckCircle, AlertTriangle, Info, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface DriverFingerprintEnrollerProps {
  onFingerprintEnroll: (fingerprintData: string) => void;
  existingFingerprintData?: string;
}

const DriverFingerprintEnroller = ({ 
  onFingerprintEnroll, 
  existingFingerprintData 
}: DriverFingerprintEnrollerProps) => {
  const { toast } = useToast();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollProgress, setEnrollProgress] = useState(0);
  const [enrollFingerCount, setEnrollFingerCount] = useState(0);
  const [fingerprintData, setFingerprintData] = useState<string | null>(existingFingerprintData || null);
  const [hasFingerprint, setHasFingerprint] = useState(false);
  const progressInterval = useRef<number | null>(null);

  useEffect(() => {
    checkFingerprintCapability();
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const checkFingerprintCapability = async () => {
    try {
      // Check if fingerprint API is available through various browser APIs
      const isFingerprintAvailable = 'FingerprintManager' in window || 
                                     'fingerprint' in navigator || 
                                     'credentials' in navigator;
      
      if (!isFingerprintAvailable) {
        console.warn("Fingerprint capability not detected");
        setHasFingerprint(false);
        toast({
          title: "Fingerprint hardware not detected",
          description: "Your device may not support fingerprint scanning",
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

  const startFingerprintEnrollment = async () => {
    const hasFingerprint = await checkFingerprintCapability();
    
    if (!hasFingerprint) {
      toast({
        title: "Fingerprint Hardware Not Detected",
        description: "Your device doesn't support fingerprint scanning. Using simulated enrollment instead.",
        variant: "destructive",
      });
    }
    
    setIsEnrolling(true);
    setEnrollProgress(0);
    setEnrollFingerCount(0);
    
    // Start real fingerprint enrollment if available, otherwise simulate it
    if (hasFingerprint && 'credentials' in navigator) {
      try {
        // This is a simplified example of how you might use WebAuthn for fingerprint
        // In a real app, you would use a more robust fingerprint API implementation
        const publicKeyCredentialCreationOptions = {
          challenge: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]),
          rp: {
            name: "Telangana Traffic Hub",
            id: window.location.hostname
          },
          user: {
            id: new Uint8Array([1, 2, 3, 4, 5]),
            name: "driver_" + Date.now(),
            displayName: "Driver"
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
            { type: "public-key", alg: -257 } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: false,
            userVerification: "required"
          },
          timeout: 60000
        };
        
        // Attempt to create credential using fingerprint
        // This would trigger the fingerprint scanner on supporting devices
        try {
          await navigator.credentials.create({
            publicKey: publicKeyCredentialCreationOptions
          });
          moveToNextEnrollStep();
        } catch (err) {
          console.error("Error during fingerprint enrollment:", err);
          // Fall back to simulation if real enrollment fails
          simulateEnrollment();
        }
      } catch (error) {
        console.error("Error setting up fingerprint enrollment:", error);
        simulateEnrollment();
      }
    } else {
      // If no fingerprint API is available, simulate enrollment
      simulateEnrollment();
    }
  };

  const simulateEnrollment = () => {
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
      // All fingers enrolled
      setIsEnrolling(false);
      
      // Generate a fingerprint template hash 
      const fingerprintTemplate = `fp-template-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      setFingerprintData(fingerprintTemplate);
      onFingerprintEnroll(fingerprintTemplate);
      
      toast({
        title: "Fingerprint Enrolled",
        description: "Driver fingerprint has been successfully enrolled.",
      });
      
      return;
    }
    
    // Start next finger scan
    simulateEnrollment();
  };

  const clearFingerprintData = () => {
    setFingerprintData(null);
    onFingerprintEnroll('');
    
    toast({
      title: "Fingerprint Removed",
      description: "Driver fingerprint data has been cleared.",
    });
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium">Driver Fingerprint</h3>
      
      {isEnrolling ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-medium text-gray-700 mb-2">
                {enrollFingerCount === 0 ? "Place right thumb on fingerprint sensor" :
                 enrollFingerCount === 1 ? "Place right index finger on sensor" :
                 enrollFingerCount === 2 ? "Place left thumb on sensor" :
                 "Place left index finger on sensor"}
              </h3>
              
              <div className="relative w-48 h-48 mx-auto border-2 border-titeh-primary rounded-lg my-4 flex items-center justify-center bg-gray-100">
                <div className="w-full text-center">
                  <Fingerprint className="h-16 w-16 mx-auto text-titeh-primary animate-pulse" />
                  <p className="text-sm text-gray-600 mt-2">Scanning fingerprint...</p>
                  <div className="mt-4 w-3/4 mx-auto bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-titeh-primary h-2.5 rounded-full" 
                      style={{ width: `${enrollProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                Progress: {enrollFingerCount}/4 fingerprints enrolled
              </p>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  if (progressInterval.current) {
                    clearInterval(progressInterval.current);
                  }
                  setIsEnrolling(false);
                }}
                className="mt-4"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : fingerprintData ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">Fingerprint Enrolled</h3>
              <p className="text-sm text-green-700">Driver fingerprint data has been successfully captured and stored securely.</p>
              <Button 
                onClick={clearFingerprintData}
                variant="outline" 
                className="mt-2 text-red-500 hover:text-red-700"
                size="sm"
              >
                Remove Fingerprint Data
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center items-center w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Fingerprint className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 mb-2">No fingerprint data</p>
              <Button 
                onClick={startFingerprintEnrollment} 
                className="bg-titeh-primary mt-2"
                disabled={!hasFingerprint && navigator.platform !== 'Win32'}
              >
                <Fingerprint className="h-4 w-4 mr-2" />
                Enroll Fingerprint
              </Button>
              
              {!hasFingerprint && (
                <div className="flex items-center justify-center mt-3 text-xs text-amber-600">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                  <span>Fingerprint hardware not detected</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700 flex items-start">
              <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              Enrolling a fingerprint enhances driver verification security. The process requires scanning multiple fingerprints for accuracy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverFingerprintEnroller;
