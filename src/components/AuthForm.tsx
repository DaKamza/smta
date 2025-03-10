import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthMode = 'login' | 'register';

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmEmailMessage, setShowConfirmEmailMessage] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (mode === 'register' && !name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setShowConfirmEmailMessage(false);
    
    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          navigate('/');
        }
      } else {
        const result = await register(email, password, name);
        
        if (result.success) {
          setShowConfirmEmailMessage(true);
          toast.info('Please check your email to confirm your account before logging in.');
        } else if (result.error === 'already_registered') {
          toast.warning('This email is already registered. Please sign in instead.');
          setMode('login');
          setPassword('');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'login' ? 'register' : 'login');
    setErrors({});
    setShowConfirmEmailMessage(false);
  };

  return (
    <div className="mx-auto max-w-md w-full p-6 bg-white dark:bg-black border rounded-xl shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          {mode === 'login' ? 'Sign In' : 'Create an Account'}
        </h2>
        <p className="text-muted-foreground mt-1">
          {mode === 'login' 
            ? 'Sign in to access your tasks' 
            : 'Register to start managing your tasks'}
        </p>
      </div>
      
      {showConfirmEmailMessage && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Email confirmation required</p>
            <p className="text-sm">Please check your inbox and confirm your email address before logging in.</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={isLoading}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name}</p>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            className={errors.password ? 'border-destructive' : ''}
          />
          {errors.password && (
            <p className="text-destructive text-xs">{errors.password}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-6" 
          disabled={isLoading}
        >
          {isLoading && <Loader2 size={16} className="mr-2 animate-spin" />}
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          {' '}
          <button
            type="button"
            onClick={toggleMode}
            className="text-primary hover:underline font-medium"
            disabled={isLoading}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
