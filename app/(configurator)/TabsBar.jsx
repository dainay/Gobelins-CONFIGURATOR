import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native"; 
import SelectorPanel from "./SelectorPanel";
import { useEffect, useState } from "react";
import { saveGobelinToDatabase } from "../../src/lib/saveGobelin";
import { useUser } from "../../context/UserContext";
import { useMenuStore } from "../../src/store/menuStore";

import { TabsInfo } from "../../constants/TabsInfo";

import ThemedButton from "../../components/ui/ThemedButton";



export default function TabsBar() {
   const [activeTab, setActiveTab] = useState('hair');
  const [saveMessage, setSaveMessage] = useState('');
  const { user } = useUser();

  const activeMenu = useMenuStore((state) => state.activeMenu);
  const setActiveMenu = useMenuStore((state) => state.setActiveMenu);

  useEffect(() => {
    setActiveTab(TabsInfo[activeMenu][0].id);
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
   
      <View style={styles.tabs}>
        {TabsInfo[activeMenu].map((t) => (
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
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
