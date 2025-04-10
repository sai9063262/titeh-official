
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PromotionalCard = () => {
  return (
    <Card className="p-4 mb-6 bg-blue-50">
      <div className="flex items-start">
        <Info className="text-titeh-primary mr-2 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-medium">Enjoy flexible EMIs with a car loan from Bank of Maharashtra.</h3>
          <Button className="mt-2" variant="outline">OPEN</Button>
        </div>
      </div>
    </Card>
  );
};

export default PromotionalCard;
