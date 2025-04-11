
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TrucksSection = () => {
  const { toast } = useToast();
  
  const showComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available shortly",
      variant: "default",
    });
  };

  const truckModels = [
    {
      name: "Tata Prima",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=300&h=200",
      price: "₹24.28 - 54.73 Lakh",
    },
    {
      name: "Mahindra Bolero Pickup",
      image: "https://images.unsplash.com/photo-1616789682173-99c81e7b633e?auto=format&fit=crop&q=80&w=300&h=200",
      price: "₹8.82 - 9.61 Lakh",
    },
    {
      name: "BharatBenz 3723R",
      image: "https://images.unsplash.com/photo-1566431970283-2db5cf68fef7?auto=format&fit=crop&q=80&w=300&h=200",
      price: "₹42.91 - 46.15 Lakh",
    },
    {
      name: "Eicher Pro 3015",
      image: "https://images.unsplash.com/photo-1563729517443-6c764d8029f4?auto=format&fit=crop&q=80&w=300&h=200",
      price: "₹17.74 - 18.32 Lakh",
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-3">Commercial Vehicles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {truckModels.map((truck, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img src={truck.image} alt={truck.name} className="w-full h-40 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <h4 className="text-white font-semibold">{truck.name}</h4>
                <p className="text-white text-sm">{truck.price}</p>
              </div>
            </div>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={showComingSoon}>
                  <Info className="h-4 w-4 mr-1" />
                  Specifications
                </Button>
                <Button size="sm" className="bg-titeh-primary hover:bg-blue-600" onClick={showComingSoon}>
                  Inquire Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button variant="outline" className="text-titeh-primary" onClick={showComingSoon}>
          View All Commercial Vehicles
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TrucksSection;
