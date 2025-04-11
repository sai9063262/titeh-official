
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, FileText, Newsletter as NewsletterIcon, Bell } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [subscriptions, setSubscriptions] = useState({
    traffic: true,
    licenses: true,
    regulations: false,
    events: false
  });
  const { toast } = useToast();
  
  const handleSubscribe = () => {
    if (!email && !mobile) {
      toast({
        title: "Please enter email or mobile",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Subscription successful",
      description: "You'll receive the next newsletter issue",
      variant: "default",
    });
    
    setEmail("");
    setMobile("");
  };

  const newsletters = [
    {
      id: 1,
      title: "New Traffic Regulations in Telangana",
      date: "April 2025",
      description: "Updates on new traffic rules and penalties implemented across Telangana state.",
      link: "#"
    },
    {
      id: 2,
      title: "Driving License Process Simplified",
      date: "March 2025",
      description: "A guide to the newly simplified process for obtaining and renewing driving licenses.",
      link: "#"
    },
    {
      id: 3,
      title: "Vehicle Registration Going Digital",
      date: "February 2025",
      description: "Learn about the complete digitization of the vehicle registration process.",
      link: "#"
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Newsletter</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-titeh-primary" />
                <span>Subscribe</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Email Address</label>
                <Input 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Mobile Number (Optional)</label>
                <Input 
                  placeholder="Enter mobile number" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-500 block">Topics (Select at least one)</label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="traffic" 
                    checked={subscriptions.traffic}
                    onCheckedChange={(checked) => 
                      setSubscriptions({...subscriptions, traffic: checked as boolean})}
                  />
                  <label
                    htmlFor="traffic"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Traffic Updates
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="licenses" 
                    checked={subscriptions.licenses}
                    onCheckedChange={(checked) => 
                      setSubscriptions({...subscriptions, licenses: checked as boolean})}
                  />
                  <label
                    htmlFor="licenses"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    License & Registration
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="regulations" 
                    checked={subscriptions.regulations}
                    onCheckedChange={(checked) => 
                      setSubscriptions({...subscriptions, regulations: checked as boolean})}
                  />
                  <label
                    htmlFor="regulations"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    New Regulations
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="events" 
                    checked={subscriptions.events}
                    onCheckedChange={(checked) => 
                      setSubscriptions({...subscriptions, events: checked as boolean})}
                  />
                  <label
                    htmlFor="events"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Events & Campaigns
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-titeh-primary hover:bg-blue-600" onClick={handleSubscribe}>
                Subscribe
              </Button>
            </CardFooter>
          </Card>
          
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Latest Newsletters</h2>
            <div className="space-y-4">
              {newsletters.map(newsletter => (
                <Card key={newsletter.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{newsletter.title}</CardTitle>
                      <span className="text-xs text-gray-500">{newsletter.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{newsletter.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={newsletter.link} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-2 h-4 w-4" />
                        Read Newsletter
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <Card className="p-6 bg-blue-50 mb-8">
          <div className="flex items-start gap-4">
            <NewsletterIcon className="h-10 w-10 text-titeh-primary" />
            <div>
              <h3 className="font-semibold text-lg mb-1">About Our Newsletter</h3>
              <p className="text-gray-700 mb-3">
                The TITEH Newsletter provides monthly updates on transport policies, 
                traffic management initiatives, vehicle registration processes, and driving 
                license procedures. Stay informed about the latest developments in 
                Telangana's transportation sector.
              </p>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-titeh-primary" />
                <span className="text-sm">Published monthly • Unsubscribe anytime</span>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-medium mb-2">Archives</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["Jan 2025", "Dec 2024", "Nov 2024", "Oct 2024", "Sep 2024", "Aug 2024", "Jul 2024", "Jun 2024"].map((month, index) => (
              <Button key={index} variant="outline" size="sm" className="text-xs">
                {month}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Newsletter;
