import { useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useUser } from "../../hooks/useUser";

import ThemedView from "../../components/ui/ThemedView";

import { Colors } from "../../constants/Colors";

import Arrow from "../../assets/ui/world/arrow.png";
import ImgBack from "../../assets/ui/world/back-world.png";
import Btn from "../../assets/ui/world/btn-world.png";
import Header from "../../assets/ui/world/header.png";

import Main from "../../assets/ui/world/main.png";

import ThemedButton from "../../components/ui/ThemedButton";
import ThemedText from "../../components/ui/ThemedText";
import { useGobelinStore } from "../../src/store/gobelinStore";

const openWorld = () => {
  const router = useRouter();
  const { user } = useUser();
  const gobelinName = useGobelinStore((s) => s.name);

  console.log(
    "User in openWorld:",
    user,
    Colors,
    Arrow,
    ImgBack,
    Main,
    ThemedText,
    ThemedButton
  );

  return (
    <ThemedView safe={true} style={styles.container}>
      <View style={styles.bgImageWrapper} pointerEvents="none">
        <Image source={ImgBack} style={[styles.bgImage]} resizeMode="cover" />
      </View>
      

    {/* ==================HEADER==================== */}
      <ImageBackground
        source={Header}
        resizeMode="stretch"
        style={{
          justifyContent: "center",
          marginVertical: 5,
          width: 400,
          height: 150,
          position: "relative",
        }}
      >
        <Pressable
          style={styles.avatarSection}
          onPress={() => router.replace("/(dashboard)/profile")}
        >
        <ThemedText font="sofia" style={[styles.gobelinName, { color: Colors.black }]}>
          {gobelinName}
        </ThemedText>
          <ThemedText style={styles.userName}>
           de {user?.user_metadata?.display_name || "User"}
          </ThemedText>
        </Pressable>

      </ImageBackground>


      {/* ==================CARDS (centered vertically)==================== */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ImageBackground
          source={Main}
          resizeMode="stretch"
          style={{
            width: '95%',
            alignSelf: 'center',
            height: 520,
            justifyContent: 'center',
          }}
        >
          <View style={styles.cardsSection}>
            <View style={styles.card}>
              <View style={styles.cardAvatar}>
                <Text style={styles.cardAvatarText}>👥</Text>
              </View>
              <Text style={styles.cardTitle}>Other Gobelins</Text>
              <Text style={styles.cardSubtitle}>Swipe to explore</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* ==================LINKS==================== */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <ImageBackground
            source={Btn}
            resizeMode="stretch"
            style={{
              width: '100%',
              height: 120,
              justifyContent: 'center',
            }}
          >
            <Pressable
              style={[styles.linkSection, { width: '100%', alignItems: 'center' }]}
              onPress={() => console.log('Navigate to demands')}
            >
              <Text style={styles.linkTitle}>Projet</Text>
            </Pressable>
          </ImageBackground>
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <ImageBackground
            source={Btn}
            resizeMode="stretch"
            style={{
              width: '100%',
              height: 120,
              justifyContent: 'center',
            }}
          >
            <Pressable
              style={[styles.linkSection, { width: '100%', alignItems: 'center' }]}
              onPress={() => console.log('Navigate to propositions')}
            >
              <Text style={styles.linkTitle}>Ma Guilde</Text>
            </Pressable>
          </ImageBackground>
        </View>
      </View>
    </ThemedView>
  );
};

export default openWorld;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarSection: {
    position: "absolute",
    top: 50,
    left: 140,
    width: 230, 
  },
  avatarText: {
    fontSize: 24,
    position: "absolute", 
    textAlign: "center",
  },
  userName: {
    fontSize: 16, 
    color: Colors.black,
    textAlign: "center",
    fontFamily: "Merriweather",
  },
  gobelinName: {
    fontSize: 30, 
    marginBottom: 4,
    fontFamily: "Sofia",
    textAlign: "center",
  },
  cardsSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  bgImage: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  card: { 
    
    width: "90%",
    alignItems: "center",
    
  },
  cardAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardAvatarText: {
    fontSize: 48,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  linkSection: {
    color: 'white', 

  },
  linkTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  linkArrow: {
    fontSize: 20,
    color: "#007AFF",
    fontWeight: "600",
  },
});
