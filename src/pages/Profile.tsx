
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        if (!user) return;
        
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, username, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error loading profile:', error);
          return;
        }
        
        if (data) {
          setFullName(data.full_name || '');
          setUsername(data.username || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      
      if (!user) return;
      
      const updates = {
        id: user.id,
        full_name: fullName,
        username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { returning: 'minimal' });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Profile updated!',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };
  
  // Get avatar fallback text from user's name or email
  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase();
    }
    
    return user?.email ? user.email[0].toUpperCase() : 'U';
  };

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <p>{fullName || 'Update your profile'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            
            <div className="pt-2 text-sm text-gray-500">
              <p>Email: {user?.email}</p>
              <p>Last signed in: {user?.last_sign_in_at ? format(new Date(user.last_sign_in_at), 'PPpp') : 'Never'}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button onClick={handleUpdateProfile} disabled={updating}>
              {updating ? 'Updating...' : 'Update Profile'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
