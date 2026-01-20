import { Link } from "expo-router";
import { Image, StyleSheet, Text, View, useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";

import Spacer from "../../components/ui/Spacer";
import ThemedButton from "../../components/ui/ThemedButton";
import ThemedText from "../../components/ui/ThemedText";
import ThemedTextInput from "../../components/ui/ThemedTextInput";
import ThemedView from "../../components/ui/ThemedView";

import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { mapSupabaseAuthError } from "../../src/lib/mapSupabaseAuthError";

import backgroundImage from "../../assets/img/temp-back.png";

import FirefliesSimple from "../../components/ui/FirefliesSimple";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { login } = useUser();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const handleSubmit = async () => {
    console.log("login form submitted");
    setError(null);

    try {
      const result = await login(email, password);
      console.log("Login successful, navigating to:", result);
      // router.replace(result);
    } catch (error) {
      setError(mapSupabaseAuthError(error));
    }
  };

  return (
    <ThemedView style={styles.container} safe={true} keyboard={true}>
      <View style={styles.bgImageWrapper} pointerEvents="none">
        <Image
          source={backgroundImage}
          style={[styles.bgImage]}
          resizeMode="cover"
        />
      </View>
      <Spacer />
      <ThemedText title={true} style={styles.title} font="christmasBold">
        J'ai déjà mon gobelin
      </ThemedText>

      <ThemedTextInput
        placeholder="Adresse e-mail"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
        background="bar1"
      />

      <ThemedTextInput
        placeholder="Mot de passe"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <ThemedButton onPress={handleSubmit}>
        <Text style={{ color: "#f2f2f2" }}>Se connecter</Text>
      </ThemedButton>

      <Spacer />
      <FirefliesSimple count={15} />

      {error && (
        <ThemedText style={{ color: Colors.error, marginTop: 10 }}>
          {error}
        </ThemedText>
      )}
      <Link href="/register" replace>
        <ThemedText
          style={{
            textAlign: "center",
            color: theme.accentColor1,
            ...styles.link,
          }}
        >
          Créer un compte
        </ThemedText>
      </Link>
    </ThemedView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    marginBottom: 30,
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
  link: {
    color: "#ffffffff",
    marginTop: 10,
    textAlign: "center",
    textDecorationLine: "underline",
    fontFamily: "Merriweather-Light",
  },
});
