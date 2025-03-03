
import Layout from '@/components/Layout';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { user, isLoading } = useAuth();

  // If user is already authenticated, redirect to dashboard
  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto pt-10">
        <h1 className="text-center mb-8 font-bold tracking-tight">Student Task Manager</h1>
        <AuthForm />
      </div>
    </Layout>
  );
};

export default Auth;
