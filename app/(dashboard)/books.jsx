import { StyleSheet, FlatList, Pressable } from 'react-native'
import { useGobelins } from '../../hooks/useGobelins'
import { Colors } from '../../constants/Colors'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedCard from "../../components/ThemedCard"
import { useRouter } from 'expo-router'

const Create = () => {

const { gobelins } = useGobelins();
const router = useRouter();

  return (
    <ThemedView style={styles.container}>

      <ThemedText title={true} style={styles.heading}>
        Add a New Book
      </ThemedText>
      <Spacer />

      <FlatList 
        data={gobelins}
        keyExtractor={(item) => item?.$id }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable 
             onPress={() => router.push(`/gobelin/${item.$id}`)}
              style={({ pressed }) => [
                styles.cardPressable,
                pressed && styles.cardPressed,
              ]}
          >
          <ThemedCard style={styles.card}>
            <ThemedText type="title">{item?.name || "Unknown Name"}</ThemedText>
            <ThemedText>{item?.surname || "Unknown Surname"}</ThemedText>
            <ThemedText>{item?.formation || "Unknown Formation"}</ThemedText>
            <ThemedText>{item?.email || "Unknown Email"}</ThemedText>
            <ThemedText>{item?.Guild || "Unknown Guild"}</ThemedText>
          </ThemedCard>
          </Pressable>
        )}
      />

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
  list: {
    paddingVertical: 10,
    // width: '100%',
    borderBlockColor: 'red',
    borderWidth: 5,
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    width: '100%',
  },
  cardPressable: {
    borderRadius: 8,
  },  
  cardPressed: {
    backgroundColor: "#3f3f3f",
  },
})