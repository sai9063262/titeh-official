
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Settings2, Camera, Map, Bell, MessageSquare, 
  Calendar, CreditCard, FileText, Save, AlertTriangle, 
  CheckCircle2, RefreshCw, Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  category: string;
  last_updated: string;
}

const UpdateFeatures = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [activeCategory, setActiveCategory] = useState("verification");

  useEffect(() => {
    // Simulated features - in a real app, you'd fetch this from Supabase
    const defaultFeatures: FeatureFlag[] = [
      // Verification Features
      {
        id: "1",
        name: "License Verification",
        key: "license_verification",
        description: "Enable license number verification for drivers",
        enabled: true,
        category: "verification",
        last_updated: new Date().toISOString()
      },
      {
        id: "2",
        name: "Facial Recognition",
        key: "facial_recognition",
        description: "Enable facial recognition for driver verification",
        enabled: true,
        category: "verification",
        last_updated: new Date().toISOString()
      },
      {
        id: "3",
        name: "Torch/Flashlight",
        key: "torch_flashlight",
        description: "Enable camera flashlight for low-light verification",
        enabled: true,
        category: "verification",
        last_updated: new Date().toISOString()
      },
      
      // Notification Features
      {
        id: "4",
        name: "Push Notifications",
        key: "push_notifications",
        description: "Send push notifications for important alerts",
        enabled: true,
        category: "notifications",
        last_updated: new Date().toISOString()
      },
      {
        id: "5",
        name: "Email Alerts",
        key: "email_alerts",
        description: "Send email notifications for critical updates",
        enabled: false,
        category: "notifications",
        last_updated: new Date().toISOString()
      },
      {
        id: "6",
        name: "In-App Notifications",
        key: "in_app_notifications",
        description: "Show in-app notification badges and alerts",
        enabled: true,
        category: "notifications",
        last_updated: new Date().toISOString()
      },
      
      // AI Features
      {
        id: "7",
        name: "T-Helper AI Assistant",
        key: "t_helper",
        description: "Enable the AI assistant for answering user questions",
        enabled: true,
        category: "ai_features",
        last_updated: new Date().toISOString()
      },
      {
        id: "8",
        name: "Smart Suggestions",
        key: "smart_suggestions",
        description: "Show AI-powered suggestions based on user activity",
        enabled: false,
        category: "ai_features",
        last_updated: new Date().toISOString()
      },
      {
        id: "9",
        name: "Voice Commands",
        key: "voice_commands",
        description: "Enable voice command functionality",
        enabled: false,
        category: "ai_features",
        last_updated: new Date().toISOString()
      },
      
      // Payment Features
      {
        id: "10",
        name: "Online Challan Payment",
        key: "online_challan_payment",
        description: "Allow users to pay challans online",
        enabled: true,
        category: "payments",
        last_updated: new Date().toISOString()
      },
      {
        id: "11",
        name: "UPI Integration",
        key: "upi_integration",
        description: "Enable UPI payment options",
        enabled: true,
        category: "payments",
        last_updated: new Date().toISOString()
      },
      {
        id: "12",
        name: "Card Payments",
        key: "card_payments",
        description: "Enable credit/debit card payment options",
        enabled: true,
        category: "payments",
        last_updated: new Date().toISOString()
      }
    ];
    
    setFeatures(defaultFeatures);
    
    // Setup real-time listener for feature flag updates
    const channel = supabase
      .channel('feature_flag_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'feature_flags' 
      }, (payload) => {
        // In a real implementation, you would refresh features from the database
        console.log('Feature flags changed:', payload);
        // fetchFeatures();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleToggleFeature = (id: string) => {
    const updatedFeatures = features.map(feature => {
      if (feature.id === id) {
        return {
          ...feature,
          enabled: !feature.enabled,
          last_updated: new Date().toISOString()
        };
      }
      return feature;
    });
    
    setFeatures(updatedFeatures);
    
    // In a real app, you would update in Supabase here
    // const featureToUpdate = updatedFeatures.find(f => f.id === id);
    // const { data, error } = await supabase
    //   .from('feature_flags')
    //   .update({ enabled: featureToUpdate.enabled })
    //   .eq('id', id);
    
    toast({
      title: "Feature updated",
      description: `Feature status has been updated successfully.`,
    });
  };

  const handleSaveAll = () => {
    setLoading(true);
    
    // Simulate saving to the database
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Features Saved",
        description: "All feature flag changes have been saved successfully",
      });
      
      // In a real app, you would batch update to Supabase here
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-titeh-primary">Update Features</h1>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleSaveAll}
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
                  Save All Changes
                </>
              )}
            </Button>
            
            <div className="flex items-center">
              <Settings2 className="h-5 w-5 text-titeh-primary mr-2" />
              <span>Feature Management</span>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="mb-6">
                <TabsTrigger value="verification">
                  <Camera className="h-4 w-4 mr-2" />
                  Verification
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="ai_features">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Features
                </TabsTrigger>
                <TabsTrigger value="payments">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payments
                </TabsTrigger>
              </TabsList>
              
              {["verification", "notifications", "ai_features", "payments"].map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="space-y-4">
                    {features
                      .filter(feature => feature.category === category)
                      .map(feature => (
                        <div 
                          key={feature.id} 
                          className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50"
                        >
                          <div>
                            <h3 className="font-medium">{feature.name}</h3>
                            <p className="text-sm text-gray-500">
                              {feature.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Last updated: {new Date(feature.last_updated).toLocaleString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className={`px-2 py-1 rounded text-xs ${
                              feature.enabled 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {feature.enabled ? "Enabled" : "Disabled"}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`feature-${feature.id}`}
                                checked={feature.enabled}
                                onCheckedChange={() => handleToggleFeature(feature.id)}
                              />
                              <Label htmlFor={`feature-${feature.id}`} className="sr-only">
                                Toggle {feature.name}
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Feature Management Tips</h3>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      <li>Changes take effect immediately for all users</li>
                      <li>Test thoroughly before disabling critical features</li>
                      <li>Consider announcing major feature changes in Breaking News</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-md">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Security Notice</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Feature flag updates are logged in the admin audit trail. 
                      Only authorized administrators should change these settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UpdateFeatures;
