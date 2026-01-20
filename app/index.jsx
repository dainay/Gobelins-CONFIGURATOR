import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { Colors } from "../constants/Colors";
import { useUser } from "../hooks/useUser";

import GuestOnly from "../components/auth/GuestOnly";
import ThemedButton from "../components/ui/ThemedButton";
import ThemedLogo from "../components/ui/ThemedLogo";
import ThemedText from "../components/ui/ThemedText";
import ThemedTextInput from "../components/ui/ThemedTextInput";
import ThemedView from "../components/ui/ThemedView";
import { mapSupabaseAuthError } from "../src/lib/mapSupabaseAuthError";

import FirefliesSimple from "../components/ui/FirefliesSimple";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: false },
    ).start();
  }, [opacity]);

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
      // console.log("Login error ##################:", error.code);
      setError(mapSupabaseAuthError(error));
    }
  };

  return (
    <ThemedView safe={true} style={[styles.container]} keyboard={true}>
      <GuestOnly>
        <View style={styles.bgImageWrapper} pointerEvents="none">
          <Image
            source={require("../assets/img/temp-back.png")}
            style={[styles.bgImage]}
            resizeMode="cover"
          />
        </View>
        <ThemedLogo />

        {/* <View style={{ position: 'relative', width: '100%', height: 150, alignItems: 'center', justifyContent: 'center' }}>
          <ThemedText
            title={true}
            font="christmasBold"
            style={[styles.goblink, { position: 'absolute', top: 0, left: 0, width: '100%' }]}
          >
            Gob'Link
          </ThemedText>
          <Animated.View style={[{ position: 'absolute', top: 0, left: 0, width: '100%' }, { opacity }]}> 
            <ThemedText
              title={true}
              font="christmasBold"
              style={[styles.goblink, { textShadowColor: theme.magicGreen }]}
            >
              Gob'Link
            </ThemedText> 
          </Animated.View>
        </View> */}

        <ThemedText title={true} font="sofia" style={[styles.secondTitle]}>
          Connecte à ton Gobelin
        </ThemedText>

        <ThemedTextInput
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
          background={"bar1"}
        />

        <ThemedTextInput
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          background={"bar2"}
        />

        <FirefliesSimple count={15} />

        <ThemedButton onPress={handleSubmit} type="button1">
          Se connecter
        </ThemedButton>

        {error && (
          <ThemedText style={{ color: Colors.error }}>{error}</ThemedText>
        )}

        <ThemedText style={styles.link}>Mot de passe oublié ?</ThemedText>

        <Link href="/register">
          <ThemedText style={styles.link}>
            Pas encore de gobelin ? {"\n"} Crée le tien ici
          </ThemedText>
        </Link>

        <Link href="/home">
          <ThemedText style={styles.link}>TABS</ThemedText>
        </Link>
        <Link href="/Scene">
          <ThemedText style={styles.link}>DEMO 3D</ThemedText>
        </Link>

        <Link href="/introManager">
          <ThemedText style={styles.link}>INTRO</ThemedText>
        </Link>
      </GuestOnly>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  goblink: {
    fontSize: 108,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 45,
    width: "100%",
    textAlign: "center",
  },
  secondTitle: {
    fontSize: 40,
  },
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
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  link: {
    color: "#ffffffff",
    marginTop: 10,
    textAlign: "center",
  },
});

export default Home;
