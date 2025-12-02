import { StyleSheet, Text } from 'react-native'
import { Link, router } from 'expo-router' 
import { useState } from 'react'
import { Colors } from '../constants/Colors'
import { useUser } from "../hooks/useUser"

import ThemedView from "../components/ThemedView"
import ThemedText from "../components/ThemedText"
import ThemedLogo from "../components/ThemedLogo"
import Spacer from "../components/Spacer"
import ThemedButton from "../components/ThemedButton"
import ThemedTextInput from "../components/ThemedTextInput"
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
      router.push("/profile")  
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <GuestOnly>
      <ThemedView style={styles.container}>
        <ThemedLogo />
        <Spacer />

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
        <Text style={{ color: "#f2f2f2" }}>Login</Text>
      </ThemedButton>

      <Spacer />
      
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

      <Link href="/Scene">
        <ThemedText style={styles.link}>
          DEMO 3D
        </ThemedText>
      </Link>
    </ThemedView>
    </GuestOnly>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 30,
  },
  link: {
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
})