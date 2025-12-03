import { createContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { supabase } from "../src/lib/supabase";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // AUTO REFRESH TOKEN (RN official)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });

    return () => subscription.remove();
  }, []);

  // LOGIN
  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    // user will be handled by onAuthStateChange
  }

  // REGISTER
  async function register(email, password, name) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });

    if (error) throw new Error(error.message);

    await login(email, password);
  }

  // LOGOUT
  async function logout() {
    await supabase.auth.signOut();
    // user will be set to null by listener
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
