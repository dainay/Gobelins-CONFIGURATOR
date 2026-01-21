import { create } from "zustand";
import { playBgm, stopBgm, setBgmVolume } from "../lib/sounds";

export const useMusicStore = create((set, get) => ({
  enabled: true,         
  currentTrack: null,     
  volume: 0.25,

  applyTrack: async (trackKey) => {
    set({ currentTrack: trackKey });

    if (!get().enabled) return;

    if (!trackKey) {
      await stopBgm();
      return;
    }

    await playBgm(trackKey, { volume: get().volume, loop: true });
  },

  toggleMusic: async () => {
    const next = !get().enabled;
    set({ enabled: next });

    if (!next) {
      await stopBgm();
      return;
    }

    const t = get().currentTrack;
    if (t) await playBgm(t, { volume: get().volume, loop: true });
  },

  setVolume: async (volume) => {
    set({ volume });
    await setBgmVolume(volume);
  },
}));
