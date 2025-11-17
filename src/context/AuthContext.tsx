import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  checkIsAdmin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkIsAdmin = async (providedSession?: Session | null): Promise<boolean> => {
    const sessionToUse = providedSession ?? session;
    
    if (!sessionToUse) {
      setIsAdmin(false);
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-admin-role', {
        headers: {
          Authorization: `Bearer ${sessionToUse.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        return false;
      }

      const adminStatus = data?.isAdmin === true;
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check admin status asynchronously with the current session
        if (currentSession?.user) {
          setTimeout(() => {
            checkIsAdmin(currentSession);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        setTimeout(() => {
          checkIsAdmin(currentSession).finally(() => setIsLoading(false));
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Obtener la sesión actual directamente de Supabase
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        return { error: new Error('No se pudo establecer la sesión') };
      }

      // Pasar la sesión actual a checkIsAdmin
      const adminStatus = await checkIsAdmin(currentSession);
      
      if (!adminStatus) {
        await supabase.auth.signOut();
        return { error: new Error('No tienes permisos de administrador') };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isLoading, signIn, signOut, checkIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
