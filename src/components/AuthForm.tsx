import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthMode = 'login' | 'register' | 'forgotPassword';

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmEmailMessage, setShowConfirmEmailMessage] = useState(false);
  
  const { login, register, resetPassword } = useAuth();
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
      } else if (mode === 'register') {
        const result = await register(email, password, name);
        
        if (result.success) {
          setShowConfirmEmailMessage(true);
          toast.info('Please check your email to confirm your account before logging in.');
        } else if (result.error === 'already_registered') {
          toast.warning('This email is already registered. Please sign in instead.', {
            duration: 5000,
            id: 'duplicate-email',
          });
          
          setMode('login');
          setPassword('');
          
          setTimeout(() => {
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
              passwordInput.focus();
            }
          }, 100);
        }
      } else if (mode === 'forgotPassword') {
        const success = await resetPassword(email);
        if (success) {
          toast.success('Password reset email sent. Please check your inbox.', {
            duration: 6000,
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setShowConfirmEmailMessage(false);
    if (newMode === 'forgotPassword') {
      setPassword('');
    }
  };

  return (
    <div className="mx-auto max-w-md w-full p-6 bg-white dark:bg-black border rounded-xl shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          {mode === 'login' 
            ? 'Sign In' 
            : mode === 'register'
            ? 'Create an Account'
            : 'Reset Password'}
        </h2>
        <p className="text-muted-foreground mt-1">
          {mode === 'login' 
            ? 'Sign in to access your tasks' 
            : mode === 'register'
            ? 'Register to start managing your tasks'
            : 'Enter your email to reset your password'}
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
        
        {mode !== 'forgotPassword' && (
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
        )}
        
        <Button 
          type="submit" 
          className="w-full mt-6" 
          disabled={isLoading}
        >
          {isLoading && <Loader2 size={16} className="mr-2 animate-spin" />}
          {mode === 'login' 
            ? 'Sign In' 
            : mode === 'register'
            ? 'Create Account'
            : 'Send Reset Instructions'}
        </Button>
      </form>
      
      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          {mode === 'forgotPassword' ? (
            <>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => toggleMode('login')}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Sign in
              </button>
            </>
          ) : mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => toggleMode('register')}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => toggleMode('login')}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Sign in
              </button>
            </>
          )}
        </p>
        {mode === 'login' && (
          <p className="text-sm">
            <button
              type="button"
              onClick={() => toggleMode('forgotPassword')}
              className="text-primary hover:underline font-medium"
              disabled={isLoading}
            >
              Forgot your password?
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
