
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/30">
      <div className="container px-4 py-8 mx-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
