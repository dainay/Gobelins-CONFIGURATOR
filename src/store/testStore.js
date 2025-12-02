import { create } from "zustand";

export const useTestStore = create((set) => ({
  shakeGuild: null, 

  setShakeGuild: (guildScores) => {
    console.log("Shake guild setinto zustand:", guildScores);
    set({ shakeGuild: guildScores });
  },

   
  reset: () =>
    set({
      shakeGuild: null,
      memoryGuild: null,
    }),
}));
