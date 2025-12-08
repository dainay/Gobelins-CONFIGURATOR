import { Image, StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import SelectorPanel from "./SelectorPanel";
import { useEffect, useState, useRef } from "react";

import { saveGobelinToDatabase } from "../../src/lib/saveGobelin";
import { useUser } from "../../context/UserContext";
import { useMenuStore } from "../../src/store/menuStore";
import { useConfigurateurStore } from "../../src/store/configurateurStore";

import { TabsInfo } from "../../constants/TabsInfo";
import { GuildsInfo } from "../../constants/GuildsInfo";
import GuildChoice from "./GuildChoice";

import ThemedButton from "../../components/ui/ThemedButton";



export default function TabsBar() {
  //  const [activeTab, setActiveTab] = useState('hair');
  const activeTab = useConfigurateurStore((state) => state.activeTab);
  const setActiveTab = useConfigurateurStore((state) => state.setActiveTab);
  const [saveMessage, setSaveMessage] = useState('');
  const { user } = useUser();

  const activeMenu = useMenuStore((state) => state.activeMenu);
  const setActiveMenu = useMenuStore((state) => state.setActiveMenu);
  
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeMenu === "appearance" || activeMenu === "animation") {
      setActiveTab(TabsInfo[activeMenu][0].id);
    }
  }, [activeMenu]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: (activeMenu === "appearance" || activeMenu === "animation") ? 0 : 200,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeMenu]);

  // const handleSave = async () => {
  //   if (user?.id) {
  //     try {
  //       setSaveMessage('Saving...');
  //       await saveGobelinToDatabase(user.id);
  //       setSaveMessage('✓ Saved successfully!');
  //       setTimeout(() => setSaveMessage(''), 3000);
  //     } catch (error) {
  //       setSaveMessage('✗ Failed to save');
  //       setTimeout(() => setSaveMessage(''), 3000);
  //       console.error("Failed to save gobelin:", error);
  //     }
  //   }
  // };

  return (
    <View style={styles.container}>
      
      {(activeMenu === "guild") ? (
        <View>
          <GuildChoice />
        </View>
      ) : null}
      
      <Animated.View style={[
        styles.tabsContainer,
        { transform: [{ translateY: slideAnim }] }
      ]}>
        <View style={styles.tabs}>
          {TabsInfo[activeMenu]?.map((t) => (
            <TouchableOpacity key={t.id} onPress={() => setActiveTab(t.id)}>
              <Image source={t.icon} style={activeTab === t.id ? styles.active : styles.normal} />
            </TouchableOpacity>
          ))}
        </View>
        <SelectorPanel activeTab={activeTab} />
      </Animated.View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: "#783131ff",
    height: 270,
  },
  tabsContainer: {
    width: "100%",
    backgroundColor: "#231f2dff",
  },
  saveContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    gap: 12,
  },
  saveMessage: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
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
    testText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }],
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    zIndex: 1000,
  },
});
