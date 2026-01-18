import { useEffect } from "react";
import { Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import SelectorPanel from "./SelectorPanel";

import { useConfigurateurStore } from "../../src/store/configurateurStore";
import { useMenuStore } from "../../src/store/menuStore";

import { TabsInfo } from "../../constants/TabsInfo";



export default function TabsBar() {
  const activeTab = useConfigurateurStore((state) => state.activeTab);
  const setActiveTab = useConfigurateurStore((state) => state.setActiveTab);

  const activeMenu = useMenuStore((state) => state.activeMenu);

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
                    ? require("../../assets/ui/tabs-bar/onglet-active.png")
                    : require("../../assets/ui/tabs-bar/onglet-inactive.png")
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
    borderWidth: 2,
    borderColor: "purple",
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
