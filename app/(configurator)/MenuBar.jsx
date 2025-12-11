import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import SelectorPanel from "./SelectorPanel";
import { useState } from "react";
import { saveGobelinToDatabase } from "../../src/lib/saveGobelin";
import { useMenuStore } from "../../src/store/menuStore";

import { TabsInfo } from "../../constants/TabsInfo";

import ThemedButton from "../../components/ui/ThemedButton";



export default function MenuBar() {
  const activeMenu = useMenuStore((state) => state.activeMenu);
  const setActiveMenu = useMenuStore((state) => state.setActiveMenu);

  const menuNames = Object.keys(TabsInfo); // ['appearance', 'pose', 'guild']

  return (
    <View style={styles.container}>
      <View style={styles.menuButtons}>
        {menuNames.map((menuName) => (
          <TouchableOpacity
            key={menuName}
            onPress={() => setActiveMenu(menuName)}
            style={
              activeMenu === menuName
                ? styles.activeButton
                : styles.normalButton
            }
          >
            <Text
              style={
                activeMenu === menuName ? styles.activeText : styles.normalText
              }
            >
              {menuName.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: "#fff",
    zIndex: 1000,
    elevation: 1000,
  },
  menuButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
  },
  activeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  normalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
  normalText: {
    color: "#666",
    fontWeight: "500",
  },
});
