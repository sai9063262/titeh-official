
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Filter, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Folder,
  FolderOpen,
  FileImage,
  FilePdf,
  FileArchive,
  FileSpreadsheet,
  PenTool,
  Star,
  Printer
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TELANGANA_DISTRICTS } from "@/types/safety";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
  id: string;
  name: string;
  type: "license" | "registration" | "insurance" | "challan" | "permit" | "fitness" | "manual" | "guide";
  format: "pdf" | "image" | "doc" | "xls";
  district: string;
  issueDate: string;
  expiryDate?: string;
  category: string;
  description: string;
  isFavorite: boolean;
  size: string;
  preview?: string;
}

const DocumentDisplay = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");
  
  // Generate sample documents
  useEffect(() => {
    const documentTypes = ["license", "registration", "insurance", "challan", "permit", "fitness", "manual", "guide"];
    const fileFormats = ["pdf", "image", "doc", "xls"];
    const categories = [
      "Driver Documents", 
      "Vehicle Documents", 
      "Traffic Guidelines", 
      "Regulatory Forms",
      "Safety Manuals",
      "Official Notifications"
    ];
    
    const sampleDocuments: Document[] = [];
    
    // Generate 30-40 sample documents
    const numDocuments = Math.floor(Math.random() * 10) + 30;
    
    for (let i = 0; i < numDocuments; i++) {
      const type = documentTypes[Math.floor(Math.random() * documentTypes.length)] as "license" | "registration" | "insurance" | "challan" | "permit" | "fitness" | "manual" | "guide";
      const format = fileFormats[Math.floor(Math.random() * fileFormats.length)] as "pdf" | "image" | "doc" | "xls";
      const district = TELANGANA_DISTRICTS[Math.floor(Math.random() * TELANGANA_DISTRICTS.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      // Generate issue date within last 2 years
      const issueDate = new Date();
      issueDate.setFullYear(issueDate.getFullYear() - Math.floor(Math.random() * 2));
      issueDate.setMonth(Math.floor(Math.random() * 12));
      issueDate.setDate(Math.floor(Math.random() * 28) + 1);
      
      // Some documents have expiry dates
      let expiryDate: string | undefined;
      if (['license', 'registration', 'insurance', 'permit', 'fitness'].includes(type)) {
        const expiry = new Date(issueDate);
        expiry.setFullYear(expiry.getFullYear() + 1 + Math.floor(Math.random() * 4));
        expiryDate = expiry.toISOString().split('T')[0];
      }
      
      let name = "";
      let description = "";
      
      switch (type) {
        case "license":
          name = `Driver License - ${district} RTO`;
          description = "Official driver license document with verification details";
          break;
        case "registration":
          name = `Vehicle Registration Certificate - ${district}`;
          description = "Vehicle registration document with ownership details";
          break;
        case "insurance":
          name = `Vehicle Insurance Policy - ${Math.floor(Math.random() * 999) + 1000}`;
          description = "Insurance policy document for registered vehicle";
          break;
        case "challan":
          name = `E-Challan Payment Receipt - ${Math.floor(Math.random() * 9999) + 10000}`;
          description = "Payment receipt for traffic violation fine";
          break;
        case "permit":
          name = `Commercial Vehicle Permit - ${district}`;
          description = "Operating permit for commercial transportation vehicle";
          break;
        case "fitness":
          name = `Vehicle Fitness Certificate - ${Math.floor(Math.random() * 999) + 1000}`;
          description = "Safety fitness certification for vehicle operation";
          break;
        case "manual":
          name = `Traffic Safety Manual - ${district} Region`;
          description = "Complete guide to traffic safety regulations and best practices";
          break;
        case "guide":
          name = `Road Signs and Signals Guide - ${Math.random() > 0.5 ? 'Telugu' : 'English'}`;
          description = "Reference guide for all traffic signs and signals";
          break;
      }
      
      const fileSize = `${Math.floor(Math.random() * 4900) + 100} KB`;
      
      sampleDocuments.push({
        id: `doc-${i + 1}`,
        name,
        type,
        format,
        district,
        issueDate: issueDate.toISOString().split('T')[0],
        expiryDate,
        category,
        description,
        isFavorite: Math.random() > 0.8,
        size: fileSize,
        preview: format === 'image' ? `https://source.unsplash.com/random/800x1000/?document,${type}` : undefined
      });
    }
    
    setDocuments(sampleDocuments);
    setIsLoading(false);
  }, []);
  
  // Apply filters
  useEffect(() => {
    let result = [...documents];
    
    // Filter by document type
    if (selectedDocType !== "all") {
      result = result.filter(doc => doc.type === selectedDocType);
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(doc => doc.category === selectedCategory);
    }
    
    // Filter by district
    if (selectedDistrict !== "all") {
      result = result.filter(doc => doc.district === selectedDistrict);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        doc => doc.name.toLowerCase().includes(query) || 
               doc.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredDocuments(result);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [documents, selectedDocType, selectedCategory, selectedDistrict, searchQuery]);
  
  const pageSize = currentView === "grid" ? 12 : 8;
  const totalPages = Math.ceil(filteredDocuments.length / pageSize);
  const paginatedDocuments = filteredDocuments.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  
  const toggleFavorite = (id: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        return { ...doc, isFavorite: !doc.isFavorite };
      }
      return doc;
    }));
    
    toast({
      title: "Favorite Updated",
      description: "Document has been updated in your favorites",
    });
  };
  
  const viewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsPreviewOpen(true);
  };
  
  const downloadDocument = (doc: Document) => {
    toast({
      title: "Download Started",
      description: `${doc.name} is being downloaded to your device`,
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get unique categories for the filter
  const categories = Array.from(new Set(documents.map(doc => doc.category)));
  
  const getFileIcon = (format: "pdf" | "image" | "doc" | "xls", size: string = "h-10 w-10") => {
    switch (format) {
      case "pdf":
        return <FilePdf className={`${size} text-red-500`} />;
      case "image":
        return <FileImage className={`${size} text-blue-500`} />;
      case "doc":
        return <FileText className={`${size} text-blue-600`} />;
      case "xls":
        return <FileSpreadsheet className={`${size} text-green-600`} />;
    }
  };
  
  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "license": return "Driver License";
      case "registration": return "Vehicle Registration";
      case "insurance": return "Insurance Policy";
      case "challan": return "E-Challan";
      case "permit": return "Vehicle Permit";
      case "fitness": return "Fitness Certificate";
      case "manual": return "Traffic Manual";
      case "guide": return "Reference Guide";
      default: return type;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-titeh-primary">Document Display</h1>
            <p className="text-gray-500">Access and manage driver and vehicle documents</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={currentView === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentView("grid")}
              className={currentView === "grid" ? "bg-titeh-primary" : ""}
            >
              <Folder className="h-4 w-4" />
            </Button>
            <Button 
              variant={currentView === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentView("list")}
              className={currentView === "list" ? "bg-titeh-primary" : ""}
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toast({
                title: "Print Function",
                description: "Printing functionality will be available in the next update",
              })}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-64 space-y-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Folders</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-blue-50 text-blue-900">
                    <div className="flex items-center">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      <span>All Documents</span>
                    </div>
                    <span className="text-xs bg-blue-100 rounded-full px-2 py-0.5">{documents.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-100">
                    <div className="flex items-center">
                      <Folder className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Driver Documents</span>
                    </div>
                    <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                      {documents.filter(d => d.category === "Driver Documents").length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-100">
                    <div className="flex items-center">
                      <Folder className="h-4 w-4 mr-2 text-green-500" />
                      <span>Vehicle Documents</span>
                    </div>
                    <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                      {documents.filter(d => d.category === "Vehicle Documents").length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-100">
                    <div className="flex items-center">
                      <Folder className="h-4 w-4 mr-2 text-red-500" />
                      <span>Safety Manuals</span>
                    </div>
                    <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                      {documents.filter(d => d.category === "Safety Manuals").length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-100">
                    <div className="flex items-center">
                      <Folder className="h-4 w-4 mr-2 text-purple-500" />
                      <span>Regulatory Forms</span>
                    </div>
                    <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                      {documents.filter(d => d.category === "Regulatory Forms").length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-100">
                    <div className="flex items-center">
                      <Folder className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Favorites</span>
                    </div>
                    <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                      {documents.filter(d => d.isFavorite).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="py-0 space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Document Type</label>
                  <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="license">Driver License</SelectItem>
                      <SelectItem value="registration">Vehicle Registration</SelectItem>
                      <SelectItem value="insurance">Insurance Policy</SelectItem>
                      <SelectItem value="challan">E-Challan</SelectItem>
                      <SelectItem value="permit">Vehicle Permit</SelectItem>
                      <SelectItem value="fitness">Fitness Certificate</SelectItem>
                      <SelectItem value="manual">Traffic Manual</SelectItem>
                      <SelectItem value="guide">Reference Guide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">District</label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {TELANGANA_DISTRICTS.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start py-1.5 border-b">
                    <Eye className="h-3.5 w-3.5 mt-0.5 mr-2 text-blue-500" />
                    <div>
                      <p className="font-medium">License viewed</p>
                      <p className="text-gray-500 text-xs">10 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start py-1.5 border-b">
                    <Download className="h-3.5 w-3.5 mt-0.5 mr-2 text-green-500" />
                    <div>
                      <p className="font-medium">Registration downloaded</p>
                      <p className="text-gray-500 text-xs">1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start py-1.5 border-b">
                    <Star className="h-3.5 w-3.5 mt-0.5 mr-2 text-amber-500" />
                    <div>
                      <p className="font-medium">Added to favorites</p>
                      <p className="text-gray-500 text-xs">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start py-1.5">
                    <PenTool className="h-3.5 w-3.5 mt-0.5 mr-2 text-purple-500" />
                    <div>
                      <p className="font-medium">Form filled</p>
                      <p className="text-gray-500 text-xs">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1 space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="Search documents..." 
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={() => toast({
                      title: "Advanced Search",
                      description: "Advanced search features will be available in the next update",
                    })}
                    variant="outline"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-titeh-primary"></div>
                  </div>
                ) : paginatedDocuments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <FileText className="h-16 w-16 mb-4" />
                    <h3 className="text-lg font-medium">No Documents Found</h3>
                    <p>Try adjusting your search or filters</p>
                  </div>
                ) : currentView === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {paginatedDocuments.map(doc => (
                      <div 
                        key={doc.id} 
                        className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => viewDocument(doc)}
                      >
                        <div className="flex justify-between mb-3">
                          {getFileIcon(doc.format)}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(doc.id);
                            }}
                            className="text-gray-400 hover:text-amber-500"
                          >
                            <Star className={`h-5 w-5 ${doc.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                          </button>
                        </div>
                        
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">{doc.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{doc.format.toUpperCase()} • {doc.size}</p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{formatDate(doc.issueDate)}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                            {getDocumentTypeLabel(doc.type)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-lg divide-y">
                    {paginatedDocuments.map(doc => (
                      <div 
                        key={doc.id} 
                        className="p-4 hover:bg-gray-50 transition-all cursor-pointer"
                        onClick={() => viewDocument(doc)}
                      >
                        <div className="flex items-start gap-3">
                          {getFileIcon(doc.format, "h-8 w-8")}
                          <div className="flex-grow">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{doc.name}</h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-1">{doc.description}</p>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(doc.id);
                                }}
                                className="text-gray-400 hover:text-amber-500 ml-2"
                              >
                                <Star className={`h-5 w-5 ${doc.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                              </button>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex gap-2 text-xs">
                                <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                                  {getDocumentTypeLabel(doc.type)}
                                </span>
                                <span className="text-gray-500">
                                  {doc.format.toUpperCase()} • {doc.size}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadDocument(doc);
                                  }}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewDocument(doc);
                                  }}
                                  className="text-green-500 hover:text-green-700"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {!isLoading && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <p className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Documents Overview</CardTitle>
                <CardDescription>Summary of document storage</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary">
                  <TabsList className="mb-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="bytype">By Type</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Total Documents</p>
                        <p className="text-2xl font-semibold">{documents.length}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">Driver Documents</p>
                        <p className="text-2xl font-semibold">{documents.filter(d => d.type === "license").length}</p>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <p className="text-sm text-amber-600">Vehicle Documents</p>
                        <p className="text-2xl font-semibold">{documents.filter(d => ["registration", "insurance", "permit", "fitness"].includes(d.type)).length}</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600">Manuals & Guides</p>
                        <p className="text-2xl font-semibold">{documents.filter(d => ["manual", "guide"].includes(d.type)).length}</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="bytype">
                    <div className="space-y-3">
                      {["license", "registration", "insurance", "challan", "permit", "fitness", "manual", "guide"].map(type => {
                        const count = documents.filter(d => d.type === type).length;
                        const percentage = Math.round((count / documents.length) * 100);
                        
                        return (
                          <div key={type} className="p-3 border rounded-lg">
                            <div className="flex justify-between mb-1">
                              <p className="font-medium">{getDocumentTypeLabel(type)}</p>
                              <p className="text-sm">{count} ({percentage}%)</p>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-titeh-primary rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                  <TabsContent value="recent">
                    <div className="space-y-3">
                      {documents.slice(0, 5).map(doc => (
                        <div key={doc.id} className="flex items-center p-2 border-b">
                          {getFileIcon(doc.format, "h-6 w-6")}
                          <div className="ml-3 flex-grow">
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-500">{formatDate(doc.issueDate)}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => viewDocument(doc)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Document Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getFileIcon(selectedDocument.format, "h-6 w-6")}
                  <span className="text-sm">{selectedDocument.format.toUpperCase()} • {selectedDocument.size}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleFavorite(selectedDocument.id)}
                  >
                    <Star className={`h-4 w-4 mr-1 ${selectedDocument.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                    {selectedDocument.isFavorite ? "Favorited" : "Favorite"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => downloadDocument(selectedDocument)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Document Type</p>
                  <p className="font-medium">{getDocumentTypeLabel(selectedDocument.type)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{selectedDocument.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Issue Date</p>
                  <p className="font-medium">{formatDate(selectedDocument.issueDate)}</p>
                </div>
                {selectedDocument.expiryDate && (
                  <div>
                    <p className="text-gray-500">Expiry Date</p>
                    <p className="font-medium">{formatDate(selectedDocument.expiryDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">District</p>
                  <p className="font-medium">{selectedDocument.district}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Description</p>
                <p>{selectedDocument.description}</p>
              </div>
              
              <div className="border rounded-lg p-4 min-h-[300px] bg-gray-50 flex items-center justify-center">
                {selectedDocument.format === "image" && selectedDocument.preview ? (
                  <img 
                    src={selectedDocument.preview} 
                    alt={selectedDocument.name}
                    className="max-h-[400px] object-contain"
                  />
                ) : selectedDocument.format === "pdf" ? (
                  <div className="text-center">
                    <FilePdf className="h-16 w-16 mx-auto text-red-500 mb-4" />
                    <p className="text-lg font-medium">PDF Document Preview</p>
                    <p className="text-sm text-gray-500">PDF preview will be available in the next update</p>
                  </div>
                ) : (
                  <div className="text-center">
                    {getFileIcon(selectedDocument.format, "h-16 w-16 mx-auto mb-4")}
                    <p className="text-lg font-medium">{selectedDocument.format.toUpperCase()} Document</p>
                    <p className="text-sm text-gray-500">Preview not available for this file type</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DocumentDisplay;
