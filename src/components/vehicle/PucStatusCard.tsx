
import { Check, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const PucStatusCard = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const { toast } = useToast();

  const handleSearch = () => {
    toast({
      title: "PUC Status",
      description: "PUC is valid until 30/09/2025",
      variant: "default",
    });
  };

  return (
    <Card className="p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2 flex items-center">
        <Check className="text-green-500 mr-2" />
        Verify PUC Status
      </h2>
      <div className="flex flex-col md:flex-row gap-2">
        <Input 
          placeholder="Enter Vehicle Number (e.g., GJ 05 AB 0000)" 
          className="flex-1"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />
        <Button onClick={handleSearch} className="bg-titeh-primary hover:bg-blue-600">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </Card>
  );
};

export default PucStatusCard;
