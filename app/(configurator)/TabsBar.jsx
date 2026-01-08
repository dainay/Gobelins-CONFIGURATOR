import { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import SelectorPanel from "./SelectorPanel";

import { useConfigurateurStore } from "../../src/store/configurateurStore";
import { useMenuStore } from "../../src/store/menuStore";

import { TabsInfo } from "../../constants/TabsInfo";



export default function TabsBar() {
  const activeTab = useConfigurateurStore((state) => state.activeTab);
  const setActiveTab = useConfigurateurStore((state) => state.setActiveTab);

  const activeMenu = useMenuStore((state) => state.activeMenu);

  useEffect(() => {
    if (activeMenu === "appearance") {
      setActiveTab(TabsInfo[activeMenu][0].id);
    }
  }, [activeMenu]);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TabsInfo[activeMenu].map((t) => (
          <TouchableOpacity 
            style={activeTab === t.id ? styles.activeContainer : styles.normalContainer} 
            key={t.id} 
            onPress={() => setActiveTab(t.id)}
            activeOpacity={1}
          >
            <Image source={t.icon} style={activeTab === t.id ? styles.active : styles.normal} />
          </TouchableOpacity>
        ))}
      </View>
      <SelectorPanel activeTab={activeTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
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
    height: 80,
    width: "100%",
    flexDirection: "row",
    // justifyContent: "space-around",
    gap: 8,
    paddingInline: 16,
    backgroundColor: "transparent",
    border: "1px solid red",
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
  active: {
    // width: 40,
    height: "100%",
    tintColor: "#007AFF",
    backgroundColor: "green",
    width: "100%",
  },
  normal: {
    // width: 40,
    height: "100%",
    tintColor: "#999",
    backgroundColor: "yellow",
    flex: 1,
    width: "100%",
  },
});
