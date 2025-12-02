import { createContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { supabase } from "../src/lib/supabase";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // AUTO REFRESH TOKEN (Official Supabase RN recommended setup)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => subscription.remove();
  }, []);

  // LOGIN
  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  // REGISTER
  async function register(email, password, name) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name
        }
      }
    });

    if (error) throw new Error(error.message);

    // After registration user must confirm email,
    // but for now we auto-login for simplicity:
    await login(email, password);
  }

  // LOGOUT
  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  // INITIAL SESSION CHECK
  async function loadInitialUser() {
    const { data } = await supabase.auth.getSession();

    if (data.session?.user) {
      setUser(data.session.user);
    } else {
      setUser(null);
    }

    setAuthChecked(true);
  }

  // LISTEN TO AUTH CHANGES (Official behaviour)
  useEffect(() => {
    loadInitialUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        authChecked,
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
