
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { verifyFaceWithDatabase } from "@/utils/faceDetectionUtils";
import { UserCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import driverService from "@/services/driver-service";

/**
 * FaceMatchButton
 * Enhanced button to verify driver photo with database using facial recognition
 * Now with improved UI feedback, animation, and real driver detection
 */
const FaceMatchButton = ({
  imageDataUrl,
  onResult
}: {
  imageDataUrl: string | null;
  onResult?: (result: { matched: boolean; confidence: number; driverName?: string; driverId?: string }) => void;
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ matched: boolean; confidence: number; driverName?: string; driverId?: string } | null>(null);
  const { toast } = useToast();
  const [driverDetails, setDriverDetails] = useState<any>(null);

  // When we get a driver ID from verification, fetch their details
  useEffect(() => {
    if (result?.matched && result?.driverId) {
      const fetchDriverDetails = async () => {
        try {
          const driver = await driverService.getDriverById(result.driverId);
          if (driver) {
            setDriverDetails(driver);
          }
        } catch (err) {
          console.error("Error fetching driver details:", err);
        }
      };
      
      fetchDriverDetails();
    } else {
      setDriverDetails(null);
    }
  }, [result]);

  const handleCheck = async () => {
    if (!imageDataUrl) return;
    setIsChecking(true);
    setResult(null);
    
    try {
      // Show a toast for better user feedback
      toast({
        title: "Verifying Driver",
        description: "Comparing with driver database...",
        variant: "default",
      });

      const res = await verifyFaceWithDatabase(imageDataUrl);
      setResult(res);
      if (onResult) onResult(res);
      
      // Show a toast notification with the result
      if (res.matched) {
        toast({
          title: "Driver Verified ✓",
          description: `Match found: ${res.driverName || 'Unknown driver'} (${Math.round(res.confidence)}% confidence)`,
          variant: "default",
        });
      } else {
        toast({
          title: "No Match Found",
          description: `Could not verify driver (${Math.round(res.confidence)}% confidence)`,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Face verification error:", err);
      toast({
        title: "Verification Error",
        description: "An error occurred during driver verification",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="mt-2">
      <Button
        type="button"
        onClick={handleCheck}
        disabled={!imageDataUrl || isChecking}
        className="w-full bg-green-700 hover:bg-green-800 mb-2 relative"
      >
        {isChecking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Verifying with Database...</span>
          </>
        ) : (
          <>
            <UserCheck className="h-4 w-4 mr-2" />
            <span>Verify Driver Identity</span>
          </>
        )}
      </Button>
      
      {result && (
        <div className={`rounded p-3 text-sm border ${result.matched ? "border-green-400 bg-green-50 text-green-700" : "border-red-400 bg-red-50 text-red-700"} mt-1 text-center flex flex-col gap-1`}>
          {result.matched ? (
            <>
              <span className="font-semibold text-base">✅ Match: {result.driverName || 'Driver'}</span>
              <div className="text-xs mt-1">Confidence: {Math.round(result.confidence)}%</div>
              
              {/* Show driver details when matched */}
              {driverDetails && (
                <div className="mt-2 text-left p-2 bg-white rounded border border-green-200">
                  <h4 className="font-medium text-sm border-b border-green-100 pb-1 mb-2">Driver Details:</h4>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                    <span className="font-medium">License:</span>
                    <span>{driverDetails.licenseNumber}</span>
                    
                    {driverDetails.validUntil && (
                      <>
                        <span className="font-medium">Valid Until:</span>
                        <span>{driverDetails.validUntil}</span>
                      </>
                    )}
                    
                    {driverDetails.vehicleClass && (
                      <>
                        <span className="font-medium">Class:</span>
                        <span>{driverDetails.vehicleClass}</span>
                      </>
                    )}
                    
                    {driverDetails.status && (
                      <>
                        <span className="font-medium">Status:</span>
                        <span className={`
                          ${driverDetails.status === 'valid' ? 'text-green-600' : ''}
                          ${driverDetails.status === 'expired' ? 'text-amber-600' : ''}
                          ${driverDetails.status === 'suspended' ? 'text-red-600' : ''}
                        `}>
                          {driverDetails.status.charAt(0).toUpperCase() + driverDetails.status.slice(1)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div className="text-xs mt-1">Driver record found in database</div>
            </>
          ) : (
            <>
              <span className="font-semibold text-base">❌ No Match Found</span>
              <div className="text-xs mt-1">Confidence: {Math.round(result.confidence)}%</div>
              <div className="text-xs mt-1">Driver may not be registered</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceMatchButton;
