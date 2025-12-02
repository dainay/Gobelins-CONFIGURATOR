import { StyleSheet, Text } from "react-native";
import { router } from "expo-router";
 
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
 
const text = () => {
 

  return (
    <ThemedView style={styles.container}>
      
      <ThemedText title={true} style={styles.title}>
        Are you ready to start your journey, little Gobelin ?
      </ThemedText>

      <ThemedButton 
        onPress={() => router.push("/shake-test")}
      >
        <Text style={{ color: "#ffffffff" }}>Start my journey</Text>
      </ThemedButton>

      <Spacer />
   
    </ThemedView>
  );
};

export default text;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
  },
});
