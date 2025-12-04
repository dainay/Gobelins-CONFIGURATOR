import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useConfiguratorStore } from "../../src/store/configuratorStore";

const TABS = [
  { id: "hair", icon: require("../../assets/icons/hair.png") },
  { id: "clothes", icon: require("../../assets/icons/cloth.png") },
  { id: "face", icon: require("../../assets/icons/face.png") },
  { id: "animation", icon: require("../../assets/icons/animation.png") },
  { id: "pose", icon: require("../../assets/icons/pose.png") },
];

export default function TabsBar() {
  const { activeTab, setActiveTab } = useConfiguratorStore();

  return (
    <View style={styles.tabs}>
      {TABS.map((t) => (
        <TouchableOpacity key={t.id} onPress={() => setActiveTab(t.id)}>
          <Image source={t.icon} style={activeTab === t.id ? styles.active : styles.normal} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
