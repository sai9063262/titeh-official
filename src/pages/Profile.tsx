
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Camera } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<{
    full_name: string;
    username: string | null;
    avatar_url: string | null;
  }>({
    full_name: "",
    username: null,
    avatar_url: null,
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load profile data from the profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, username, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      // Set the profile state with data from the database or user metadata as fallback
      setProfile({
        full_name: data?.full_name || user.user_metadata.full_name || "",
        username: data?.username || null,
        avatar_url: data?.avatar_url || null,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      // Fallback to user metadata if available
      setProfile({
        full_name: user.user_metadata.full_name || "",
        username: null,
        avatar_url: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          username: profile.username,
          updated_at: new Date(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getAvatarFallback = () => {
    if (profile.full_name) {
      return profile.full_name
        .split(" ")
        .map(name => name[0])
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Profile Settings</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-titeh-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      {profile.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                      ) : null}
                      <AvatarFallback className="text-2xl bg-titeh-primary text-white">
                        {getAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-titeh-primary"
                      onClick={() => toast({
                        title: "Coming Soon",
                        description: "Avatar upload will be available in a future update.",
                      })}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="font-medium text-xl">{profile.full_name || "Update your name"}</h3>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.full_name}
                      onChange={e => setProfile({...profile, full_name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profile.username || ""}
                      onChange={e => setProfile({...profile, username: e.target.value})}
                      placeholder="Choose a unique username"
                    />
                    <p className="text-xs text-gray-500">
                      This will be used for mentions and your public profile.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      To change your email address, please contact support.
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={handleSaveProfile} 
                      className="bg-titeh-primary"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={() => toast({
                      title: "Coming Soon",
                      description: "Password change functionality will be available in a future update.",
                    })}
                    className="w-full sm:w-auto"
                  >
                    Change Password
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="text-red-500 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                    onClick={() => toast({
                      title: "Coming Soon",
                      description: "Account deletion functionality will be available in a future update.",
                    })}
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
