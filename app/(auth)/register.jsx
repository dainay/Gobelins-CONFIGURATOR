import { Link, useRouter } from "expo-router";
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";

import Spacer from "../../components/ui/Spacer";
import ThemedButton from "../../components/ui/ThemedButton";
import ThemedText from "../../components/ui/ThemedText";
import ThemedTextInput from "../../components/ui/ThemedTextInput";
import ThemedView from "../../components/ui/ThemedView";

import { useState } from "react";
import { useUser } from "../../hooks/useUser";

import backgroundImage from "../../assets/img/temp-back.png";
import ThemedPicker from "../../components/ui/ThemedPicker";

const yearItems = [
  { label: "1ère année", value: "1" },
  { label: "2ème année", value: "2" },
  { label: "3ème année", value: "3" },
  { label: "4ème année", value: "4" },
  { label: "5ème année", value: "5" },
];

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
      setError("Tous les champs sont requis");
      return;
    }
    // console.log("register form submitted");
    setError(null);
    try {
      const result = await register(email, password, name, year);
      console.log("Login successful, navigating to:", result);
      // router.replace(result);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <View style={styles.bgImageWrapper} pointerEvents="none">
          <Image
            source={backgroundImage}
            style={[styles.bgImage]}
            resizeMode="cover"
          />
        </View>
        <Spacer />
        <ThemedText title={true} style={styles.title} font="christmasBold">
          Créer un compte
        </ThemedText>

        <ThemedTextInput
          placeholder="Adresse e-mail"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
          background={"bar1"}
        />

        <ThemedTextInput
          placeholder="Mot de passe"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <ThemedTextInput
          placeholder="Nom"
          onChangeText={setName}
          value={name}
        />

        <ThemedPicker
          label="Quelle année êtes-vous ?"
          items={yearItems}
          value={year}
          onChange={setYear}
          background="bar2"
        />

        <ThemedButton onPress={handleSubmit}>
          <Text style={{ color: "#f2f2f2" }}>S'inscrire</Text>
        </ThemedButton>

        {error && (
          <ThemedText style={{ color: Colors.error, marginTop: 10 }}>
            {error}
          </ThemedText>
        )}

        <Spacer height={10} />
        <Link href="/login" replace>
          <ThemedText style={{ textAlign: "center", ...styles.link }}>
            Se connecter
          </ThemedText>
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
    position: "relative",
    overflow: "hidden",
  },
  bgImageWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  bgImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  title: {
    textAlign: "center",
    fontSize: 40,
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
  link: {
    color: "#ffffffff",
    marginTop: 10,
    textAlign: "center",
    textDecorationLine: "underline",
    fontFamily: "Merriweather-Light",
  },
});
