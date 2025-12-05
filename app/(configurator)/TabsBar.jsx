// import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useConfiguratorStore } from "../../src/store/configuratorStore";
import SelectorPanel from "./SelectorPanel";

const TABS = [
  { id: "hair", icon: require("../../assets/icons/hair.png") },
  { id: "cloth", icon: require("../../assets/icons/cloth.png") },
  { id: "face", icon: require("../../assets/icons/face.png") },
  { id: "animation", icon: require("../../assets/icons/animation.png") },
  { id: "pose", icon: require("../../assets/icons/pose.png") },
];

export default function TabsBar() {
  // const [activeTab, setActiveTab] = useState('hair');
  const activeTab = useConfiguratorStore((state) => state.activeTab);
  const setActiveTab = useConfiguratorStore((state) => state.setActiveTab);

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
      
      {/* Texte de test pour afficher l'onglet actif */}
      {(activeTab === "hair" || activeTab === "cloth" || activeTab === "face") && (
        <Text style={styles.testText}>{activeTab}</Text>
      )}
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
