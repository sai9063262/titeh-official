
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { verifyFaceWithDatabase } from "@/utils/faceDetectionUtils";
import { Camera, UserCheck } from "lucide-react";

/**
 * FaceMatchButton
 * Enhanced button to verify driver photo with database using facial recognition
 * Now with improved UI feedback and animation
 */
const FaceMatchButton = ({
  imageDataUrl,
  onResult
}: {
  imageDataUrl: string | null;
  onResult?: (result: { matched: boolean; confidence: number; driverName?: string }) => void;
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ matched: boolean; confidence: number; driverName?: string } | null>(null);

  const handleCheck = async () => {
    if (!imageDataUrl) return;
    setIsChecking(true);
    // Add a small delay to show the checking animation
    try {
      const res = await verifyFaceWithDatabase(imageDataUrl);
      setResult(res);
      if (onResult) onResult(res);
    } catch (err) {
      console.error("Face verification error:", err);
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
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
        <div className={`rounded p-2 text-sm border ${result.matched ? "border-green-400 bg-green-50 text-green-700" : "border-red-400 bg-red-50 text-red-700"} mt-1 text-center`}>
          {result.matched ? (
            <>
              <span className="font-semibold">✅ Match: {result.driverName || 'Driver'}</span>
              <div className="text-xs mt-1">Confidence: {Math.round(result.confidence)}%</div>
            </>
          ) : (
            <>
              <span className="font-semibold">❌ No Match Found</span>
              <div className="text-xs mt-1">Confidence: {Math.round(result.confidence)}%</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceMatchButton;
