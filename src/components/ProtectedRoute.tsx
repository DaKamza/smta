
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log('ProtectedRoute mounted, auth state:', { 
      isAuthenticated: !!user, 
      isLoading,
      user: user ? `User ID: ${user.id.substring(0, 8)}...` : 'No user'
    });
  }, [user, isLoading]);

  console.log('ProtectedRoute render state:', { isAuthenticated: !!user, isLoading });

  if (isLoading) {
    console.log('Auth is still loading, showing loading spinner');
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to auth page');
    return <Navigate to="/auth" replace />;
  }

  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
