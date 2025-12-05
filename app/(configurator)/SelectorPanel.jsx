import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { AvatarOptions } from "../../constants/AvatarOptions";
import { useGobelinStore } from "../../src/store/gobelinStore";
import { useConfigurateurStore } from "../../src/store/configurateurStore";

export default function OptionsPanel() {
  const setConfig = useGobelinStore((state) => state.setConfig);
  const activeTab = useConfigurateurStore((state) => state.activeTab);
  const items = AvatarOptions[activeTab] || [];

  console.log("Active Tab:", activeTab);

  const handlePress = (item) => {
    setConfig({ [activeTab]: item.label });
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      {items.map((item) => (
        <TouchableOpacity 
          key={item.id} 
          style={styles.item}
          onPress={() => handlePress(item)}
        >
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    backgroundColor: "white",
  },
  contentContainer: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  thumb: {
    width: 60,
    height: 60,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
});
