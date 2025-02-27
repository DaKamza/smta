
import Layout from '@/components/Layout';
import AuthForm from '@/components/AuthForm';

const Auth = () => {
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
