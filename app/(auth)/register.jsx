import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { Link } from "expo-router";
import { Colors } from "../../constants/Colors";

import ThemedView from "../../components/ui/ThemedView";
import ThemedText from "../../components/ui/ThemedText";
import Spacer from "../../components/ui/Spacer";
import ThemedButton from "../../components/ui/ThemedButton";
import ThemedTextInput from "../../components/ui/ThemedTextInput";

import { useState } from "react";
import { useUser } from "../../hooks/useUser";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [name, setName] = useState("");

  const { register } = useUser();

  const handleSubmit = async () => {
    if (!email || !password || !name) {
    setError('All fields are required'); 
    return;
  }
    // console.log("register form submitted");
    setError(null);
    try {
      await register(email, password, name);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <Spacer />
        <ThemedText title={true} style={styles.title}>
          Register an Account
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

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 20 }}
          placeholder="Name"
          onChangeText={setName}
          value={name}
        />

        <ThemedButton onPress={handleSubmit}>
          <Text style={{ color: "#f2f2f2" }}>Register</Text>
        </ThemedButton>

           
      {error && (
        <ThemedText style={{ color: Colors.error, marginTop: 10 }}>
          {error}
        </ThemedText>
      )}

        <Spacer height={100} />
        <Link href="/login" replace>
          <ThemedText style={{ textAlign: "center" }}>Login instead</ThemedText>
        </Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

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
