
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileEdit, Save, Eye, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  section: string;
  last_updated: string;
  updated_by: string;
}

const EditContent = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("safety-tips");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    // Simulated content - in a real app, you'd fetch this from Supabase
    const defaultContent: ContentItem[] = [
      {
        id: "1",
        title: "Road Safety Tips",
        content: "# Road Safety Tips\n\n- Always wear your seatbelt\n- Maintain safe distance from other vehicles\n- Follow traffic signals\n- Don't use mobile phones while driving\n- Don't drive under influence of alcohol",
        section: "safety-tips",
        last_updated: new Date().toISOString(),
        updated_by: "admin@titeh.app"
      },
      {
        id: "2",
        title: "Frequently Asked Questions",
        content: "# FAQs\n\n## How do I renew my license?\nVisit your nearest RTO office with the required documents.\n\n## How can I check my challan status?\nYou can check your challan status on the app's PayChallan section or on the government website.",
        section: "faq",
        last_updated: new Date().toISOString(),
        updated_by: "admin@titeh.app"
      },
      {
        id: "3",
        title: "App Usage Guide",
        content: "# How to Use TITEH App\n\n1. **Driver Verification**: Scan license or use facial recognition\n2. **Challan Payment**: View and pay challans\n3. **Traffic Safety**: Report incidents and check safety alerts\n4. **RTO Exam**: Practice for your driving test",
        section: "app-guide",
        last_updated: new Date().toISOString(),
        updated_by: "admin@titeh.app"
      }
    ];
    
    setContent(defaultContent);
    
    // Setup real-time listener for content updates
    const channel = supabase
      .channel('content_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'content' 
      }, (payload) => {
        // In a real implementation, you would refresh content from the database
        console.log('Content changed:', payload);
        // fetchContent();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Set edit content based on active tab
    const activeContent = content.find(item => item.section === activeTab);
    if (activeContent) {
      setEditTitle(activeContent.title);
      setEditContent(activeContent.content);
    }
  }, [activeTab, content]);

  const handleSaveContent = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Update the content state
      const updatedContent = content.map(item => {
        if (item.section === activeTab) {
          return {
            ...item,
            title: editTitle,
            content: editContent,
            last_updated: new Date().toISOString()
          };
        }
        return item;
      });
      
      setContent(updatedContent);
      setLoading(false);
      
      toast({
        title: "Content Updated",
        description: "Changes have been saved successfully",
      });
      
      // In a real app, you would save to Supabase here
      // const { data, error } = await supabase
      //   .from('content')
      //   .update({ title: editTitle, content: editContent })
      //   .eq('section', activeTab);
    }, 1000);
  };

  // Simple markdown-like renderer
  const renderMarkdown = (text: string) => {
    let html = text;
    
    // Convert headers
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-3">$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-2">$1</h2>');
    
    // Convert lists
    html = html.replace(/^\- (.*$)/gm, '<li class="ml-5">$1</li>');
    html = html.replace(/^\d\. (.*$)/gm, '<li class="ml-5 list-decimal">$1</li>');
    
    // Convert paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-2">');
    
    // Wrap with paragraph tags
    html = '<p class="mb-2">' + html + '</p>';
    
    // Fix lists
    html = html.replace(/<\/p><p class="mb-2"><li/g, '<ul class="mb-3 list-disc"><li');
    html = html.replace(/<\/li><\/p>/g, '</li></ul>');
    
    return html;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-titeh-primary">Edit Content</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FileEdit className="h-5 w-5 text-titeh-primary mr-2" />
              <span>Admin Editor</span>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="safety-tips">Safety Tips</TabsTrigger>
                <TabsTrigger value="faq">FAQs</TabsTrigger>
                <TabsTrigger value="app-guide">App Guide</TabsTrigger>
              </TabsList>
              
              <div className="flex justify-end mb-4 space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? (
                    <>
                      <FileEdit className="mr-2 h-4 w-4" />
                      Edit Mode
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleSaveContent}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
              
              {content.map((item) => (
                <TabsContent key={item.section} value={item.section}>
                  {previewMode ? (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-3">{editTitle}</h2>
                      <div 
                        className="prose max-w-none p-4 border rounded-md bg-gray-50"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(editContent) }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input 
                          id="title"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="content">Content (Supports simple markdown)</Label>
                        <Textarea
                          id="content"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={15}
                          className="font-mono"
                        />
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <p>Last updated: {new Date(item.last_updated).toLocaleString()}</p>
                        <p>By: {item.updated_by}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Content Editor Tips</h3>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>Use # for main headings and ## for subheadings</li>
                    <li>Use - for bullet points</li>
                    <li>Use 1. 2. 3. for numbered lists</li>
                    <li>Leave a blank line between paragraphs</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-amber-50 p-4 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Content Guidelines</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    All content should be accurate, clear, and follow government regulations. 
                    Changes will be immediately visible to all users of the application.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditContent;
