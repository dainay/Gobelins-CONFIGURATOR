import { StyleSheet} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useGobelins } from '../../../hooks/useGobelins'
import { useEffect, useState } from 'react'


import ThemedView from '../../../components/ui/ThemedView'
import ThemedButton from '../../../components/ui/ThemedButton'
import ThemedText from '../../../components/ui/ThemedText'
import ThemedLoader from '../../../components/ui/ThemedLoader'


const GobelinPage = ({}) => {

    const { id } = useLocalSearchParams();
    const [gobelinData, setGobelinData] = useState(null);
    const { fetchGobelinById, deleteGobelin } = useGobelins();
    const router = useRouter();

    useEffect(() => {

        async function loadGobelin() {
            const data = await fetchGobelinById(id);
            setGobelinData(data);
        }
    
        //needed for async functions in useEffect
        loadGobelin();
    }, [id]);


    const handleDelete = async () => {
        await deleteGobelin(id);
        setGobelinData(null);
        router.replace('/books')
    }

    if (!gobelinData) {
        return (
            <ThemedView safe={true} style={styles.container}>
                <ThemedLoader/>
            </ThemedView>
        )
    }

  return (
    <ThemedView safe={true} style={styles.container}>
      <ThemedText>{gobelinData?.name}</ThemedText>
      <ThemedText>{gobelinData?.surname}</ThemedText>
      <ThemedText>{gobelinData?.formation}</ThemedText>
      <ThemedText>{gobelinData?.email}</ThemedText>
      <ThemedText>{gobelinData?.Guild}</ThemedText>

      <ThemedButton onPress={handleDelete}>
        <ThemedText>
            Delete Gobelin
        </ThemedText>
      </ThemedButton>

    </ThemedView>
  )
}

export default GobelinPage

const styles = StyleSheet.create({
  container: {  
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    },
})