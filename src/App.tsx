
import { useEffect } from 'react';
import { notificationService } from './services/notifications';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize push notifications
    notificationService.initialize().catch(console.error);
    
    // Set up an interval to check for due tasks every hour
    const checkTasksInterval = setInterval(() => {
      if (localStorage.getItem('supabase.auth.token')) {
        notificationService.checkForDueTasks().catch(console.error);
      }
    }, 60 * 60 * 1000); // Check every hour
    
    // Check once at startup if user is logged in
    if (localStorage.getItem('supabase.auth.token')) {
      notificationService.checkForDueTasks().catch(console.error);
    }
    
    return () => {
      clearInterval(checkTasksInterval);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner position="top-right" closeButton />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
