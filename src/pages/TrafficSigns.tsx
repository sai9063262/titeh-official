
import { useState } from "react";
import Layout from "@/components/Layout";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface TrafficSign {
  id: number;
  name: string;
  description: string;
  image: string;
  category: "regulatory" | "warning" | "informative" | "other";
}

const trafficSigns: TrafficSign[] = [
  { id: 1, name: "Stop Sign", description: "Octagon, Red with white 'STOP', means complete stop at intersection.", image: "/placeholder.svg", category: "regulatory" },
  { id: 2, name: "Yield Sign", description: "Upside-down triangle with red border, White with 'YIELD', means yield to traffic.", image: "/placeholder.svg", category: "regulatory" },
  { id: 3, name: "Speed Limit Sign", description: "Rectangle, White with black '35 MPH', means maximum legal speed.", image: "/placeholder.svg", category: "regulatory" },
  { id: 4, name: "No Entry Sign", description: "Circle with red border, White with red circle and bar, means no entry.", image: "/placeholder.svg", category: "regulatory" },
  { id: 5, name: "One Way Sign", description: "Rectangle, White with black 'ONE WAY' and arrow, means single-direction traffic.", image: "/placeholder.svg", category: "regulatory" },
  { id: 6, name: "Pedestrian Crossing Sign", description: "Diamond, Yellow with black pedestrian symbol, warns of crossing.", image: "/placeholder.svg", category: "warning" },
  { id: 7, name: "No U-Turn Sign", description: "Circle with red border, White with red circle and U-arrow, prohibits U-turns.", image: "/placeholder.svg", category: "regulatory" },
  { id: 8, name: "School Zone Sign", description: "Pentagon, Yellow with black schoolchildren symbol, indicates school zone.", image: "/placeholder.svg", category: "warning" },
  { id: 9, name: "Traffic Signal Ahead", description: "Diamond, Yellow with black traffic light, warns of upcoming signal.", image: "/placeholder.svg", category: "warning" },
  { id: 10, name: "Railroad Crossing Sign", description: "Circle, Yellow with black 'X' and 'RR', alerts to crossing.", image: "/placeholder.svg", category: "warning" },
  // Additional signs can be added here
];

const TrafficSigns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  
  const filteredSigns = trafficSigns.filter(sign => {
    // Filter by search term
    const matchesSearch = sign.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sign.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = filter === "all" || sign.category === filter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Traffic Signs</h1>
        
        <div className="mb-6">
          <div className="relative mb-4">
            <Input 
              placeholder="Search traffic signs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-titeh-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilter('all')}
            >
              All Signs
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'regulatory' ? 'bg-titeh-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilter('regulatory')}
            >
              Regulatory
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'warning' ? 'bg-titeh-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilter('warning')}
            >
              Warning
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'informative' ? 'bg-titeh-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilter('informative')}
            >
              Informative
            </button>
          </div>
        </div>
        
        {filteredSigns.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No traffic signs found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredSigns.map(sign => (
              <Card key={sign.id} className="overflow-hidden">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <img 
                    src={sign.image} 
                    alt={sign.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-titeh-primary">{sign.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{sign.description}</p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      sign.category === 'regulatory' ? 'bg-red-100 text-red-700' :
                      sign.category === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      sign.category === 'informative' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {sign.category.charAt(0).toUpperCase() + sign.category.slice(1)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TrafficSigns;
