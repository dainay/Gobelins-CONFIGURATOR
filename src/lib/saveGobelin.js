import { AvatarOptions } from "../../constants/AvatarOptions";
import { useGobelinStore } from "../store/gobelinStore";
import { supabase } from "./supabase";
/**
 * Save the complete gobelin from Zustand store to Supabase 
 */

export async function saveGobelinToDatabase(userId, userName) {
  try {
    // Get complete gobelin data from Zustand
    const gobelinData = useGobelinStore.getState().getGobelinData();
    console.log("Saving gobelin to database:", gobelinData, "for user:", userId);
 
    const { data, error } = await supabase
        .from("gobelins")
        .insert({
          ...gobelinData,
          user_id: userId,
          user_name: userName,
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
export async function loadGobelinFromDatabase(userId) {
  try {
    const { data, error } = await supabase
      .from("gobelins")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const { setName, setGuild, setConfig } = useGobelinStore.getState();
    
    if (data) {
      setName(data.name || "");
      setGuild(data.guild || "");
      setConfig({
        hair: data.hair || AvatarOptions.hair[0].label,
        cloth: data.cloth || AvatarOptions.cloth[0].label,
        animation: data.animation || AvatarOptions.animation[0].label,
        pose: data.pose || AvatarOptions.pose[0].label,
      });
      
      console.log("Gobelin loaded from database:", data);
      return data;
    } else {
      // No gobelin found - set default values
      console.log("No gobelin found for user, setting defaults");
      setConfig({
        hair: AvatarOptions.hair[0].label,
        cloth: AvatarOptions.cloth[0].label,
        animation: AvatarOptions.animation[0].label,
        pose: 'ANIM_talking',
      });
      return null;
    }
  } catch (error) {
    console.error("Error loading gobelin from database:", error);
    throw error;
  }
}