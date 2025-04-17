
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Search, Filter, Play, Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Import driving tips data
import { drivingTips } from "@/utils/ExamData";

const DrivingTips = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedTipId, setExpandedTipId] = useState<number | null>(null);
  const [bookmarkedTips, setBookmarkedTips] = useState<number[]>([]);

  // Filter tips by search term and category
  const filteredTips = drivingTips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        tip.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from tips
  const categories = ["all", ...Array.from(new Set(drivingTips.map(tip => tip.category)))];

  // Toggle tip expansion
  const toggleExpand = (id: number) => {
    setExpandedTipId(expandedTipId === id ? null : id);
  };

  // Toggle tip bookmark
  const toggleBookmark = (id: number) => {
    setBookmarkedTips(prev => 
      prev.includes(id) ? prev.filter(tipId => tipId !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Driving Tips & Techniques</h1>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search driving tips..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs value={selectedCategory} className="mb-6">
          <TabsList className="mb-4">
            {categories.map((category, index) => (
              <TabsTrigger 
                key={index} 
                value={category}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="space-y-4">
            {bookmarkedTips.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Bookmarked Tips</h2>
                <div className="space-y-4">
                  {drivingTips
                    .filter(tip => bookmarkedTips.includes(tip.id))
                    .map(tip => (
                      <TipCard 
                        key={tip.id} 
                        tip={tip} 
                        isExpanded={expandedTipId === tip.id}
                        isBookmarked={true}
                        onToggleExpand={toggleExpand}
                        onToggleBookmark={toggleBookmark}
                      />
                    ))
                  }
                </div>
              </div>
            )}
            
            <h2 className="text-lg font-semibold mb-4">All Tips & Techniques</h2>
            {filteredTips.length > 0 ? (
              <div className="space-y-4">
                {filteredTips.map(tip => (
                  <TipCard 
                    key={tip.id} 
                    tip={tip} 
                    isExpanded={expandedTipId === tip.id}
                    isBookmarked={bookmarkedTips.includes(tip.id)}
                    onToggleExpand={toggleExpand}
                    onToggleBookmark={toggleBookmark}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <Filter className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-medium">No driving tips found</p>
                <p className="text-sm text-gray-600">Try a different search term or category</p>
              </Card>
            )}
          </div>
        </Tabs>
        
        <Card className="p-4 bg-blue-50">
          <div className="flex items-start">
            <Filter className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Why Learn Proper Driving Techniques?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Mastering proper driving techniques not only makes you a safer driver but also:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-2">
                <li>Reduces wear and tear on your vehicle</li>
                <li>Improves fuel efficiency</li>
                <li>Decreases the risk of accidents</li>
                <li>Increases your confidence on the road</li>
                <li>Helps you pass your driving test</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

// Tip Card Component
const TipCard = ({ 
  tip, 
  isExpanded, 
  isBookmarked,
  onToggleExpand,
  onToggleBookmark
}: { 
  tip: any, 
  isExpanded: boolean,
  isBookmarked: boolean,
  onToggleExpand: (id: number) => void,
  onToggleBookmark: (id: number) => void
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{tip.title}</h3>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-8 w-8"
              onClick={() => onToggleBookmark(tip.id)}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-8 w-8"
              onClick={() => onToggleExpand(tip.id)}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </Button>
          </div>
        </div>
        
        <Badge 
          variant="outline" 
          className="mt-2 capitalize"
        >
          {tip.category}
        </Badge>
        
        {isExpanded && (
          <div className="mt-4">
            <p className="text-gray-600 text-sm">{tip.description}</p>
            
            {tip.videoUrl && (
              <div className="mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Video Tutorial
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{tip.title}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="aspect-w-16 aspect-h-9">
                        {/* Video player would go here */}
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                          <Play className="h-12 w-12 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DrivingTips;
