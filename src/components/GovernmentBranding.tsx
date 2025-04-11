
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const GovernmentBranding = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-3 bg-gray-100 border-t">
      <div className="flex items-center gap-2">
        <img 
          src="https://www.morth.nic.in/sites/default/files/Main-Logo.png" 
          alt="Government of India" 
          className="h-10 w-auto"
        />
        <div className="text-xs">
          <p className="font-semibold">Government of India</p>
          <p>Ministry of Road Transport & Highways</p>
        </div>
      </div>
      
      <a 
        href="https://morth.nic.in/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs text-titeh-primary flex items-center gap-1 hover:underline"
      >
        Visit MoRTH Website <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
};

export default GovernmentBranding;
