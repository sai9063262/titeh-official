
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronLeft, AlertTriangle, Search, Plus, X, Info, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Import sample data
import { penaltyPoints } from "@/utils/ExamData";

const PenaltyTracker = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddViolationOpen, setIsAddViolationOpen] = useState(false);
  const [userViolations, setUserViolations] = useState<{ id: number; date: string }[]>([]);
  const { toast } = useToast();
  
  // Filter violations based on search query
  const filteredViolations = penaltyPoints.filter((violation) => {
    return violation.violation.toLowerCase().includes(searchQuery.toLowerCase()) ||
           violation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           violation.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate total points for user violations
  const totalPoints = userViolations.reduce((total, userViolation) => {
    const violation = penaltyPoints.find(v => v.id === userViolation.id);
    return total + (violation ? violation.points : 0);
  }, 0);
  
  // Maximum points before license suspension
  const maxPoints = 12;
  const pointsPercentage = Math.min((totalPoints / maxPoints) * 100, 100);

  // Add user violation
  const addViolation = (violationId: number) => {
    setUserViolations([
      ...userViolations,
      { id: violationId, date: new Date().toISOString().split('T')[0] }
    ]);
    
    const violation = penaltyPoints.find(v => v.id === violationId);
    
    toast({
      title: "Violation Added",
      description: `${violation?.violation} has been added to your tracker.`,
    });
    
    setIsAddViolationOpen(false);
  };

  // Remove user violation
  const removeViolation = (index: number) => {
    const updatedViolations = [...userViolations];
    updatedViolations.splice(index, 1);
    setUserViolations(updatedViolations);
    
    toast({
      title: "Violation Removed",
      description: "The violation has been removed from your tracker.",
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Penalty Points Tracker</h1>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Your Penalty Status</h2>
              <p className="text-sm text-gray-600">
                Track your penalty points and avoid license suspension.
              </p>
            </div>
            <Button 
              onClick={() => setIsAddViolationOpen(true)} 
              className="mt-4 md:mt-0 bg-titeh-primary hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Violation
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Penalty Points</span>
              <div className="flex items-center">
                <span className={`font-bold text-lg ${pointsPercentage >= 75 ? 'text-red-500' : pointsPercentage >= 50 ? 'text-amber-500' : 'text-green-500'}`}>
                  {totalPoints}
                </span>
                <span className="text-gray-500 ml-1">/ {maxPoints}</span>
              </div>
            </div>
            <Progress 
              value={pointsPercentage} 
              className={`h-3 ${
                pointsPercentage >= 75 ? 'bg-red-500' : 
                pointsPercentage >= 50 ? 'bg-amber-500' : 
                'bg-green-500'
              }`}
            />
            <p className="text-xs text-gray-500 mt-2">
              {pointsPercentage >= 75 
                ? 'Warning: You are close to license suspension.' 
                : pointsPercentage >= 50 
                ? 'Caution: You have accumulated significant penalty points.' 
                : 'Good standing: Keep driving safely.'}
            </p>
          </div>

          {userViolations.length > 0 ? (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Your Violations</h3>
              <div className="space-y-3">
                {userViolations.map((userViolation, index) => {
                  const violation = penaltyPoints.find(v => v.id === userViolation.id);
                  return (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                      <div>
                        <p className="font-medium">{violation?.violation}</p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2 bg-red-50 text-red-700">
                            {violation?.points} points
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Date: {new Date(userViolation.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeViolation(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 border rounded-md bg-gray-50 mb-6">
              <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <h3 className="font-medium mb-1">No Violations Recorded</h3>
              <p className="text-sm text-gray-600 mb-4">
                You haven't recorded any traffic violations. Keep driving safely!
              </p>
              <Button 
                onClick={() => setIsAddViolationOpen(true)} 
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Record a Violation
              </Button>
            </div>
          )}

          <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
            <div className="flex items-start">
              <Info className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">License Suspension Warning</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Accumulating {maxPoints} or more penalty points within a 24-month period may result in 
                  license suspension for up to 6 months, as per Telangana RTO regulations.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <h2 className="text-lg font-semibold mb-4">Penalty Points Reference</h2>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search violations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4 mb-6">
          {filteredViolations.map((violation) => (
            <Card key={violation.id} className="overflow-hidden">
              <div className="p-5">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">{violation.violation}</h3>
                      <Badge className="ml-2 bg-red-50 text-red-700">
                        {violation.points} points
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{violation.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-gray-50">
                        {violation.category}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-50">
                        Fine: {violation.fine}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addViolation(violation.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add to My Tracker
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredViolations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No violations found for your search criteria.</p>
              <Button 
                variant="link" 
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>

        <Card className="p-6">
          <div className="flex items-start">
            <TrendingUp className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Most Common Violations</h3>
              <p className="text-sm text-gray-600 mt-1">
                Based on Telangana RTO data, the most common traffic violations are:
              </p>
              <ol className="list-decimal pl-5 mt-2 text-sm text-gray-600 space-y-1">
                <li>Speeding (40% of all violations)</li>
                <li>Not wearing seatbelts/helmets (25%)</li>
                <li>Using mobile phones while driving (15%)</li>
                <li>Running red lights (10%)</li>
                <li>Dangerous lane changes (5%)</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Add Violation Dialog */}
        <Dialog open={isAddViolationOpen} onOpenChange={setIsAddViolationOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Traffic Violation</DialogTitle>
            </DialogHeader>
            
            <div className="mt-2">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search violations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="max-h-72 overflow-y-auto space-y-2">
                {filteredViolations.map((violation) => (
                  <div 
                    key={violation.id} 
                    className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => addViolation(violation.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{violation.violation}</p>
                        <p className="text-sm text-gray-600 mt-1">{violation.description}</p>
                      </div>
                      <Badge className="bg-red-50 text-red-700">
                        {violation.points} points
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {filteredViolations.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No violations found for your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddViolationOpen(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default PenaltyTracker;
