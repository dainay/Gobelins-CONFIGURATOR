import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useConfiguratorStore } from "../../src/store/configuratorStore";

export default function OptionsPanel() {
  const { activeTab } = useConfiguratorStore();

  // Temporary placeholder data
  const items = [];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity key={item.id} style={styles.item}>
          {item.thumbnail && (
            <Image source={item.thumbnail} style={styles.thumb} />
          )}
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  item: {
    width: 80,
    alignItems: "center",
  },
  thumb: {
    width: 60,
    height: 60,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: "#333",
  },
});
