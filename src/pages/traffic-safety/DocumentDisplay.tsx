
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, Search, FileText, Download, Share2, AlertTriangle, Eye, File } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const DocumentDisplay = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Sample documents data
  const documents = [
    {
      id: 'doc-001',
      title: 'Driver License',
      type: 'identification',
      issued: '2023-05-15',
      expires: '2028-05-14',
      status: 'valid',
      fileType: 'pdf',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 'doc-002',
      title: 'Vehicle Registration',
      type: 'vehicle',
      issued: '2022-11-10',
      expires: '2027-11-09',
      status: 'valid',
      fileType: 'pdf',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 'doc-003',
      title: 'Insurance Certificate',
      type: 'insurance',
      issued: '2024-01-05',
      expires: '2025-01-04',
      status: 'valid',
      fileType: 'pdf',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 'doc-004',
      title: 'Emission Test Certificate',
      type: 'compliance',
      issued: '2023-08-20',
      expires: '2024-08-19',
      status: 'expiring',
      fileType: 'pdf',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 'doc-005',
      title: 'Commercial Driving Permit',
      type: 'permit',
      issued: '2022-04-12',
      expires: '2023-04-11',
      status: 'expired',
      fileType: 'pdf',
      thumbnail: '/placeholder.svg'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                     (activeTab === 'valid' && doc.status === 'valid') ||
                     (activeTab === 'expiring' && doc.status === 'expiring') ||
                     (activeTab === 'expired' && doc.status === 'expired');
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return <FileText className="h-8 w-8 text-blue-500" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Digital Documents Display</h1>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="valid">Valid</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status === 'valid' && <Check className="h-3 w-3 mr-1" />}
                          {doc.status === 'expiring' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>ID: {doc.id}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center w-16 h-16">
                          {getDocumentIcon(doc.fileType)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Issued: {new Date(doc.issued).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">Expires: {new Date(doc.expires).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600 capitalize">Type: {doc.type}</p>
                        </div>
                      </div>
                    </CardContent>
                    <Separator />
                    <CardFooter className="flex justify-between pt-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No documents found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DocumentDisplay;
