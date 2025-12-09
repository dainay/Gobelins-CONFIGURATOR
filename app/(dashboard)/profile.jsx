import { StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'

import Spacer from "../../components/ui/Spacer"
import ThemedText from "../../components/ui/ThemedText"
import ThemedView from "../../components/ui/ThemedView"
import ThemedButton from '../../components/ui/ThemedButton';

import { useUser } from '../../hooks/useUser';
import { useEffect } from 'react';
import { useGobelinStore } from '../../src/store/gobelinStore'

const Profile = () => {
  const router = useRouter()
  const { logout, user } = useUser();

  const name = useGobelinStore((state) => state.name);
  const guild = useGobelinStore((state) => state.guild);

  useEffect(() => {
    console.log("User in profile:", user);
  }, [])

  return (
    <ThemedView style={styles.wrapper}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ThemedText style={styles.backText}>✕</ThemedText>
      </Pressable>

      <ThemedView style={styles.container}>
        <ThemedText title={true} style={styles.heading}>
          {user.email} 
        </ThemedText>
        <Spacer />

        <ThemedText>Your gobelin: {name || 'No name yet'}</ThemedText>
        {guild && <ThemedText>Guild: {guild}</ThemedText>}
        <Spacer />

        <ThemedButton onPress={logout}>
          <ThemedText>Logout</ThemedText>
        </ThemedButton>
      </ThemedView>
    </ThemedView>
  )
}

export default Profile

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  backText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#fff',
    lineHeight: 28,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
})