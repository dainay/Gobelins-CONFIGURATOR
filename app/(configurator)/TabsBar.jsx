import { View, TouchableOpacity, Image, StyleSheet } from "react-native"; 
import SelectorPanel from "./SelectorPanel";
import { useState } from "react";


const TABS = [
  { id: "hair", icon: require("../../assets/icons/hair.png") },
  { id: "cloth", icon: require("../../assets/icons/cloth.png") },
  { id: "face", icon: require("../../assets/icons/face.png") },
  { id: "animation", icon: require("../../assets/icons/animation.png") },
  { id: "pose", icon: require("../../assets/icons/pose.png") },
];

export default function TabsBar() {
  const [activeTab, setActiveTab] = useState('hair');

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TABS.map((t) => (
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
