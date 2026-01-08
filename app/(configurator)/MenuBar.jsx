import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useConfigurateurStore } from "../../src/store/configurateurStore";
import { useMenuStore } from "../../src/store/menuStore";

import { TabsInfo } from "../../constants/TabsInfo";




export default function MenuBar() {
  const activeMenu = useMenuStore((state) => state.activeMenu);
  const setActiveMenu = useMenuStore((state) => state.setActiveMenu);
  const setActiveTab = useConfigurateurStore((state) => state.setActiveTab);

  const menuNames = Object.keys(TabsInfo); // ['appearance', 'pose', 'guild']

  const handleMenuChange = (menuName) => {
    setActiveMenu(menuName);

    const tabsForMenu = TabsInfo[menuName];

    if (tabsForMenu && tabsForMenu.length > 0) {
      const firstTabId = tabsForMenu[0].id;
      setActiveTab(firstTabId);
    } else {
      setActiveTab("default");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.menuButtons}>
        {menuNames.map((menuName) => (
          <TouchableOpacity
            key={menuName}
            onPress={() => handleMenuChange(menuName)}
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
