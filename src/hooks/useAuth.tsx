
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (session && session.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
          } else if (data) {
            setUser({
              id: data.id,
              email: data.email,
              name: data.name
            });
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
        } else if (data) {
          setUser({
            id: data.id,
            email: data.email,
            name: data.name
          });
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-check-password-12345',
      });
      
      if (authError && 
          (authError.message.includes('Invalid login credentials') || 
           authError.message.includes('Invalid email or password'))) {
        console.log('User already exists based on auth check:', email);
        return { 
          success: false, 
          error: 'already_registered'
        };
      }

      const { data: existingUsers, error: lookupError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .limit(1);
        
      if (!lookupError && existingUsers && existingUsers.length > 0) {
        console.log('User already exists based on profiles check:', email);
        return { 
          success: false, 
          error: 'already_registered'
        };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error('Error during registration:', error);
        
        if (error.message.includes('already registered') || 
            error.message.includes('already exists') || 
            error.message.includes('already taken') ||
            error.message.includes('already in use') ||
            error.message.includes('email address is taken') ||
            error.message.toLowerCase().includes('duplicate') ||
            error.message.toLowerCase().includes('unique violation')) {
          
          console.log('User already exists based on signup error:', error.message);
          return { 
            success: false, 
            error: 'already_registered'
          };
        }
        
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return { success: true };
      } else {
        toast.error('Something went wrong during registration');
        return { success: false, error: 'unknown_error' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      return { success: false, error: 'unknown_error' };
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success('Login successful');
        return true;
      } else {
        toast.error('Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Logout failed');
      } else {
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Validate email format
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth?mode=updatePassword',
      });
      
      if (error) {
        console.error('Password reset error:', error);
        toast.error(error.message);
        return false;
      }

      toast.success('Password reset instructions have been sent to your email');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
