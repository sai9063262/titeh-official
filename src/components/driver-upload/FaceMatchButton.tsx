
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { verifyFaceWithDatabase } from "@/utils/faceDetectionUtils";

/**
 * FaceMatchButton
 * Standalone button to verify driver photo with database using facial recognition
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
    const res = await verifyFaceWithDatabase(imageDataUrl);
    setResult(res);
    if (onResult) onResult(res);
    setIsChecking(false);
  };

  return (
    <div className="mt-2">
      <Button
        type="button"
        onClick={handleCheck}
        disabled={!imageDataUrl || isChecking}
        className="w-full bg-green-700 hover:bg-green-800 mb-2"
      >
        {isChecking ? "Checking..." : "Check Match in Database"}
      </Button>
      {result && (
        <div className={`rounded p-2 text-sm border ${result.matched ? "border-green-400 text-green-700" : "border-red-400 text-red-700"} mt-1 text-center`}>
          {result.matched ? `✅ Match: ${result.driverName || 'Driver'} (${Math.round(result.confidence)}%)` : `❌ No Match (${Math.round(result.confidence)}%)`}
        </div>
      )}
    </div>
  );
};

export default FaceMatchButton;

