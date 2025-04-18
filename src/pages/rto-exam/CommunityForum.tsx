
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  ChevronLeft, 
  MessageSquare, 
  Search, 
  ThumbsUp, 
  MessageCircle, 
  Clock, 
  Info,
  AlertTriangle,
  Plus,
  UserPlus,
  Filter,
  Flag
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const CommunityForum = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: ""
  });
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const { toast } = useToast();
  
  // Sample forum threads
  const forumThreads = [
    {
      id: 1,
      title: "How to prepare for RTO test?",
      content: "I'm applying for a two-wheeler license in Hyderabad. Any tips on preparing for the driving test? What should I focus on?",
      author: "Priya S.",
      date: "2025-04-15T10:30:00",
      category: "advice",
      likes: 24,
      replies: 8,
      tags: ["driving-test", "preparation", "tips"]
    },
    {
      id: 2,
      title: "Renewal experience at Khairatabad RTO",
      content: "I recently renewed my license at Khairatabad RTO office. The process was surprisingly smooth! Here's my experience...",
      author: "Rahul M.",
      date: "2025-04-12T14:15:00",
      category: "experience",
      likes: 36,
      replies: 12,
      tags: ["renewal", "khairatabad", "experience"]
    },
    {
      id: 3,
      title: "Traffic rule confusion: Right of way at roundabouts",
      content: "I'm confused about the right of way rules at roundabouts in Hyderabad. Who has priority? Can someone explain?",
      author: "Karthik V.",
      date: "2025-04-10T09:45:00",
      category: "question",
      likes: 18,
      replies: 15,
      tags: ["traffic-rules", "roundabout", "right-of-way"]
    },
    {
      id: 4,
      title: "Failed driving test twice - what am I doing wrong?",
      content: "I've failed my four-wheeler driving test twice now at Uppal RTO. The examiner says I'm not following lane discipline correctly. Any advice?",
      author: "Aakash R.",
      date: "2025-04-08T16:20:00",
      category: "advice",
      likes: 29,
      replies: 22,
      tags: ["driving-test", "failure", "help"]
    },
    {
      id: 5,
      title: "How accurate is the mock test in this app?",
      content: "I've been practicing with the mock tests in this app. Are they similar to the actual RTO computer test? Has anyone taken both?",
      author: "Sneha K.",
      date: "2025-04-05T11:10:00",
      category: "question",
      likes: 42,
      replies: 19,
      tags: ["mock-test", "computer-test", "comparison"]
    },
    {
      id: 6,
      title: "New traffic signal at Gachibowli junction - confusion",
      content: "There's a new traffic signal setup at Gachibowli junction and it's causing a lot of confusion. Has anyone else noticed this?",
      author: "Vikram T.",
      date: "2025-04-03T13:25:00",
      category: "discussion",
      likes: 56,
      replies: 31,
      tags: ["traffic-signal", "gachibowli", "junction"]
    },
    {
      id: 7,
      title: "Tips for parallel parking during driving test",
      content: "I'm struggling with parallel parking and my test is next week. Any tips or techniques that helped you master this?",
      author: "Anjali S.",
      date: "2025-04-01T15:40:00",
      category: "advice",
      likes: 38,
      replies: 24,
      tags: ["parallel-parking", "driving-test", "techniques"]
    },
    {
      id: 8,
      title: "Documents needed for international driving permit",
      content: "I'm traveling to the US next month and need an international driving permit. What documents do I need to apply at the RTO?",
      author: "Rohan J.",
      date: "2025-03-28T10:05:00",
      category: "question",
      likes: 21,
      replies: 9,
      tags: ["international", "permit", "documents"]
    },
    {
      id: 9,
      title: "Experience with online license application",
      content: "Just completed my license application online through the Parivahan site. Here's a step-by-step guide for those who need it...",
      author: "Divya R.",
      date: "2025-03-25T14:50:00",
      category: "experience",
      likes: 64,
      replies: 27,
      tags: ["online", "application", "guide"]
    },
    {
      id: 10,
      title: "Best driving schools in Jubilee Hills area?",
      content: "Looking for recommendations for good driving schools around Jubilee Hills. Budget isn't a concern, but quality instruction is important.",
      author: "Nikhil M.",
      date: "2025-03-22T09:30:00",
      category: "advice",
      likes: 31,
      replies: 18,
      tags: ["driving-school", "jubilee-hills", "recommendation"]
    }
  ];

  // Sample replies for a thread
  const sampleReplies = [
    {
      id: 1,
      author: "Rajesh K.",
      content: "I took my test at Khairatabad RTO last month. The key things they look for are: 1) Proper starting procedure, 2) Smooth clutch control, 3) Following signals, and 4) Confident turns. Practice these and you should be fine!",
      date: "2025-04-15T11:45:00",
      likes: 12
    },
    {
      id: 2,
      author: "Meena P.",
      content: "Make sure you know all the road signs perfectly. They often ask about those during the oral component of the test. The app's road sign recognition module is very helpful for this!",
      date: "2025-04-15T13:20:00",
      likes: 8
    },
    {
      id: 3,
      author: "Srinivas T.",
      content: "I'm an RTO officer (not in Hyderabad though). My advice: be confident but not overconfident. Many applicants fail because they're either too nervous or too casual. Follow all traffic rules strictly during your test - signals, speed limits, and lane discipline are key.",
      date: "2025-04-15T14:05:00",
      likes: 20
    },
    {
      id: 4,
      author: "Ananya B.",
      content: "I failed my first attempt because I didn't check mirrors properly before changing direction. They're really strict about this! Practice the habit of checking mirrors regularly even during your practice sessions.",
      date: "2025-04-16T09:30:00",
      likes: 5
    },
    {
      id: 5,
      author: "Harish M.",
      content: "The driving schools near RTOs often know exactly what the examiners look for. Consider taking a few lessons from them right before your test, even if you learned elsewhere. It helped me pass on my first attempt!",
      date: "2025-04-16T11:15:00",
      likes: 15
    },
    {
      id: 6,
      author: "Lakshmi K.",
      content: "Don't forget proper attire - wear comfortable clothes and closed shoes. I saw someone get sent back for wearing sandals! Also, arrive early so you're not rushed or stressed.",
      date: "2025-04-16T16:40:00",
      likes: 9
    },
    {
      id: 7,
      author: "Venkat R.",
      content: "The Mock Test Simulator in this app really helped me prepare for the written test. The questions are very similar to what you'll face. For the practical test, remember to use indicators even during the test - many forget this!",
      date: "2025-04-17T10:25:00",
      likes: 11
    },
    {
      id: 8,
      author: "Priya S.",
      content: "Thank you all for the helpful advice! I'm feeling much more confident now. I've been practicing mirror checks and signals regularly. Will update after my test next week!",
      date: "2025-04-17T18:10:00",
      likes: 14,
      isOP: true
    }
  ];

  // Filter threads based on search query and category
  const filteredThreads = forumThreads.filter((thread) => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === "all" || thread.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Create new forum post
  const createPost = () => {
    if (!newPost.title || !newPost.content) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your post",
        variant: "destructive",
      });
      return;
    }
    
    if (newPost.content.length > 500) {
      toast({
        title: "Content too long",
        description: "Post content cannot exceed 500 characters",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would save to Supabase
    toast({
      title: "Post submitted",
      description: "Your post has been submitted for approval by moderators",
    });
    
    setIsCreatePostOpen(false);
    setNewPost({ title: "", content: "" });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Community Discussion Forum</h1>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Join the Discussion</h2>
              <p className="text-sm text-gray-600">
                Share experiences, ask questions, and learn from fellow drivers.
              </p>
            </div>
            <Button 
              onClick={() => setIsCreatePostOpen(true)} 
              className="mt-4 md:mt-0 bg-titeh-primary hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create New Post
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search discussions..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="question">Questions</option>
                <option value="advice">Advice</option>
                <option value="experience">Experiences</option>
                <option value="discussion">Discussions</option>
              </select>
            </div>
          </div>

          <Tabs defaultValue="recent" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="recent">
                <Clock className="h-4 w-4 mr-2" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="popular">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Popular
              </TabsTrigger>
              <TabsTrigger value="unanswered">
                <MessageCircle className="h-4 w-4 mr-2" />
                Unanswered
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="mt-0">
              <div className="space-y-4">
                {filteredThreads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((thread) => (
                  <Card key={thread.id} className="overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedThread(thread)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium">{thread.title}</h3>
                        <Badge className={`
                          ${thread.category === 'question' ? 'bg-blue-100 text-blue-800' : 
                            thread.category === 'advice' ? 'bg-green-100 text-green-800' : 
                            thread.category === 'experience' ? 'bg-purple-100 text-purple-800' : 
                            'bg-amber-100 text-amber-800'}
                        `}>
                          {thread.category.charAt(0).toUpperCase() + thread.category.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{thread.content}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {thread.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <Avatar className="h-5 w-5 mr-2">
                            <AvatarFallback>{thread.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{thread.author}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(thread.date)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{thread.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{thread.replies}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="popular" className="mt-0">
              <div className="space-y-4">
                {filteredThreads.sort((a, b) => b.likes - a.likes).map((thread) => (
                  <Card key={thread.id} className="overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedThread(thread)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium">{thread.title}</h3>
                        <Badge className={`
                          ${thread.category === 'question' ? 'bg-blue-100 text-blue-800' : 
                            thread.category === 'advice' ? 'bg-green-100 text-green-800' : 
                            thread.category === 'experience' ? 'bg-purple-100 text-purple-800' : 
                            'bg-amber-100 text-amber-800'}
                        `}>
                          {thread.category.charAt(0).toUpperCase() + thread.category.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{thread.content}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {thread.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <Avatar className="h-5 w-5 mr-2">
                            <AvatarFallback>{thread.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{thread.author}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(thread.date)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{thread.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{thread.replies}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="unanswered" className="mt-0">
              <div className="space-y-4">
                {filteredThreads.filter(thread => thread.replies === 0).map((thread) => (
                  <Card key={thread.id} className="overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedThread(thread)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium">{thread.title}</h3>
                        <Badge className={`
                          ${thread.category === 'question' ? 'bg-blue-100 text-blue-800' : 
                            thread.category === 'advice' ? 'bg-green-100 text-green-800' : 
                            thread.category === 'experience' ? 'bg-purple-100 text-purple-800' : 
                            'bg-amber-100 text-amber-800'}
                        `}>
                          {thread.category.charAt(0).toUpperCase() + thread.category.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{thread.content}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {thread.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <Avatar className="h-5 w-5 mr-2">
                            <AvatarFallback>{thread.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{thread.author}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(thread.date)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{thread.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{thread.replies}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {filteredThreads.filter(thread => thread.replies === 0).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No unanswered threads found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {filteredThreads.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No discussions found for your search criteria.</p>
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
        </Card>

        <Card className="p-6">
          <div className="flex items-start">
            <Info className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Forum Guidelines</h3>
              <p className="text-sm text-gray-600 mt-1">
                To ensure a helpful and respectful community, please follow these guidelines:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                <li>Stay on topic (RTO exams, driving, traffic rules in Telangana)</li>
                <li>Be respectful to other community members</li>
                <li>Do not share personal information</li>
                <li>Posts are limited to 500 characters for clarity</li>
                <li>New posts require admin approval before appearing publicly</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Create Post Dialog */}
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="post-title" className="text-sm font-medium mb-1 block">
                  Post Title
                </label>
                <Input
                  id="post-title"
                  placeholder="Enter a clear, specific title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="post-content" className="text-sm font-medium mb-1 block">
                  Content (max 500 characters)
                </label>
                <Textarea
                  id="post-content"
                  placeholder="Describe your question or share your experience..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newPost.content.length}/500 characters
                </p>
              </div>
              <div>
                <label htmlFor="post-category" className="text-sm font-medium mb-1 block">
                  Category
                </label>
                <select
                  id="post-category"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="question">Question</option>
                  <option value="advice">Advice</option>
                  <option value="experience">Experience</option>
                  <option value="discussion">Discussion</option>
                </select>
              </div>
              <div>
                <label htmlFor="post-tags" className="text-sm font-medium mb-1 block">
                  Tags (comma separated)
                </label>
                <Input
                  id="post-tags"
                  placeholder="e.g., driving-test, license, hyderabad"
                />
              </div>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-md text-sm">
              <div className="flex items-start">
                <AlertTriangle className="text-amber-500 mr-2 mt-0.5 h-4 w-4" />
                <span>
                  Your post will be reviewed by moderators before being published.
                  This usually takes 24-48 hours.
                </span>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>Cancel</Button>
              <Button onClick={createPost} className="bg-titeh-primary hover:bg-blue-600">Submit Post</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Thread Detail Dialog */}
        <Dialog open={!!selectedThread} onOpenChange={(open) => !open && setSelectedThread(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedThread && (
              <>
                <DialogHeader>
                  <div className="flex justify-between items-start">
                    <DialogTitle>{selectedThread.title}</DialogTitle>
                    <Badge className={`
                      ${selectedThread.category === 'question' ? 'bg-blue-100 text-blue-800' : 
                        selectedThread.category === 'advice' ? 'bg-green-100 text-green-800' : 
                        selectedThread.category === 'experience' ? 'bg-purple-100 text-purple-800' : 
                        'bg-amber-100 text-amber-800'}
                    `}>
                      {selectedThread.category.charAt(0).toUpperCase() + selectedThread.category.slice(1)}
                    </Badge>
                  </div>
                </DialogHeader>
                
                <div className="mt-2">
                  <div className="mb-1 flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{selectedThread.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{selectedThread.author}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(selectedThread.date)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Like ({selectedThread.likes})
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        <Flag className="h-3 w-3 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md my-4">
                    <p className="text-gray-700 whitespace-pre-line">{selectedThread.content}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedThread.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-gray-50">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="my-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Replies ({sampleReplies.length})</h3>
                      <Button size="sm" className="bg-titeh-primary hover:bg-blue-600">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Add Reply
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {sampleReplies.map((reply) => (
                        <div key={reply.id} className={`p-4 border rounded-md ${reply.isOP ? 'border-blue-200 bg-blue-50' : ''}`}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{reply.author}</span>
                              {reply.isOP && (
                                <Badge className="ml-2 bg-blue-100 text-blue-800">Original Poster</Badge>
                              )}
                              <span className="mx-2 text-gray-500">•</span>
                              <span className="text-sm text-gray-500">{formatDate(reply.date)}</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              <span className="text-xs">{reply.likes}</span>
                            </Button>
                          </div>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Add Your Reply</h3>
                    <Textarea
                      placeholder="Share your thoughts, advice or experience..."
                      className="min-h-[100px] mb-2"
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Maximum 500 characters. Be respectful and on-topic.
                      </p>
                      <Button className="bg-titeh-primary hover:bg-blue-600">
                        Post Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CommunityForum;
