import { useState, useEffect } from "react";
import { supabase } from './utils/supabase/client';
import { AuthSystem } from "./components/AuthSystem";
import { Dashboard } from "./components/Dashboard";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Resources } from "./components/Resources";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'counselor' | 'admin';
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || "User",
            email: session.user.email || "",
            role: session.user.user_metadata?.role || "student"
          };
          setUser(userData);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || "User",
            email: session.user.email || "",
            role: session.user.user_metadata?.role || "student"
          };
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if user is logged in
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Show auth system if not logged in
  return <AuthSystem onLogin={handleLogin} />;
}