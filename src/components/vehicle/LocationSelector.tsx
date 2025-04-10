
import { Button } from "@/components/ui/button";

interface LocationSelectorProps {
  location: string;
  setLocation: (location: string) => void;
}

const LocationSelector = ({ location, setLocation }: LocationSelectorProps) => {
  return (
    <div className="flex items-center mb-6">
      <select 
        className="border border-gray-300 rounded-md p-2 w-full md:w-60"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="HYDERABAD">HYDERABAD</option>
        <option value="NEW DELHI">NEW DELHI</option>
        <option value="MUMBAI">MUMBAI</option>
      </select>
      
      <Button className="ml-4 bg-titeh-primary hover:bg-blue-600">
        My Garage
      </Button>
    </div>
  );
};

export default LocationSelector;
