import { create } from "zustand";

export const useMenuStore = create((set) => ({
  
  activeMenu: 'appearance',
  
  setActiveMenu: (menu) => {
    console.log("Active menu changed to:", menu);
    set({ activeMenu: menu });
  },
  reset: () => set({
    activeMenu: 'appearance',
  }),
}));
