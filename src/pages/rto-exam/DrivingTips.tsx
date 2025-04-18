
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, Search, Tag, Video, Eye, BookOpen, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Import sample driving tips from ExamData utility
import { drivingTips } from "@/utils/ExamData";

const DrivingTips = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTip, setSelectedTip] = useState<(typeof drivingTips)[0] | null>(null);
  
  // Filter tips based on search query and category
  const filteredTips = drivingTips.filter((tip) => {
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tip.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || tip.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(drivingTips.map(tip => tip.category))];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Driving Tips & Techniques</h1>
        </div>

        <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">Master Safe Driving</h2>
              <p className="text-sm text-gray-600 mb-4 md:mb-0">
                Learn essential driving techniques from experts to become a confident and safe driver.
              </p>
            </div>
            <Button className="bg-titeh-primary hover:bg-blue-600">
              <BookOpen className="h-4 w-4 mr-1" />
              Get Study Materials
            </Button>
          </div>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search driving tips..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-gray-400 mr-2" />
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filteredTips.map((tip) => (
            <Card key={tip.id} className="overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-lg">{tip.title}</h3>
                  <Badge className={`${
                    tip.category === 'safety' ? 'bg-red-100 text-red-800' : 
                    tip.category === 'awareness' ? 'bg-blue-100 text-blue-800' : 
                    tip.category === 'technique' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tip.description}</p>
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTip(tip)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  {tip.videoUrl && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-titeh-primary"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Watch Video
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTips.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No driving tips found for your search criteria.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        <Card className="p-6">
          <div className="flex items-start">
            <PlayCircle className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Featured Driving Technique</h3>
              <p className="text-sm text-gray-600 mt-1 mb-3">
                Learn how to master parallel parking, one of the most challenging techniques for new drivers.
              </p>
              <div className="bg-gray-100 rounded-md aspect-video flex items-center justify-center">
                <PlayCircle className="h-12 w-12 text-titeh-primary opacity-70" />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Click to watch the tutorial video</p>
            </div>
          </div>
        </Card>

        {/* Tip Detail Dialog */}
        <Dialog open={!!selectedTip} onOpenChange={(open) => !open && setSelectedTip(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTip?.title}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-2">
              <Badge className={`mb-3 ${
                selectedTip?.category === 'safety' ? 'bg-red-100 text-red-800' : 
                selectedTip?.category === 'awareness' ? 'bg-blue-100 text-blue-800' : 
                selectedTip?.category === 'technique' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {selectedTip?.category.charAt(0).toUpperCase() + selectedTip?.category.slice(1)}
              </Badge>
              
              <p className="text-gray-700 mb-6">{selectedTip?.description}</p>
              
              {selectedTip?.videoUrl && (
                <div>
                  <h4 className="font-medium mb-2">Instructional Video</h4>
                  <div className="bg-gray-100 rounded-md aspect-video flex items-center justify-center mb-4">
                    <PlayCircle className="h-12 w-12 text-titeh-primary opacity-70" />
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Practice Exercise</h4>
                <p className="text-sm text-gray-600">
                  Try implementing this technique during your next practice session. Start in a low-traffic area 
                  and gradually work your way up to more challenging environments as you gain confidence.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button onClick={() => setSelectedTip(null)} variant="outline">Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default DrivingTips;
