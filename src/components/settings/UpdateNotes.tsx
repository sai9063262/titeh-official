
import { Card } from "@/components/ui/card";
import { AlertTriangle, SettingsIcon } from "lucide-react";

const UpdateNotes = () => {
  return (
    <div className="space-y-4 mb-8">
      <Card className="p-4 bg-blue-50">
        <div className="flex items-start">
          <AlertTriangle className="text-blue-500 mr-2 mt-1 flex-shrink-0" size={20} />
          <div>
            <h2 className="font-semibold mb-1">What's New in v1.2.0</h2>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Added Bluetooth and Wi-Fi device connectivity</li>
              <li>Enhanced security with AES-256 encryption</li>
              <li>Added Admin Driver Management panel</li>
              <li>Google Sheets integration for driver data</li>
              <li>New T-Helper AI Assistant for answering questions</li>
            </ul>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-amber-50">
        <h2 className="font-semibold mb-2 flex items-center">
          <SettingsIcon className="text-amber-500 mr-2" size={18} />
          Coming Soon
        </h2>
        <p className="text-sm text-gray-600">Enhanced driver verification and real-time traffic alerts will be available in the next update.</p>
      </Card>
    </div>
  );
};

export default UpdateNotes;
