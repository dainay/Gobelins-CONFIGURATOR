import { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { loadGobelinFromDatabase } from "../src/lib/saveGobelin";
import { supabase } from "../src/lib/supabase";
import { useGobelinStore } from "../src/store/gobelinStore";
import { useMenuStore } from "../src/store/menuStore";
import { useConfigurateurStore } from "../src/store/configurateurStore";
import { useRouter } from "expo-router";

export const UserContext = createContext();

// Hook to use UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const setConfig = useGobelinStore((state) => state.setConfig);
  const router = useRouter();

  // AUTO REFRESH TOKEN (RN official)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });

    return () => subscription.remove();
  }, []);

//to load gobelin on user change and set into zustand (login register logout nosession)  
  useEffect(() => {
    if (user) {
      loadGobelinFromDatabase(user.id).then((gobelinData) => {
        if (gobelinData) {
          console.log("Loaded gobelin from database:", gobelinData);
          setConfig(gobelinData);
        }
      });
    }
  }, [user]);

  // LOGIN
  async function login(email, password, intro = false) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    console.log("AAAAAAAAAAAAAAAAAAAAAAAA  Login attempt for:", intro );

    if (error) throw new Error(error.message);

    console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB  Login attempt for:", intro );
    
    if (intro) {
    router.replace('/(intro)/intro');
    return;
    } 
      
    
  }

  // REGISTER
  async function register(email, password, name, year) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name, year: year } },
    });

    if (error) throw new Error(error.message);

    await login(email, password, true); 
  }

  // LOGOUT
  async function logout() {
    await supabase.auth.signOut();
    // user will be set to null by listener
    useGobelinStore.getState().reset();
    useMenuStore.getState().reset();
    useConfigurateurStore.getState().reset();
  }

  // MAIN AUTH LISTENER + INITIAL LOAD
  useEffect(() => {
    // Listen for changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setAuthChecked(true);
      }
    );

    // Initial session load
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthChecked(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, authChecked, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}
