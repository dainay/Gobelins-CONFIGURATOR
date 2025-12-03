import { StyleSheet, FlatList, Pressable } from 'react-native'
import { useGobelins } from '../../hooks/useGobelins'
import { Colors } from '../../constants/Colors'

import Spacer from "../../components/ui/Spacer"
import ThemedText from "../../components/ui/ThemedText"
import ThemedView from "../../components/ui/ThemedView"
import ThemedCard from "../../components/ui/ThemedCard"
import { useRouter } from 'expo-router'

const Create = () => {

const { gobelin } = useGobelins();
const router = useRouter();

  return (
    <ThemedView style={styles.container}>

      <ThemedText title={true} style={styles.heading}>
        Your Gobelin
      </ThemedText>
      <Spacer />

      {gobelin ? (
        <Pressable 
          onPress={() => router.push(`/gobelin/${gobelin.id}`)}
          style={({ pressed }) => [
            styles.cardPressable,
            pressed && styles.cardPressed,
          ]}
        >
          <ThemedCard style={styles.card}>
            <ThemedText type="title">Guild: {gobelin.guild}</ThemedText>
            <ThemedText>Created: {new Date(gobelin.created_at).toLocaleDateString()}</ThemedText>
            {gobelin.shake_metrics && (
              <ThemedText>Shake Test: Completed</ThemedText>
            )}
            {gobelin.sensor_metrics && (
              <ThemedText>Sensor Test: Completed</ThemedText>
            )}
          </ThemedCard>
        </Pressable>
      ) : (
        <ThemedText style={styles.noGobelin}>No gobelin created yet</ThemedText>
      )}

    </ThemedView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    alignSelf: 'center',
    width: '90%',
  },
  noGobelin: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.6,
  },
  cardPressable: {
    borderRadius: 8,
  },  
  cardPressed: {
    backgroundColor: "#3f3f3f",
  },
})