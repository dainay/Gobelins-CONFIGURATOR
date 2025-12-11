import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { Picker } from "@react-native-picker/picker";

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
  const [year, setYear] = useState("1");

  const { register } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password || !name) {
    setError('All fields are required'); 
    return;
  }
    // console.log("register form submitted");
    setError(null);
    try {
      await register(email, password, name, year);
     
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

        <View style={styles.pickerContainer}>
          <ThemedText style={styles.pickerLabel}>Quelle année êtes-vous?</ThemedText>
          <Picker
            selectedValue={year}
            onValueChange={setYear}
            style={styles.picker}
          >
            <Picker.Item label="1ère année" value="1" />
            <Picker.Item label="2ème année" value="2" />
            <Picker.Item label="3ème année" value="3" />
            <Picker.Item label="4ème année" value="4" />
            <Picker.Item label="5ème année" value="5" />
          </Picker>
        </View>

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
  pickerContainer: {
    width: "80%",
    marginBottom: 20,
  },
  pickerLabel: {
    marginBottom: 8,
    fontSize: 14,
  },
  picker: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
});
