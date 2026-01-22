import { create } from "zustand";

export const useConfigurateurStore = create((set) => ({
  activeTab: "hair", // Current active tab
  cameraZoom: 4, //valeur par default Z de la camera 
  cameraX: 0, //valeur par default X de la camera 
  cameraY: 1.5, //valeur par default Y de la camera 
  cameraLookAtY: 1, //valeur par default Y de la camera look at
  showTutorial: false,
  tutorialStep: 0,
  tutorialCompleted: false,



  setActiveTab: (tab) => {
    console.log("Active tab changed to:", tab);
    set({ activeTab: tab });

    let zoom = 3.8; //valeur par default Z de la camera 
    let x = 0; //valeur par default X de la camera 
    let y = 1; //valeur par default Y de la camera 
    let lookAtY = 1; //valeur par default Y de la camera look at

    if (tab === "hair") {
      zoom = 2.4;
      x = 0;
      y = 1.5;
      lookAtY = 1.7;
    } else if (tab === "cloth") {
      zoom = 3.8;
      x = 0;
      y = 1.4;
      lookAtY = 1.0;
    }
    // else if (tab === "face") {
    //   zoom = 1.6;
    //   x = 0;
    //   y = 1.9;
    //   lookAtY = 1.9;
    // }
    set({ 
      activeTab: tab ,
      cameraZoom: zoom,
      cameraX: x,
      cameraY: y,
      cameraLookAtY: lookAtY,
    });
  },


  startTutorial: () => {
    set({
      showTutorial: true,
      tutorialStep: 0,
    });
  },

  nextTutorialStep: () => {



    
    set((state) => ({
      tutorialStep: state.tutorialStep + 1,
    }));
  },

  finishTutorial: () => {
    set({
      showTutorial: false,
      tutorialCompleted: true,
    });
  },


  reset: () => set({
    activeTab: "hair",
    cameraZoom: 4,
    cameraX: 0,
    cameraY: 1.5,
    cameraLookAtY: 1,
    showTutorial: false,
    tutorialStep: 0,
    tutorialCompleted: false,
  }),
}));