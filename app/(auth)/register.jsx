import { Link, useRouter } from "expo-router";
import {
  Image,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Colors } from "../../constants/Colors";

import GreenButton from "../../components/ui/GreenButton";
import ThemedText from "../../components/ui/ThemedText";
import ThemedTextInput from "../../components/ui/ThemedTextInput";
import ThemedView from "../../components/ui/ThemedView";

import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { mapSupabaseAuthError } from "../../src/lib/mapSupabaseAuthError";

import backgroundImage from "../../assets/img/bacgkound-school.webp";
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
      console.log("Login error ##################:", error.code);
      setError(mapSupabaseAuthError(error));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container} safe={true} keyboard={true}>
        <View style={styles.bgImageWrapper} pointerEvents="none">
          <Image
            source={backgroundImage}
            style={[styles.bgImage]}
            resizeMode="cover"
          />
        </View>
        <View style={styles.globalContent}>
          {/* Titre + soulignement */}
          <View style={styles.titleBlock}>
            <ThemedText title={true} style={styles.title} font="merriweather">
              Créer un compte
            </ThemedText>
            <Image
              source={require("../../assets/ui/tutorial/motif.webp")}
              style={styles.underlineMotif}
              resizeMode="contain"
            />
          </View>

          {/* Inputs */}
          <View style={styles.inputsBlock}>
            <ThemedTextInput
              placeholder="Adresse e-mail"
              placeholderTextColor={Colors.brownText}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
              background={"bar1"}
              style={{
                color: Colors.brownText,
                fontFamily: "Merriweather",
                fontSize: 16,
                letterSpacing: 0.2,
              }}
              containerStyle={{ marginBottom: 16 }}
            />

            <ThemedTextInput
              placeholder="Mot de passe"
              placeholderTextColor={Colors.brownText}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={setPassword}
              value={password}
              background={"bar2"}
              style={{
                color: Colors.brownText,
                fontFamily: "Merriweather",
                fontSize: 16,
                letterSpacing: 0.2,
              }}
              containerStyle={{ marginBottom: 16 }}
            />

            <ThemedTextInput
              placeholder="Comment t'appelles-tu ?"
              placeholderTextColor="rgba(0,0,0,0.6)"
              autoCapitalize="words"
              onChangeText={setName}
              value={name}
              background={"bar2"}
              style={{
                color: Colors.brownText,
                fontFamily: "Merriweather",
                fontSize: 16,
                letterSpacing: 0.2,
              }}
            />
          </View>

          {/* Picker */}
          <View style={styles.pickerBlock}>
            <ThemedPicker
              label="Quelle année es-tu ?"
              items={yearItems}
              value={year}
              onChange={setYear}
              background="bar2"
            />
          </View>

          {/* Actions */}
          <View style={styles.actionsBlock}>
            <GreenButton title="S'inscrire" onPress={handleSubmit} />

            {error && (
              <ThemedText font="merriweather" style={styles.errorText}>
                {error}
              </ThemedText>
            )}

            <Link href="/login" replace>
              <ThemedText font="merriweather" style={styles.link}>
                Se connecter
              </ThemedText>
            </Link>
          </View>
        </View>
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
    position: 'relative',
    // IMPORTANT: ne pas couper le dropdown du Picker (Android)
    overflow: 'visible',
  },
  globalContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  titleBlock: {
    width: "100%",
    alignItems: "center",
  },
  inputsBlock: {
    width: "100%",
    alignItems: "center",
  },
  pickerBlock: {
    width: "100%",
    alignItems: "center",
    // Mettre le picker au-dessus du bouton quand le dropdown s'ouvre
    zIndex: 50,
    elevation: 50,
  },
  actionsBlock: {
    width: "100%",
    alignItems: "center",
    zIndex: 1,
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
    fontSize: 20,
    fontFamily: 'Merriweather',
    fontWeight: 'bold',
    width: "70%",
  },
  underlineMotif: {
    height: 60,
    maxWidth: "95%",
    alignSelf: "center",
    marginTop: -20,
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
    textDecorationLine: 'underline',
    fontFamily: 'Merriweather', 
  },
  errorText: {
    color: Colors.error,
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Merriweather",
  },
});
