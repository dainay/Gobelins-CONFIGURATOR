import { StyleSheet } from 'react-native'

import Spacer from "../../components/ui/Spacer"
import ThemedText from "../../components/ui/ThemedText"
import ThemedView from "../../components/ui/ThemedView"
import ThemedButton from '../../components/ui/ThemedButton';

import { useUser } from '../../hooks/useUser';
import { useEffect } from 'react';

const Profile = () => {

  const { logout, user } = useUser();

  useEffect(() => {
    console.log("User in profile:", user);
  }, [])

  return (
    <ThemedView style={styles.container}>

      <ThemedText title={true} style={styles.heading}>
        {user.email} 
      </ThemedText>
      <Spacer />

      <ThemedText>Time to start reading some books...</ThemedText>
      <Spacer />

      <ThemedButton onPress={logout}>
        <ThemedText>Logout</ThemedText>
      </ThemedButton>

    </ThemedView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
})