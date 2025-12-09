import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import SelectorPanel from "./SelectorPanel";
import { useEffect } from "react";

import { useMenuStore } from "../../src/store/menuStore";
import { useConfigurateurStore } from "../../src/store/configurateurStore";

import { TabsInfo } from "../../constants/TabsInfo";



export default function TabsBar() {
  const activeTab = useConfigurateurStore((state) => state.activeTab);
  const setActiveTab = useConfigurateurStore((state) => state.setActiveTab);

  const activeMenu = useMenuStore((state) => state.activeMenu);

  useEffect(() => {
    if (activeMenu === "appearance" || activeMenu === "animation") {
      setActiveTab(TabsInfo[activeMenu][0].id);
    }
  }, [activeMenu]);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TabsInfo[activeMenu]?.map((t) => (
          <TouchableOpacity key={t.id} onPress={() => setActiveTab(t.id)}>
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
    backgroundColor: "#231f2dff",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#3b9d86ff",
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
