import { Canvas } from "@react-three/fiber/native";
import { useRouter } from "expo-router";
import { Suspense, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import Spacer from "../../components/ui/Spacer";
import ThemedButton from "../../components/ui/ThemedButton";
import ThemedText from "../../components/ui/ThemedText";
import ThemedView from "../../components/ui/ThemedView";

import Avatar from "../(three)/Avatar";
import { GuildsInfo } from "../../constants/GuildsInfo";
import { useUser } from "../../hooks/useUser";
import { useGobelinStore } from "../../src/store/gobelinStore";

import ImgBack from "../../assets/ui/world/back-world.png";
// import { playSfx } from "../../src/lib/sounds"; // если нужно

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
    setTimeout(() => setActiveAnimation(null), 5000);
  };

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.bgImageWrapper} pointerEvents="none">
        <Image source={ImgBack} style={styles.bgImage} resizeMode="cover" />
      </View>

      <View style={styles.centerWrapper}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace("/(dashboard)/openWorld")}
          >
            <ThemedText style={styles.backText}>✕</ThemedText>
          </Pressable>

          <ThemedText style={styles.headerTitle} font="sofia">
            Profil
          </ThemedText>

          {/* spacer to keep title centered */}
          <View style={{ width: 44, height: 44 }} />
        </View>

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
          <ThemedText style={styles.userName} numberOfLines={1}>
            {user?.user_metadata?.display_name || "User"}
          </ThemedText>
          <ThemedText style={styles.email} numberOfLines={1}>
            {user?.email || ""}
          </ThemedText>

          <Spacer />

          <ThemedText style={styles.line}>
            Ton gobelin:{" "}
            <ThemedText style={styles.bold}>{name || "Incognito"}</ThemedText>
          </ThemedText>

          <View style={styles.guildRow}>
            {guildInfo && (
              <Image
                source={guildInfo.image}
                style={styles.guildLogo}
                resizeMode="contain"
              />
            )}
            <ThemedText style={styles.line}>
              Guilde:{" "}
              <ThemedText style={styles.bold}>
                {guildInfo?.name || "—"}
              </ThemedText>
            </ThemedText>
          </View>

          <Spacer />

          <ThemedButton onPress={logout}>
            <ThemedText style={styles.logoutText}>Logout</ThemedText>
          </ThemedButton>
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
  },
  bgImageWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  bgImage: {
    width: "100%",
    height: "100%",
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#000",
    fontSize: 26,
    textAlign: "center",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 26,
    color: "#000",
    lineHeight: 26,
  },

  avatarStage: {
    width: "90%",
    height: 360,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  canvas: {
    flex: 1,
  },

  info: {
    paddingHorizontal: 20,
    paddingTop: 18,
    alignItems: "center",
  },
  userName: {
    color: "#000",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  email: {
    color: "#000",
    fontSize: 14,
    opacity: 0.7,
  },
  line: {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
  },
  bold: {
    color: "#000",
    fontWeight: "700",
  },
  guildRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guildLogo: {
    width: 48,
    height: 48,
  },
  logoutText: {
    color: "#000",
  },
});
