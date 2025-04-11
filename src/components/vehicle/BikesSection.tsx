
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BikesSection = () => {
  const { toast } = useToast();
  
  const showComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available shortly",
      variant: "default",
    });
  };

  const bikeModels = [
    {
      name: "Honda CB Shine",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=300&h=200",
      price: "₹78,536 - 83,336",
    },
    {
      name: "Hero Splendor Plus",
      image: "https://images.unsplash.com/photo-1560869713-2cc18418dd44?auto=format&fit=crop&q=80&w=300&h=200",
      price: "₹72,076 - 76,346",
    },
    {
      name: "Royal Enfield Classic 350",
      image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=300&h=200",
      price: "₹1.93 - 2.21 Lakh",
    },
    {
      name: "Bajaj Pulsar NS200",
      image: "https://images.unsplash.com/photo-1626266061368-46a8632bac35?auto=format&fit=crop&q=80&w=300&h=200",
      price: "₹1.40 - 1.42 Lakh",
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-3">Popular Bikes</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {bikeModels.map((bike, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img src={bike.image} alt={bike.name} className="w-full h-40 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <h4 className="text-white font-semibold">{bike.name}</h4>
                <p className="text-white text-sm">{bike.price}</p>
              </div>
            </div>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={showComingSoon}>
                  <Info className="h-4 w-4 mr-1" />
                  Details
                </Button>
                <Button size="sm" className="bg-titeh-primary hover:bg-blue-600" onClick={showComingSoon}>
                  Book Test Ride
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button variant="outline" className="text-titeh-primary" onClick={showComingSoon}>
          View All Bikes
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BikesSection;
