import { StyleSheet, Text } from 'react-native'
import { Link, router } from 'expo-router' 
import { useState } from 'react'
import { Colors } from '../constants/Colors'
import { useUser } from "../hooks/useUser" 

import ThemedView from "../components/ui/ThemedView"
import ThemedText from "../components/ui/ThemedText"
import ThemedLogo from "../components/ui/ThemedLogo"
import Spacer from "../components/ui/Spacer"
import ThemedButton from "../components/ui/ThemedButton"
import ThemedTextInput from "../components/ui/ThemedTextInput"
import GuestOnly from "../components/auth/GuestOnly"


const Home = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const { login } = useUser()

  const handleSubmit = async () => {
    console.log("login form submitted")
    setError(null)

    try {
      await login(email, password)
      router.replace('/(dashboard)/openWorld');  
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <GuestOnly>
      <ThemedView safe={true} style={styles.container}>
        <ThemedLogo />
        {/* <Spacer /> */}

        <ThemedText title={true} style={styles.title}>
          Connect to your gobelin
        </ThemedText>

      <ThemedTextInput
        style={{ width: "80%", marginBottom: 20 }}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />

      <ThemedTextInput
        style={{ width: "80%", marginBottom: 20 }}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <ThemedButton onPress={handleSubmit}>
        Login
      </ThemedButton>

      {/* <Spacer /> */}
      
      {error && (
        <ThemedText style={{ color: Colors.error, marginTop: 10 }}>
          {error}
        </ThemedText>
      )}

      <Spacer height={20} />
      <Link href="/register">
        <ThemedText style={styles.link}>
          Don't have an account? Register here
        </ThemedText>
      </Link>

       {/* <Link href="/home">
        <ThemedText style={styles.link}>
          TABS
        </ThemedText>
      </Link> */}

      <Link href="/Scene">
        <ThemedText style={styles.link}>
          DEMO 3D
        </ThemedText>
      </Link>

      {/* <Link href="/introManager">
        <ThemedText style={styles.link}>
          INTRO
        </ThemedText>
      </Link> */}

    </ThemedView>
    </GuestOnly>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    color: '#007AFF',
    marginTop: 10,
  },
});

export default Home;
