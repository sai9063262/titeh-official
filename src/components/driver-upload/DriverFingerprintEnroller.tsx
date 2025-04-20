import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Fingerprint, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { checkBiometricSupport, enrollBiometric } from "@/utils/biometricUtils";

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
  const [hasFingerprint, setHasFingerprint] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [fingerprintData, setFingerprintData] = useState<string | null>(existingFingerprintData || null);

  useEffect(() => {
    checkBiometricCapability();
  }, []);

  const checkBiometricCapability = async () => {
    const isSupported = await checkBiometricSupport();
    setBiometricSupported(isSupported);
    setHasFingerprint(isSupported);
    
    if (!isSupported) {
      toast({
        title: "Biometric Not Available",
        description: "Your device doesn't support biometric authentication",
        variant: "destructive",
      });
    }
  };

  const startFingerprintEnrollment = async () => {
    if (!biometricSupported) {
      toast({
        title: "Biometric Not Supported",
        description: "Your device doesn't support biometric authentication",
        variant: "destructive",
      });
      return;
    }

    setIsEnrolling(true);
    
    try {
      const userId = `driver_${Date.now()}`;
      const result = await enrollBiometric(userId);
      
      if (result.success) {
        const fingerprintTemplate = `bio-fp-${userId}-${Date.now()}`;
        onFingerprintEnroll(fingerprintTemplate);
        
        toast({
          title: "Enrollment Successful",
          description: "Fingerprint has been successfully enrolled",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Fingerprint enrollment error:", error);
      toast({
        title: "Enrollment Failed",
        description: error instanceof Error ? error.message : "Failed to enroll fingerprint",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
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
      
      {fingerprintData ? (
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
                disabled={!biometricSupported}
              >
                <Fingerprint className="h-4 w-4 mr-2" />
                {isEnrolling ? "Enrolling..." : "Enroll Fingerprint"}
              </Button>
              
              {!biometricSupported && (
                <div className="flex items-center justify-center mt-3 text-xs text-amber-600">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                  <span>Biometric authentication not supported</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700 flex items-start">
              <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              Place your finger on your device's fingerprint sensor when prompted
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverFingerprintEnroller;
