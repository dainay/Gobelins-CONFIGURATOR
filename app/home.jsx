// app/home.jsx
import { Link } from 'expo-router'
import { StyleSheet } from 'react-native'

import Spacer from "../components/ui/Spacer"
import ThemedLogo from "../components/ui/ThemedLogo"
import ThemedText from "../components/ui/ThemedText"
import ThemedView from "../components/ui/ThemedView"

import TabsBar from './(configurator)/TabsBar'

export default function Home() {
  return (
    <ThemedView style={styles.container}>
      <ThemedLogo />
      <Spacer />
 
      {/* <TabsBar /> */}

      {/* <Link href="/login" style={styles.link}>
        <ThemedText>Login</ThemedText>
      </Link>

      <Link href="/register" style={styles.link}>
        <ThemedText>Register</ThemedText>
      </Link>

      <Link href="/profile" style={styles.link}>
        <ThemedText>Profile</ThemedText>
      </Link>

      <Link href="/Scene" style={styles.link}>
        <ThemedText>3D Demo</ThemedText>
      </Link> */}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1
  },
})
