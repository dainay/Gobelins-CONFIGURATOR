import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  View,
  useColorScheme
} from "react-native";
import { Colors } from "../constants/Colors";
import { useUser } from "../hooks/useUser";

import GuestOnly from "../components/auth/GuestOnly";

import GreenButton from "../components/ui/GreenButton";
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
            source={require("../assets/img/temp-back.webp")}
            style={[styles.bgImage]}
            resizeMode="cover"
          />
        </View>
        {/* Décor en absolute (hors layout des 4 blocs) */}
        <FirefliesSimple count={15} />
        <View style={styles.globalContent}>
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

          <View style={styles.titleBlock}>
            <ThemedText
              title={true}
              font="merriweather"
              style={[styles.secondTitle]}
            >
              Connecte toi à ton Gobelin
            </ThemedText>
            <Image
              source={require("../assets/ui/tutorial/motif.webp")}
              style={styles.underlineMotif}
              resizeMode="contain"
            />
          </View>

          <View style={styles.inputsBlock}>
            <ThemedTextInput
              placeholder="Email"
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
            />
            <ThemedText
              font="merriweather"
              style={styles.forgotPassword}
            >
              Mot de passe oublié
            </ThemedText>
          </View>

          <View style={styles.actionsBlock}>
            <GreenButton style={{minWidth: 70}} title="Se connecter" onPress={handleSubmit} />

            {error && (
              <ThemedText font="merriweather" style={{ color: Colors.error }}>
                {error}
              </ThemedText>
            )}

            <Link href="/register">
              <ThemedText
                font="merriweather"
                style={[styles.link, { width: 200, lineHeight: 22 }]}
              >
                Pas encore de gobelin ?{"\n"}
                <ThemedText font="merriweatherBold" style={{ color: Colors.yellow, textDecorationLine: "underline" }}>
                  Crée le tien ici
                </ThemedText>
              </ThemedText>
            </Link>
          </View>
        </View>

        {/* DEBUG shortcuts */}
        
        {/* <Pressable
          style={[styles.debugButton, styles.debugLeft]}
          onPress={() => router.push("/Scene")}
        >
          <ThemedText font="merriweather" style={styles.debugButtonText}>
            DEMO 3D
          </ThemedText>
        </Pressable> */}

        {/* <Pressable
          style={[styles.debugButton, styles.debugRight]}
          onPress={() => router.push("/introManager")}
        >
          <ThemedText font="merriweather" style={styles.debugButtonText}>
            INTRO
          </ThemedText>

        </Pressable> */}
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
    fontSize: 20,
    fontFamily: "Merriweather",
    fontWeight: "bold",
    width: "70%",
    textAlign: "center",
  },
  underlineMotif: {
    height: 60,
    maxWidth: "95%",
    alignSelf: "center",

    marginTop: -20,
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
  forgotPassword: {
    width: 275,
    textAlign: "right",
    marginTop: 4,
    color: "white",
    fontSize: 12,
    fontFamily: "Merriweather",
  },
  actionsBlock: {
    width: "100%",
    alignItems: "center",
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
    backgroundColor: "black",
  },
  bgImage: {
    height: "100%",
    width: "100%",
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
  debugLeft: {
    position: "absolute",
    top: 50,
    left: 12,
    zIndex: 9999,
  },
  debugRight: {
    position: "absolute",
    top: 50,
    right: 12,
    zIndex: 9999,
  },
  debugButtonText: {
    fontSize: 12,
    color: "#0b2b12",
    fontWeight: "700",
    textAlign: "center",
  },
  debugButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 110,
    alignItems: "center",
    justifyContent: "center",
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});

export default Home;
