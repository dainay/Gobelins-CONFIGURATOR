import { create } from "zustand";

export const useConfiguratorStore = create((set) => ({
  activeTab: "hair", // Current active tab
  
  setActiveTab: (tab) => {
    console.log("Active tab changed to:", tab);
    set({ activeTab: tab });
  },
}));
