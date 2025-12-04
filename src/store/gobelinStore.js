import { create } from "zustand";

export const useGobelinStore = create((set, get) => ({
  name: "",
  guild: "",
  configuration: {
    ear_type: null,
    skin_color: null,
    hair_type: null,
    hair_color: null,
    eyes_type: null,
    eyes_color: null,
    outfit_type: null
  },

  //setters
  setName: (name) =>{
    console.log("Name for gobelin is set into Zustand", name)
    set({ name })},

  setGuild: (guild) => {
    console.log("Guild for gobelin is set into Zustand", guild)
    set({ guild })},

  setConfig: (config) => {
    console.log("Configuration for gobelin is set into Zustand", config)
    set((state) => ({ 
      configuration: { ...state.configuration, ...config } 
    }))
  },
  
  // Get complete gobelin object ready for Supabase
  getGobelinData: () => {
    const state = get();
    return {
      name: state.name,
      guild: state.guild,
      ...state.configuration, // spread config fields to top level
    };
  },

  // Reset store after saving
  reset: () => set({
    name: "",
    guild: "",
    configuration: {
      ear_type: null,
      skin_color: null,
      hair_type: null,
      hair_color: null,
      eyes_type: null,
      eyes_color: null,
      outfit_type: null,
      outfit_color: null,
    },
  }),
}));
