import { StyleSheet} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useGobelins } from '../../../hooks/useGobelins'
import { useEffect, useState } from 'react'

import ThemedView from '../../../components/ThemedView'
import ThemedButton from '../../../components/ThemedButton'
import ThemedText from '../../../components/ThemedText'
import ThemedLoader from '../../../components/ThemedLoader'


const GobelinPage = ({}) => {

    const { id } = useLocalSearchParams();
    const [gobelinData, setGobelinData] = useState(null);
    const { fetchGobelinById } = useGobelins();

    useEffect(() => {

        async function loadGobelin() {
            const data = await fetchGobelinById(id);
            setGobelinData(data);
        }
    
        //needed for async functions in useEffect
        loadGobelin();
    }, [id]);

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