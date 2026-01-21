import { Asset } from "expo-asset";
import { useEffect, useRef } from "react";
import { Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import SelectorPanel from "./SelectorPanel";

import { useConfigurateurStore } from "../../src/store/configurateurStore";
import { useMenuStore } from "../../src/store/menuStore";

import { TabsInfo } from "../../constants/TabsInfo";

const TAB_ACTIVE_BG = require("../../assets/ui/tabs-bar/tab-active.webp");
const TAB_INACTIVE_BG = require("../../assets/ui/tabs-bar/tab-inactive.webp");


export default function TabsBar() {
  const activeTab = useConfigurateurStore((state) => state.activeTab);
  const setActiveTab = useConfigurateurStore((state) => state.setActiveTab);

  const activeMenu = useMenuStore((state) => state.activeMenu);
  const prefetchedRef = useRef(false);

  // Précharge les assets de la TabsBar (1 seule fois)
  useEffect(() => {
    if (prefetchedRef.current) return;
    prefetchedRef.current = true;

    const tabIcons = Object.values(TabsInfo)
      .flatMap((arr) => (Array.isArray(arr) ? arr : []))
      .map((t) => t?.icon)
      .filter(Boolean);

    [TAB_ACTIVE_BG, TAB_INACTIVE_BG, ...tabIcons].forEach((mod) => {
      // Fire-and-forget: évite les "pop" au 1er affichage
      Asset.fromModule(mod).downloadAsync();
    });
  }, []);

  useEffect(() => {
    if (activeMenu === "appearance" || activeMenu === "pose") {
      setActiveTab(TabsInfo[activeMenu][0].id);
    }
  }, [activeMenu]);

  return (
    <View style={styles.globalContainer}>
      <View style={styles.container}>
        <View style={styles.tabs}>
          {TabsInfo[activeMenu].map((t) => {
            const isActive = activeTab === t.id;
            return (
              <TouchableOpacity 
                style={isActive ? styles.activeContainer : styles.normalContainer} 
                key={t.id} 
                onPress={() => setActiveTab(t.id)}
                activeOpacity={1}
              >
                <ImageBackground
                  source={isActive 
                    ? TAB_ACTIVE_BG
                    : TAB_INACTIVE_BG
                  }
                  style={styles.tabBackground}
                  resizeMode="contain"
                >
                  <Image source={t.icon} style={isActive ? styles.active : styles.normal} />
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>
        <SelectorPanel activeTab={activeTab} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  container: {
    width: "100%",
    backgroundColor: "transparent",

    // borderWidth: 2,
    // borderColor: "blue",
    // borderTopWidth: 1,
  },
  saveContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    gap: 12,
    backgroundColor: "transparent",
  },
  saveMessage: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  tabs: {
    height: 100,
    width: "100%",
    flexDirection: "row",
    // justifyContent: "space-around",
    gap: 8,
    paddingInline: 8,
    backgroundColor: "transparent",
    marginBottom: -16,
    
  },
  containerIconOnglet: {
    flex: 1,
  },
  activeContainer: {
    flex: 1,
    zIndex: 10,
  },
  normalContainer: {
    flex: 1,
    zIndex: 1,
  },
  tabBackground: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    width: 40,
    height: 40,
    tintColor: "#007AFF",
  },
  normal: {
    width: 40,
    height: 40,
    tintColor: "#999",
  },
});
