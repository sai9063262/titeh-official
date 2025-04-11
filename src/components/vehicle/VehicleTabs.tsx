
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FourWheelersSection from "./FourWheelersSection";
import BikesSection from "./BikesSection";
import TrucksSection from "./TrucksSection";
import LoansSection from "./LoansSection";
import CalculatorsSection from "./CalculatorsSection";
import FindNearbySection from "./FindNearbySection";

interface VehicleTabsProps {
  defaultValue?: string;
}

const VehicleTabs = ({ defaultValue = "cars" }: VehicleTabsProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Top Features</h2>
      <Tabs defaultValue={defaultValue}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="cars" className="w-1/3">Cars</TabsTrigger>
          <TabsTrigger value="bikes" className="w-1/3">Bikes</TabsTrigger>
          <TabsTrigger value="trucks" className="w-1/3">Trucks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cars">
          <FourWheelersSection />
          <LoansSection />
          <CalculatorsSection />
          <FindNearbySection />
        </TabsContent>
        
        <TabsContent value="bikes">
          <BikesSection />
          <LoansSection />
          <CalculatorsSection />
        </TabsContent>
        
        <TabsContent value="trucks">
          <TrucksSection />
          <FindNearbySection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleTabs;
