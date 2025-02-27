
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';

// Define types
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// In a real app, this would connect to a backend API
// For now, we'll use localStorage
const LOCAL_STORAGE_KEY = 'student-tasks-auth';

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    }
  }, [user, isLoading]);

  // Register new user
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // In a real app, this would call an API
      // For now, just simulate a registration
      
      // Check if user already exists
      const existingUsers = localStorage.getItem('student-tasks-users');
      const users = existingUsers ? JSON.parse(existingUsers) : {};
      
      if (users[email]) {
        toast.error('User with this email already exists');
        return false;
      }
      
      // "Store" the user (in a real app, the password would be hashed)
      users[email] = { password, name };
      localStorage.setItem('student-tasks-users', JSON.stringify(users));
      
      // Create user session
      const newUser = {
        id: crypto.randomUUID(),
        email,
        name
      };
      
      setUser(newUser);
      toast.success('Registration successful');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      return false;
    }
  };

  // Login existing user
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would call an API
      // For now, just simulate a login
      
      const existingUsers = localStorage.getItem('student-tasks-users');
      if (!existingUsers) {
        toast.error('Invalid credentials');
        return false;
      }
      
      const users = JSON.parse(existingUsers);
      const userData = users[email];
      
      if (!userData || userData.password !== password) {
        toast.error('Invalid credentials');
        return false;
      }
      
      // Create user session
      const loggedInUser = {
        id: crypto.randomUUID(), // In a real app, this would be a stable ID
        email,
        name: userData.name
      };
      
      setUser(loggedInUser);
      toast.success('Login successful');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
