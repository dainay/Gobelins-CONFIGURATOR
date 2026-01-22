import { Canvas } from "@react-three/fiber/native";
import { useRouter } from "expo-router";
import { Suspense, useEffect, useState } from "react";
import { Image, ImageBackground, Pressable, StyleSheet, View } from "react-native";

import GreenButton from "../../components/ui/GreenButton";
import ThemedText from "../../components/ui/ThemedText";
import ThemedView from "../../components/ui/ThemedView";

import Avatar from "../(three)/Avatar";
import { Colors } from "../../constants/Colors";
import { GuildsInfo } from "../../constants/GuildsInfo";
import { useUser } from "../../hooks/useUser";
import { useGobelinStore } from "../../src/store/gobelinStore";

import CloseIcon from "../../assets/icons/close.png";
import InputBg from "../../assets/ui/bars/input.webp";
import TabActiveBg from "../../assets/ui/tabs-bar/tab-active.webp";
import ImgBack from "../../assets/ui/world/back-world.png";

const Profile = () => {
  const router = useRouter();
  const { logout, user } = useUser();

  const configuration = useGobelinStore((s) => s.configuration);
  const name = useGobelinStore((s) => s.name);
  const guild = useGobelinStore((s) => s.guild);

  const guildInfo = guild
    ? GuildsInfo.guilds.find((g) => g.id === guild)
    : null;

  const [activeAnimation, setActiveAnimation] = useState(null);

  useEffect(() => {
    console.log("User in profile:", user);
  }, []);

  const playTempAnimation = () => {
     
    setActiveAnimation(configuration?.animation || "ANIM_danse2");
    setTimeout(() => setActiveAnimation(null), 7000);
  };

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.bgImageWrapper} pointerEvents="none">
        <Image source={ImgBack} style={styles.bgImage} resizeMode="cover" />
      </View>

      {/* Back button outside centerWrapper */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.replace("/(dashboard)/openWorld")}
      >
        <Image source={CloseIcon} style={styles.closeIcon} resizeMode="contain" />
      </Pressable>

      <View style={styles.centerWrapper}>
        {/* Header */}
        {/* <View style={styles.titleBlock}>
          <ThemedText style={styles.headerTitle} font="merriweather">
            Ton profil
          </ThemedText>
         
        </View> */}

        {/* Avatar stage */}
        <View style={styles.avatarStage}>
          <Canvas
            style={styles.canvas}
            dpr={1}
            camera={{ position: [0, 0, 3], fov: 35 }}
            onCreated={(state) => {
              const _gl = state.gl.getContext();
              const pixelStorei = _gl.pixelStorei.bind(_gl);
              _gl.pixelStorei = function (...args) {
                const [parameter] = args;
                switch (parameter) {
                  case _gl.UNPACK_FLIP_Y_WEBGL:
                    return pixelStorei(...args);
                  default:
                    return;
                }
              };
              state.camera.lookAt(0, 0.5, 0);
            }}
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 5, 5]} intensity={2} />

            <Suspense fallback={null}>
              
              <group position={[0, -0.15, 0]}>
                <Avatar
                  onPress={playTempAnimation}
                  hair={configuration?.hair}
                  cloth={configuration?.cloth}
                  animation={activeAnimation}
                  pose={!activeAnimation ? configuration?.pose : undefined}
                />
              </group>
            </Suspense>
          </Canvas>
        </View>

        {/* Info */}
        <View style={styles.info}>
           <Image
            source={require("../../assets/ui/tutorial/motif.webp")}
            style={styles.underlineMotif}
            resizeMode="stretch"
          />
          <ImageBackground
            source={InputBg}
            style={styles.infoCard}
            imageStyle={styles.infoCardImage}
            resizeMode="stretch"
          >
            <ThemedText style={styles.userName} font="merriweather" numberOfLines={1}>
             Salut, {user?.user_metadata?.display_name || "User"} !
            </ThemedText>
            <ThemedText style={styles.email} font="merriweather" numberOfLines={1}>
              {user?.email || ""}
            </ThemedText>
          </ImageBackground>

          <ImageBackground
            source={InputBg}
            style={styles.infoCard}
            imageStyle={styles.infoCardImage}
            resizeMode="stretch"
          >
            <ThemedText style={styles.line} font="merriweather">
              Tu as appelé ton gobelin :{" "}
              <ThemedText style={styles.bold} font="merriweatherBold">{name || "Incognito"}</ThemedText>
            </ThemedText>
          </ImageBackground>

          {guildInfo && (
            <ImageBackground
              source={TabActiveBg}
              style={styles.guildCard}
              imageStyle={styles.guildCardImage}
              resizeMode="stretch"
            >
               <ThemedText style={[styles.line, styles.guildTitle]} font="merriweather">
                Guilde 
                
              </ThemedText>
              <Image
                source={guildInfo.image}
                style={styles.guildLogo}
                resizeMode="contain"
              />
             
            </ImageBackground>
          )}

          <GreenButton title="Se déconnecter" onPress={logout} />
        </View>
      </View>
    </ThemedView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 40,
  },
  bgImageWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  bgImage: {
    width: "100%",
    height: "100%",
  },

  backButton: {
    position: "absolute",
    top: 55,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  closeIcon: {
    width: 28,
    height: 28,
  },

  titleBlock: {
    alignItems: "center",
    width: "100%",
  },
  headerTitle: {
    color: Colors.brownText,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Merriweather",
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
  underlineMotif: {
    height: 45,
    maxWidth: "100%",
    marginTop: -12,
  },

  avatarStage: {
    width: "90%",
    // maxWidth: 80,
    height: 300,
    marginVertical: -20,
  
  },
  avatarStageImage: {
    width: "100%",
    height: "100%",
  },
  canvas: {
    flex: 1,
  },

  info: {
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 14,
    width: "85%",
    maxWidth: 380, 
    justifyContent: "center",
  },
  infoCard: {
    width: "100%", 
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  infoCardImage: {
    height: "100%",
  },
  guildCardImage: {
    height: "100%",
  },
  guildTitle: {
    color: '#ffeac0',
    lineHeight: 10,
    fontWeight: 'bold',
  },
  guildCard: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    overflow: "hidden",
    paddingBottom: 10,
  },
  userName: {
    color: Colors.brownText,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 20,
    paddingnBottom: 5,
  },
  email: {
    color: Colors.brownText,
    fontSize: 14,
    textAlign: "center",
    paddingBottom: 20,
  },
  line: {
    color: Colors.brownText,
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 0.2,
    paddingVertical: 20,
  },
  bold: {
    color: Colors.brownText,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  guildLogo: {
     height: 100,
    marginBottom: 20,
  },
});
