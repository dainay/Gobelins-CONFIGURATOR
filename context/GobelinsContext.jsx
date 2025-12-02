import { createContext, useEffect, useState } from "react";
import { supabase } from "../src/lib/supabase";
import { useUser } from "../hooks/useUser";

export const GobelinsContext = createContext();

export function GobelinsProvider({ children }) {
  const [gobelin, setGobelin] = useState(null); // один гоблин, не массив
  const { user } = useUser();

  // FETCH USER'S GOBELIN
  async function fetchGobelin() {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("gobelins")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // игнорируем "not found"

      setGobelin(data);
      return data;
    } catch (err) {
      console.error("Error fetching gobelin:", err.message);
    }
  }

  // CREATE (только если ещё нет гоблина)
  async function createGobelin(data) {
    try {
      // проверяем, есть ли уже гоблин
      const existing = await fetchGobelin();
      if (existing) {
        throw new Error("You already have a gobelin!");
      }

      const { data: created, error } = await supabase
        .from("gobelins")
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setGobelin(created);
      return created;
    } catch (err) {
      console.error("Error creating gobelin:", err.message);
      throw err;
    }
  }

  // UPDATE (изменить существующего гоблина)
  async function updateGobelin(data) {
    if (!gobelin) throw new Error("No gobelin to update");

    try {
      const { data: updated, error } = await supabase
        .from("gobelins")
        .update(data)
        .eq("id", gobelin.id)
        .select()
        .single();

      if (error) throw error;

      setGobelin(updated);
      return updated;
    } catch (err) {
      console.error("Error updating gobelin:", err.message);
      throw err;
    }
  }

  // REALTIME LISTENER
  useEffect(() => {
    if (!user) {
      setGobelin(null);
      return;
    }

    fetchGobelin();

    const channel = supabase
      .channel("gobelin-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "gobelins",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            setGobelin(payload.new);
          }

          if (payload.eventType === "DELETE") {
            setGobelin(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <GobelinsContext.Provider
      value={{
        gobelin,
        fetchGobelin,
        createGobelin,
        updateGobelin,
        hasGobelin: !!gobelin,
      }}
    >
      {children}
    </GobelinsContext.Provider>
  );
}
