import { create } from "zustand";

export const useConfigurateurStore = create((set) => ({
  activeTab: "hair", // Current active tab
  cameraZoom: 4, //valeur par default Z de la camera 
  cameraX: 0, //valeur par default X de la camera 
  cameraY: 2, //valeur par default Y de la camera 

  setActiveTab: (tab) => {
    console.log("Active tab changed to:", tab);
    set({ activeTab: tab });

    let zoom = 4; //valeur par default Z de la camera 
    let x = 0; //valeur par default X de la camera 
    let y = 2; //valeur par default Y de la camera 

    if (tab === "hair") {
      zoom = 2.2;
      x = 0;
      y = 2.8;
    } else if (tab === "cloth") {
      zoom = 4;
      x = 0;
      y = 2;
    } else if (tab === "face") {
      zoom = 1.5;
      x = 0;
      y = 2.6;
    }

    set({ 
      activeTab: tab ,
      cameraZoom: zoom,
      cameraX: x,
      cameraY: y
    });
  },


}));