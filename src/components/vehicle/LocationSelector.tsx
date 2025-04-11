
import { Button } from "@/components/ui/button";
import { Globe, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LocationSelectorProps {
  location: string;
  setLocation: (location: string) => void;
}

const LocationSelector = ({ location, setLocation }: LocationSelectorProps) => {
  const [language, setLanguage] = useState("English");
  const { toast } = useToast();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    toast({
      title: "Language Changed",
      description: `App language set to ${newLanguage}`,
      variant: "default",
    });
  };

  const handleMyGarage = () => {
    toast({
      title: "My Garage",
      description: "Accessing your registered vehicles",
      variant: "default",
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center mb-6 gap-4 md:gap-2">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2 flex-1 md:flex-auto">
          <MapPin className="text-titeh-primary h-4 w-4" />
          <select 
            className="border border-gray-300 rounded-md p-2 w-full md:w-60"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="HYDERABAD">HYDERABAD</option>
            <option value="NEW DELHI">NEW DELHI</option>
            <option value="MUMBAI">MUMBAI</option>
            <option value="BANGALORE">BANGALORE</option>
            <option value="CHENNAI">CHENNAI</option>
          </select>
        </div>
        
        <Button className="bg-titeh-primary hover:bg-blue-600" onClick={handleMyGarage}>
          My Garage
        </Button>
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 md:ml-auto">
        <Globe className="text-titeh-primary h-4 w-4" />
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Hindi">हिंदी</SelectItem>
            <SelectItem value="Telugu">తెలుగు</SelectItem>
            <SelectItem value="Tamil">தமிழ்</SelectItem>
            <SelectItem value="Marathi">मराठी</SelectItem>
            <SelectItem value="Bengali">বাংলা</SelectItem>
            <SelectItem value="Gujarati">ગુજરાતી</SelectItem>
            <SelectItem value="Kannada">ಕನ್ನಡ</SelectItem>
            <SelectItem value="Malayalam">മലയാളം</SelectItem>
            <SelectItem value="Punjabi">ਪੰਜਾਬੀ</SelectItem>
            <SelectItem value="Odia">ଓଡ଼ିଆ</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelector;
