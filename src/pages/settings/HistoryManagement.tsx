
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, History, Trash2, Download, Calendar, Search, Car, FileText, CreditCard, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const HistoryManagement = () => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [historyType, setHistoryType] = useState<string | null>(null);
  const { toast } = useToast();
  
  const openConfirmDialog = (type: string) => {
    setHistoryType(type);
    setConfirmDialogOpen(true);
  };
  
  const clearHistory = () => {
    setConfirmDialogOpen(false);
    
    toast({
      title: "History Cleared",
      description: historyType === "all" 
        ? "All history has been cleared" 
        : `${historyType} history has been cleared`,
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
          <h1 className="text-2xl font-bold text-titeh-primary">History Management</h1>
        </div>
        
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <History className="text-titeh-primary mr-2" />
              <h2 className="text-lg font-semibold">Browsing History</h2>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => openConfirmDialog("browsing")}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <Search className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm">Vehicle details for TS07AB1234</span>
              </div>
              <span className="text-xs text-gray-500">April 10, 2025</span>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <Car className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm">PUC verification</span>
              </div>
              <span className="text-xs text-gray-500">April 9, 2025</span>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm">License procedure details</span>
              </div>
              <span className="text-xs text-gray-500">April 9, 2025</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <CreditCard className="text-titeh-primary mr-2" />
              <h2 className="text-lg font-semibold">Payment History</h2>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => openConfirmDialog("payment")}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm">Challan payment: ₹500</span>
              </div>
              <span className="text-xs text-gray-500">April 8, 2025</span>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm">License renewal payment: ₹300</span>
              </div>
              <span className="text-xs text-gray-500">March 25, 2025</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download Payment History
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Search className="text-titeh-primary mr-2" />
              <h2 className="text-lg font-semibold">Search History</h2>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => openConfirmDialog("search")}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
          
          <div className="space-y-3 mb-3">
            <div className="flex items-center p-3 border rounded-md hover:bg-gray-50">
              <Search className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-sm">"renewal procedure"</span>
            </div>
            
            <div className="flex items-center p-3 border rounded-md hover:bg-gray-50">
              <Search className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-sm">"challan payment"</span>
            </div>
            
            <div className="flex items-center p-3 border rounded-md hover:bg-gray-50">
              <Search className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-sm">"driving license test"</span>
            </div>
          </div>
        </Card>
        
        <div className="flex justify-center mb-6">
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => openConfirmDialog("all")}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All History
          </Button>
        </div>
        
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center">
            <Calendar className="text-titeh-primary mr-2" />
            <h2 className="font-semibold">History Retention</h2>
          </div>
          <p className="text-sm text-gray-600 mt-2">By default, your history is stored for 90 days. You can clear it manually at any time.</p>
        </Card>
        
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Clear History</DialogTitle>
              <DialogDescription>
                Are you sure you want to clear your {historyType === "all" ? "entire" : historyType} history? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={clearHistory}
              >
                Yes, Clear History
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default HistoryManagement;
