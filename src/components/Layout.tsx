
import { ReactNode } from "react";
import UserDropdown from "./UserDropdown";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/30">
      {user && !isAuthPage && (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center px-4">
            <div className="mr-4 hidden md:flex">
              <h1 className="font-semibold">Student Task Manager</h1>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="w-full flex-1 md:w-auto md:flex-none">
                <h1 className="font-semibold md:hidden">Student Task Manager</h1>
              </div>
              <UserDropdown />
            </div>
          </div>
        </header>
      )}
      <main className="container px-4 py-8 mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
