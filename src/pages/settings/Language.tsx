
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Language = () => {
  const languages = [
    "Telugu", "Hindi", "English", "Marathi", "Tamil",
    "Kannada", "Bengali", "Gujarati", "Punjabi", "Malayalam", "Odia"
  ];
  
  const { toast } = useToast();
  
  const selectLanguage = (language: string) => {
    toast({
      title: "Language Changed",
      description: `App language changed to ${language}`,
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/settings" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Language Settings</h1>
        </div>
        
        <Card className="p-4 mb-6">
          <p className="mb-4 text-gray-600">Select your preferred language for the app interface.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {languages.map((language, index) => (
              <Button
                key={index}
                variant={language === "English" ? "default" : "outline"}
                className={language === "English" ? "bg-titeh-primary hover:bg-blue-600" : ""}
                onClick={() => selectLanguage(language)}
              >
                {language}
              </Button>
            ))}
          </div>
        </Card>
        
        <Card className="p-4 bg-blue-50">
          <h2 className="font-semibold mb-2">Language Support</h2>
          <p className="text-sm text-gray-600">The app currently supports 11 languages. Your content will be displayed in your selected language when available.</p>
        </Card>
      </div>
    </Layout>
  );
};

export default Language;
