
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  requireAuth?: boolean;
  children?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ requireAuth = true, children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Check if user is a guest
  const isGuestUser = localStorage.getItem('isGuestUser') === 'true';

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-titeh-primary" />
      </div>
    );
  }

  // If auth is required and user is neither authenticated nor a guest, redirect to auth
  if (requireAuth && !isAuthenticated && !isGuestUser) {
    return <Navigate to="/auth" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;
