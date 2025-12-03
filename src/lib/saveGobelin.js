import { supabase } from "./supabase";
import { useGobelinStore } from "../store/gobelinStore";

/**
 * Save the complete gobelin from Zustand store to Supabase 
 */

export async function saveGobelinToDatabase(userId) {
  try {
    // Get complete gobelin data from Zustand
    const gobelinData = useGobelinStore.getState().getGobelinData();
 
    const { data, error } = await supabase
        .from("gobelins")
        .insert({
          ...gobelinData,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    
  } catch (error) {
    console.error("Error saving gobelin to database:", error);
    throw error;
  }

}
/**
 * Load gobelin from database into Zustand store
 */
// export async function loadGobelinFromDatabase(userId) {
//   try {
//     const { data, error } = await supabase
//       .from("gobelins")
//       .select("*")
//       .eq("user_id", userId)
//       .single();

//     if (error && error.code !== 'PGRST116') {
//       throw error;
//     }

//     if (data) {
//       const { setName, setGuild, setConfig } = useGobelinStore.getState();
      
//       setName(data.name || "");
//       setGuild(data.guild || "");
//       setConfig({
//         ear_type: data.ear_type,
//         skin_color: data.skin_color,
//         hair_type: data.hair_type,
//         hair_color: data.hair_color,
//         eyes_type: data.eyes_type,
//         eyes_color: data.eyes_color,
//         outfit_type: data.outfit_type,
//         outfit_color: data.outfit_color,
//       });
      
//       return data;
//     }
    
//     return null;
//   } catch (error) {
//     console.error("Error loading gobelin from database:", error);
//     throw error;
//   } }