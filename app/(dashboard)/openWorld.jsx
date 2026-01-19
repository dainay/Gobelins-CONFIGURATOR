import { useRouter } from "expo-router";
import { Suspense, useEffect, useMemo, useState } from "react";
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

import { Canvas } from "@react-three/fiber/native";
import Avatar from "../(three)/Avatar";
import ThemedText from "../../components/ui/ThemedText";
import { fetchGobelinsPage } from "../../src/lib/listGobelins";
import { useGobelinStore } from "../../src/store/gobelinStore";

import { playSfx } from "../../src/lib/sounds";

const openWorld = () => {
  const router = useRouter();
  const { user } = useUser();
  const gobelinName = useGobelinStore((s) => s.name);
  const gobelin = useGobelinStore((s) => s);

  const [listGobelins, setListGobelins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [activeAnimation, setActiveAnimation] = useState(null);

  useEffect(() => {
    setActiveAnimation(null);
  }, [currentIndex]);

  const playTempAnimation = () => {
    if (!currentGobelin?.animation) return;

    setActiveAnimation(currentGobelin.animation);
    playSfx("scream");

    setTimeout(() => {
      setActiveAnimation(null);
    }, 3000);
  };

  const loadGobelins = async (targetPage, { append = false } = {}) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);

      const list = await fetchGobelinsPage(targetPage);
      const safe = list || [];

      setListGobelins((prev) => (append ? [...prev, ...safe] : safe));
      setPage(targetPage);

      if (safe.length === 0) setHasMore(false);

      return safe;
    } catch (e) {
      console.log("Fetch gobelins failed:", e);
      return [];
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  useEffect(() => {
    loadGobelins(0, { append: false });
  }, []);

  const currentGobelin = useMemo(
    () => listGobelins[currentIndex] ?? null,
    [listGobelins, currentIndex],
  );

  //   const msgs = [
  //   "Personne ici — les Gobelins fait la sieste ",
  //   "Aucun Gobelin en vue — le tien est le premier ! ",
  //   "Les Gobelins sont en grève aujourd'hui ✊",
  //   "Silence gobelinique — sois le premier"
  // ];
  // const msg = msgs[Math.floor(Math.random()*msgs.length)];

  const goNext = async () => {
    if (loading || loadingMore) return;

    if (currentIndex < listGobelins.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }

    if (!hasMore) return;

    const nextPage = page + 1;
    const newItems = await loadGobelins(nextPage, { append: true });

    if (newItems.length > 0) {
      setCurrentIndex((i) => i + 1);
    } else {
      console.log("No more gobelins");
    }
  };

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));

  return (
    <ThemedView safe={true} style={styles.container}>
      <View style={styles.bgImageWrapper} pointerEvents="none">
        <Image source={ImgBack} style={[styles.bgImage]} resizeMode="cover" />
      </View>

      {/* ==================HEADER==================== */}
      <Pressable
        style={styles.avatarSection}
        onPress={() => router.replace("/(dashboard)/profile")}
      >
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
          <ThemedText
            font="sofia"
            style={[styles.gobelinName, { color: Colors.black }]}
          >
            {gobelinName}
          </ThemedText>
          <ThemedText style={styles.userName}>
            de {user?.user_metadata?.display_name || "User"}
          </ThemedText>
        </ImageBackground>
      </Pressable>

      {/* ==================CARDS (centered vertically)==================== */}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ImageBackground
          source={Main}
          resizeMode="stretch"
          style={{
            width: "95%",
            alignSelf: "center",
            height: 520,
            justifyContent: "center",
            transform: [{ translateX: 15 }],
          }}
        >
          <View style={styles.cardsSection}>
            <View
              style={{
                position: "absolute",
                top: 10,
                left: -25,
                right: 0,
                height: 400,
                zIndex: 999,
              }}
            >
              <ThemedText
                style={[styles.names, { fontSize: 34, top: 40 }]}
                font="sofia"
              >
                {currentGobelin?.name || "Incognito"}
              </ThemedText>
              <ThemedText
                style={[styles.names, { fontSize: 18, top: 36 }]}
                font="merriweatherLight"
              >
                de {currentGobelin?.user_name || "Incognito"}
              </ThemedText>

              {loading ? (
                <ThemedText>Loading...</ThemedText>
              ) : !currentGobelin ? (
                <ThemedText>No gobelin</ThemedText>
              ) : (
                <Canvas
                  style={{
                    width: 350,
                    height: 400,
                    alignSelf: "center",
                  }}
                  shadows
                  dpr={1}
                  camera={{ position: [0, 0.9, 3.5], fov: 35 }}
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
                    state.camera.lookAt(0, 1, 0);
                  }}
                >
                  <ambientLight intensity={0.9} />
                  <directionalLight position={[5, 5, 5]} intensity={2} />

                  <Suspense fallback={null}>
                    <Avatar
                      onPress={playTempAnimation}
                      animation={activeAnimation}
                      pose={!activeAnimation ? currentGobelin.pose : undefined}
                      hair={currentGobelin.hair}
                      cloth={currentGobelin.cloth}
                    />
                  </Suspense>
                </Canvas>
              )}
            </View>
          </View>

          <View style={styles.navRow}>
            <Pressable style={styles.navButton} onPress={goPrev}>
              <Image
                source={Arrow}
                style={{ width: 100, height: 70, transform: [{ scaleX: -1 }] }}
              />
            </Pressable>

            <Pressable style={styles.navButton} onPress={goNext}>
              <Image source={Arrow} style={{ width: 100, height: 70 }} />
            </Pressable>
          </View>
        </ImageBackground>
      </View>

      {/* ==================LINKS==================== */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <View style={{ flex: 1, marginRight: 10 }}>
          <ImageBackground
            source={Btn}
            resizeMode="stretch"
            style={{
              width: "100%",
              height: 120,
              justifyContent: "center",
            }}
          >
            <Pressable
              style={[
                styles.linkSection,
                { width: "100%", alignItems: "center" },
              ]}
              onPress={() => console.log("Navigate to demands")}
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
              width: "100%",
              height: 120,
              justifyContent: "center",
            }}
          >
            <Pressable
              style={[
                styles.linkSection,
                { width: "100%", alignItems: "center" },
              ]}
              onPress={() => console.log("Navigate to propositions")}
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
  names: {
    color: Colors.black,
    textAlign: "center",
    position: "relative",
  },
  avatarSection: {
    position: "absolute",
    top: 50,
    left: 0,
    width: 230,
  },
  avatarText: {
    fontSize: 24,
    position: "absolute",
    textAlign: "center",
  },
  navButton: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
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
    color: "white",
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  linkArrow: {
    fontSize: 20,
    fontWeight: "600",
  },
});
