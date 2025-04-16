
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Newspaper, Save, Calendar, Clock, Eye, PlayCircle, Trash2, 
  FileEdit, CheckCircle2, AlertTriangle, RefreshCw, Plus
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  is_published: boolean;
  publish_date: string;
  expiry_date: string | null;
  author: string;
}

const BreakingNews = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [currentNews, setCurrentNews] = useState<NewsItem>({
    id: "",
    title: "",
    content: "",
    priority: "medium",
    is_published: false,
    publish_date: new Date().toISOString(),
    expiry_date: null,
    author: "Admin User"
  });
  
  useEffect(() => {
    // Simulate fetching news from database
    fetchNewsItems();
    
    // Setup real-time listener for news updates
    const channel = supabase
      .channel('news_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'breaking_news' 
      }, (payload) => {
        // In a real implementation, you would refresh news from the database
        console.log('News changed:', payload);
        fetchNewsItems();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchNewsItems = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('breaking_news')
      //   .select('*')
      //   .order('publish_date', { ascending: false });
      
      // Simulated data
      const data: NewsItem[] = [
        {
          id: "1",
          title: "Important Traffic Advisory",
          content: "Due to ongoing road repairs on the National Highway, expect delays between 10:00 AM and 4:00 PM for the next three days. Please plan your journey accordingly.",
          priority: "high",
          is_published: true,
          publish_date: new Date().toISOString(),
          expiry_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          author: "Traffic Control Department"
        },
        {
          id: "2",
          title: "New License Renewal Procedure",
          content: "Starting next month, license renewals will require an online appointment. The new system aims to reduce waiting times and improve service efficiency.",
          priority: "medium",
          is_published: true,
          publish_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          expiry_date: null,
          author: "RTO Office"
        },
        {
          id: "3",
          title: "App Maintenance Notice",
          content: "The app will undergo scheduled maintenance this weekend. Services will be unavailable from Saturday 11:00 PM to Sunday 2:00 AM.",
          priority: "low",
          is_published: false,
          publish_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          expiry_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          author: "System Administrator"
        }
      ];
      
      setNewsItems(data);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: "Error",
        description: "Failed to load news items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewNews = () => {
    setCurrentNews({
      id: "",
      title: "",
      content: "",
      priority: "medium",
      is_published: false,
      publish_date: new Date().toISOString(),
      expiry_date: null,
      author: "Admin User"
    });
    setEditMode(true);
  };

  const handleEditNews = (news: NewsItem) => {
    setCurrentNews(news);
    setEditMode(true);
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm("Are you sure you want to delete this news item?")) {
      try {
        // In a real app, this would delete from Supabase
        // const { error } = await supabase
        //   .from('breaking_news')
        //   .delete()
        //   .eq('id', id);
        
        // Simulate deletion
        setNewsItems(newsItems.filter(item => item.id !== id));
        
        toast({
          title: "News Deleted",
          description: "The news item has been deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting news:", error);
        toast({
          title: "Error",
          description: "Failed to delete news item",
          variant: "destructive",
        });
      }
    }
  };

  const handleTogglePublish = async (id: string, currentState: boolean) => {
    try {
      // In a real app, this would update Supabase
      // const { error } = await supabase
      //   .from('breaking_news')
      //   .update({ is_published: !currentState })
      //   .eq('id', id);
      
      // Simulate update
      setNewsItems(newsItems.map(item => 
        item.id === id 
          ? { ...item, is_published: !currentState }
          : item
      ));
      
      toast({
        title: currentState ? "News Unpublished" : "News Published",
        description: `The news item has been ${currentState ? "unpublished" : "published"} successfully`,
      });
    } catch (error) {
      console.error("Error toggling publish state:", error);
      toast({
        title: "Error",
        description: "Failed to update news publish status",
        variant: "destructive",
      });
    }
  };

  const handleSaveNews = async () => {
    setLoading(true);
    
    try {
      if (!currentNews.title || !currentNews.content) {
        toast({
          title: "Missing Information",
          description: "Please provide a title and content for the news",
          variant: "destructive",
        });
        return;
      }
      
      // In a real app, this would save to Supabase
      if (currentNews.id) {
        // Update existing news
        // const { error } = await supabase
        //   .from('breaking_news')
        //   .update({
        //     title: currentNews.title,
        //     content: currentNews.content,
        //     priority: currentNews.priority,
        //     is_published: currentNews.is_published,
        //     publish_date: currentNews.publish_date,
        //     expiry_date: currentNews.expiry_date,
        //     author: currentNews.author
        //   })
        //   .eq('id', currentNews.id);
        
        // Simulate update
        setNewsItems(newsItems.map(item => 
          item.id === currentNews.id ? currentNews : item
        ));
      } else {
        // Create new news
        const newId = Date.now().toString();
        
        // const { error } = await supabase
        //   .from('breaking_news')
        //   .insert({
        //     title: currentNews.title,
        //     content: currentNews.content,
        //     priority: currentNews.priority,
        //     is_published: currentNews.is_published,
        //     publish_date: currentNews.publish_date,
        //     expiry_date: currentNews.expiry_date,
        //     author: currentNews.author
        //   });
        
        // Simulate creation
        setNewsItems([
          { ...currentNews, id: newId },
          ...newsItems
        ]);
      }
      
      setEditMode(false);
      toast({
        title: "News Saved",
        description: "The news item has been saved successfully",
      });
    } catch (error) {
      console.error("Error saving news:", error);
      toast({
        title: "Error",
        description: "Failed to save news item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-titeh-primary">Breaking News Management</h1>
          
          <div className="flex items-center space-x-4">
            {!editMode && (
              <Button onClick={handleCreateNewNews}>
                <Plus className="mr-2 h-4 w-4" />
                Create News
              </Button>
            )}
            
            <div className="flex items-center">
              <Newspaper className="h-5 w-5 text-titeh-primary mr-2" />
              <span>News Editor</span>
            </div>
          </div>
        </div>
        
        {editMode ? (
          <Card>
            <CardHeader>
              <CardTitle>{currentNews.id ? "Edit News" : "Create News"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    value={currentNews.title}
                    onChange={(e) => setCurrentNews({...currentNews, title: e.target.value})}
                    placeholder="Enter news title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={currentNews.content}
                    onChange={(e) => setCurrentNews({...currentNews, content: e.target.value})}
                    rows={6}
                    placeholder="Enter news content"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={currentNews.priority} 
                      onValueChange={(value: "high" | "medium" | "low") => 
                        setCurrentNews({...currentNews, priority: value})
                      }
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input 
                      id="author"
                      value={currentNews.author}
                      onChange={(e) => setCurrentNews({...currentNews, author: e.target.value})}
                      placeholder="Enter author name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="publish_date">Publish Date</Label>
                    <Input 
                      id="publish_date"
                      type="datetime-local"
                      value={new Date(currentNews.publish_date).toISOString().slice(0, 16)}
                      onChange={(e) => setCurrentNews({
                        ...currentNews, 
                        publish_date: new Date(e.target.value).toISOString()
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
                    <Input 
                      id="expiry_date"
                      type="datetime-local"
                      value={currentNews.expiry_date ? new Date(currentNews.expiry_date).toISOString().slice(0, 16) : ""}
                      onChange={(e) => setCurrentNews({
                        ...currentNews, 
                        expiry_date: e.target.value ? new Date(e.target.value).toISOString() : null
                      })}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={currentNews.is_published}
                    onCheckedChange={(checked) => setCurrentNews({...currentNews, is_published: checked})}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    onClick={handleSaveNews}
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
                        Save News
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>News Items</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-titeh-primary" />
                </div>
              ) : newsItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Newspaper className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No news items yet</p>
                  <p className="text-sm mt-1">Create your first news item</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Publish Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newsItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.priority === "high" 
                              ? "bg-red-100 text-red-800" 
                              : item.priority === "medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.is_published
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {item.is_published ? "Published" : "Draft"}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(item.publish_date)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditNews(item)}>
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleTogglePublish(item.id, item.is_published)}
                            >
                              {item.is_published ? (
                                <Eye className="h-4 w-4 text-gray-500" />
                              ) : (
                                <PlayCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => handleDeleteNews(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Breaking News Tips</h3>
                      <ul className="text-sm text-gray-600 mt-1 space-y-1">
                        <li>Use high priority for urgent safety announcements</li>
                        <li>Schedule important news in advance</li>
                        <li>Set an expiry date for temporary announcements</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Important Notice</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Published news will be immediately visible to all app users. 
                        Verify all information for accuracy before publishing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default BreakingNews;
