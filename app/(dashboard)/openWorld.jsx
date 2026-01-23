import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import { useRouter } from "expo-router";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../../hooks/useUser";

import ThemedView from "../../components/ui/ThemedView";

import { Colors } from "../../constants/Colors";

import Btn from "../../assets/ui/buttons/button.webp";
import Arrow from "../../assets/ui/world/arrow.webp";
import ButtonHome from "../../assets/ui/world/button-home.webp";
import ImgBack from "../../assets/ui/world/fond-world.webp";
import ButtonWorld from "../../assets/ui/world/name-place.webp";

import Main from "../../assets/ui/tutorial/long-paper.webp";
import TutorialBackground from "../../assets/ui/tutorial/tutorial-background.webp";

import { Canvas } from "@react-three/fiber/native";
import Avatar from "../(three)/Avatar";
import ThemedText from "../../components/ui/ThemedText";
import { fetchGobelinsPage } from "../../src/lib/listGobelins";
import { useGobelinStore } from "../../src/store/gobelinStore";

import { playSfx, stopAllSfx } from "../../src/lib/sounds";

const openWorld = () => {
  const animTimeoutRef = useRef(null);
  const prefetchedRef = useRef(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  const [countTouch, setCountTouch] = useState(0);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const [showPopup, setShowPopup] = useState(false);
  const [popupStep, setPopupStep] = useState(0);

  const popupPages = [
    {
      text: "Gob'link, c'est avant tout une histoire d'entraide entre étudiant·es : se rencontrer, s'aider, créer ensemble.\n\nCette partie arrivera très bientôt.",
    },
    {
      text: "En attendant, tu peux déjà découvrir les Gobelins créés par la communauté. Parle-leur. Fais-les danser. Embête-les ! Fais les vivre !\n\nÀ très vite.\nGob'link",
    },
  ];

  const cancelCurrentInteraction = async () => {
    if (animTimeoutRef.current) {
      clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = null;
    }
    setActiveAnimation(null);
    try {
      await stopAllSfx();
    } catch (e) {
      console.log("stopAllSfx error:", e);
    }
  };

  useEffect(() => {
    cancelCurrentInteraction();
    setCountTouch(0);
    // Réinitialiser l'animation quand le gobelin change
    slideAnim.setValue(0);
    opacityAnim.setValue(1);
  }, [currentIndex]);

  const playTempAnimation = async () => {
    if (!currentGobelin?.animation) return;

    await cancelCurrentInteraction();

    setCountTouch((c) => {
      const nextCount = c + 1;

      let chosenAnim = currentGobelin.animation;
      let audioKey = ["suffering1", "suffering3", "yay"][
        Math.floor(Math.random() * 4)
      ];
      let volume = 0.1;

      if (nextCount > 2) {
        chosenAnim = "ANIM_scream";
        audioKey = "scream";
        volume = 1;
      }

      setActiveAnimation(chosenAnim);
      playSfx(audioKey, { volume });
      animTimeoutRef.current = setTimeout(() => {
        setActiveAnimation(null);
        animTimeoutRef.current = null;
      }, 4000);

      return nextCount;
    });
  };

  const loadGobelins = async (targetPage, { append = false } = {}) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);

      const list = await fetchGobelinsPage(targetPage);
      const safe = list || [];

      // Filter out current user's gobelin
      const filtered = safe.filter((g) => g.user_id !== user?.id);

      setListGobelins((prev) => (append ? [...prev, ...filtered] : filtered));
      setPage(targetPage);

      if (filtered.length === 0) setHasMore(false);

      return filtered;
    } catch (e) {
      console.log("Fetch gobelins failed:", e);
      return [];
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  // Précharge les assets de la page (1 seule fois)
  useEffect(() => {
    if (prefetchedRef.current) return;
    prefetchedRef.current = true;

    [Btn, Arrow, ImgBack, ButtonHome, ButtonWorld, Main, TutorialBackground].forEach((mod) => {
      // Fire-and-forget: évite les "pop" au 1er affichage
      Asset.fromModule(mod).downloadAsync();
    });
  }, []);

  useEffect(() => {
    loadGobelins(0, { append: false });
    
    // Vérifier si le popup a déjà été vu
    const checkPopupSeen = async () => {
      try {
        const hasSeenPopup = await AsyncStorage.getItem("hasSeenOpenWorldPopup");
        if (!hasSeenPopup) {
          setShowPopup(true);
          setPopupStep(0);
        }
      } catch (error) {
        console.log("Error checking popup status:", error);
        // En cas d'erreur, on affiche le popup par défaut
        setShowPopup(true);
        setPopupStep(0);
      }
    };
    
    checkPopupSeen();
  }, []);

  const currentGobelin = useMemo(
    () => listGobelins[currentIndex] ?? null,
    [listGobelins, currentIndex],
  );

  const goNext = async () => {
    if (loading || loadingMore) return;

    await cancelCurrentInteraction();
    setCountTouch(0);

    // Animation de slide vers la gauche
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      // Réinitialiser et changer de gobelin
      slideAnim.setValue(150);
      opacityAnim.setValue(0);

      if (currentIndex < listGobelins.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (hasMore) {
        const nextPage = page + 1;
        const newItems = await loadGobelins(nextPage, { append: true });
        if (newItems.length > 0) {
          setCurrentIndex((i) => i + 1);
        }
      }

      // Small delay to let Canvas mount with new gobelin before fading in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Animation d'entrée depuis la droite
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        });
      });
    });
  };

  const goPrev = async () => {
    await cancelCurrentInteraction();
    setCountTouch(0);

    // Animation de slide vers la droite
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 150,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Réinitialiser et changer de gobelin
      slideAnim.setValue(-150);
      opacityAnim.setValue(0);
      setCurrentIndex((i) => Math.max(0, i - 1));

      // Small delay to let Canvas mount with new gobelin before fading in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Animation d'entrée depuis la gauche
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        });
      });
    });
  };

  return (
    <ThemedView safe={true} style={styles.container}>
      <View style={[styles.bgImageWrapper, { top: -insets.top, bottom: -insets.bottom }]} pointerEvents="none">
        <Image source={ImgBack} style={styles.bgImage} resizeMode="cover" />
      </View>

      <View style={styles.mainContainer}>
        {/* ==================HEADER==================== */}
        <View style={styles.headerContainer}>
          <ImageBackground
            source={ButtonHome}
            resizeMode="contain"
            style={styles.headerLeft}
          >
            {/* Partie gauche du header */}
          </ImageBackground>
          <Pressable 
            onPress={() => router.replace("/(dashboard)/profile")}
            style={styles.headerRightPressable}
          >
            <ImageBackground
              source={ButtonWorld}
              resizeMode="contain"
              style={styles.headerRight}
            >
              <ThemedText
                font="sofia"
                style={styles.gobelinName}
              >
                {gobelinName}
              </ThemedText>
              <ThemedText style={styles.userName}>
                de {user?.user_metadata?.display_name || "User"}
              </ThemedText>
            </ImageBackground>
          </Pressable>
        </View>

        {/* ==================CARDS (centered vertically)==================== */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ImageBackground
            source={Main}
            resizeMode="stretch"
            style={styles.mainBackground}
          >
          <View style={styles.cardsSection}>
            <View style={styles.gobelinContainer}>
              <Animated.View
                style={{
                  width: "100%",
                  height: "100%",
                  transform: [{ translateX: slideAnim }],
                  opacity: opacityAnim,
                }}
                pointerEvents="box-none"
              >
                <View style={styles.titleContainer}>
                  <ThemedText
                    style={styles.gobelinNameTitle}
                    font="merriweather"
                  >
                    {currentGobelin?.name || "Incognito"}
                  </ThemedText>
                  <ThemedText
                    style={styles.creatorNameTitle}
                    font="merriweather"
                  >
                    de {currentGobelin?.user_name || "Anonyme"}
                  </ThemedText>
                </View>

                {loading ? (
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ThemedText font="sofia" style={{ fontSize: 24, textAlign: "center" }}>
                      Chargement...
                    </ThemedText>
                  </View>
                ) : !currentGobelin ? (
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ThemedText font="sofia" style={{ fontSize: 24, textAlign: "center" }}>
                      Tous les gobelins sont en grève
                    </ThemedText>
                  </View>
                ) : (
                  <Canvas
                    key={`gobelin-${currentGobelin?.user_id}-${currentIndex}`}
                    style={styles.canvas3D}
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
              </Animated.View>
            </View>
          </View>

          <View style={styles.navRow}>
            <Pressable style={styles.navButton} onPress={goPrev}>
              <Image
                source={Arrow}
                style={{ width: 100, height: 70, marginTop: 2, transform: [{ scaleX: -1 }] }}
                resizeMode="contain"
              />
            </Pressable>

            <Pressable style={styles.navButton} onPress={goNext}>
              <Image 
                source={Arrow} 
                style={{ width: 100, height: 70, marginTop: 2 }} 
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </ImageBackground>
      </View>

      {/* ==================LINKS==================== */}
      <View style={styles.linksContainer}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <ImageBackground
            source={Btn}
            resizeMode="stretch"
            style={{
              width: "100%",
              height: 60,
              justifyContent: "center",
            }}
          >
            <Pressable
              style={[
                styles.linkSection,
                { width: "100%", alignItems: "center" },
              ]}
              onPress={() => {
                // setShowPopup(true);
                // setPopupStep(0);
              }}
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
              height: 60,
              justifyContent: "center",
            }}
          >
            <Pressable
              style={[
                styles.linkSection,
                { width: "100%", alignItems: "center" },
              ]}
              onPress={() => {
                // setShowPopup(true);
                // setPopupStep(0);
              }}
            >
              <Text style={styles.linkTitle}>Ma Guilde</Text>
            </Pressable>
          </ImageBackground>
        </View>
      </View>
      </View>

      {/* ==================POPUP==================== */}
      <Modal
        visible={showPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        {popupStep < popupPages.length - 1 ? (
          <Pressable
            style={styles.modalOverlay}
            onPress={() => {
              if (popupStep < popupPages.length - 1) {
                setPopupStep(popupStep + 1);
              }
            }}
          >
            <ImageBackground
              source={require("../../assets/ui/tutorial/tutorial-background.webp")}
              style={styles.popupBackground}
              resizeMode="stretch"
              imageStyle={styles.backgroundImage}
            >
              <View style={styles.popupContent}>
                <View style={styles.popupTextContainer}>
                  <ThemedText font="merriweatherBold" style={styles.popupTitle}>
                    Merci d'avoir terminé l'expérience Gob'link.
                  </ThemedText>
                  <Image
                    source={require("../../assets/ui/tutorial/bar-subtitle.webp")}
                    style={styles.subtitleImage}
                    resizeMode="contain"
                  />
                  <ThemedText font="merriweather" style={styles.popupText}>
                    {popupPages[popupStep]?.text}
                  </ThemedText>
                </View>

                <View style={styles.buttonContainer}>
                  <ThemedText font="merriweather" style={styles.hintText}>
                    Appuyez pour continuer
                  </ThemedText>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        ) : (
          <Pressable
            style={styles.modalOverlay}
            onPress={async () => {
              // Marquer que le popup a été vu
              try {
                await AsyncStorage.setItem("hasSeenOpenWorldPopup", "true");
              } catch (error) {
                console.log("Error saving popup status:", error);
              }
              setShowPopup(false);
            }}
          >
            <ImageBackground
              source={require("../../assets/ui/tutorial/tutorial-background.webp")}
              style={styles.popupBackground}
              resizeMode="stretch"
              imageStyle={styles.backgroundImage}
            >
              <View style={styles.popupContent}>
                <View style={styles.popupTextContainer}>
                  <ThemedText font="merriweatherBold" style={styles.popupTitle}>
                    Merci d'avoir terminé l'expérience Gob'link.
                  </ThemedText>
                  <Image
                    source={require("../../assets/ui/tutorial/bar-subtitle.webp")}
                    style={styles.subtitleImage}
                    resizeMode="contain"
                  />
                  <ThemedText font="merriweather" style={styles.popupText}>
                    {popupPages[popupStep]?.text}
                  </ThemedText>
                </View>

                <View style={styles.buttonContainer}>
                  <ThemedText font="merriweather" style={styles.hintText}>
                    Appuyez pour continuer
                  </ThemedText>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        )}
      </Modal>
    </ThemedView>
  );
};

export default openWorld;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 36, 
    paddingBottom: 30, 
  },
  names: {
    color: Colors.black,
    textAlign: "center",
    position: "relative",
  },
  musicButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.75)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  musicText: {
    fontSize: 24,
    lineHeight: 24,
  },
  avatarSection: {
    // position: "absolute",
    // top: 50,
    // left: 0,
    // width: 230,
    width: "100%",
  },
  headerContainer: {
    width: "100%",
    height: 125,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
  },
  headerLeftPressable: {
    width: 100,
    height: "100%",
  },
  headerLeft: {
    width: 100,    
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerRightPressable: {
    flex: 1,
    height: "100%",
  },
  headerRight: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 6,
  },
  avatarText: {
    fontSize: 24,
    position: "absolute",
    textAlign: "center",
  },
  navButton: {
    alignItems: "center",
    marginHorizontal: 15,
    zIndex: 1001,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    // paddingHorizontal: 12,
    position: "absolute",
    // transform: [{ translateY: "-50%" }],
    left: 0,
    bottom: "45%",
    transform: [{ translateY: "50%" }],
    zIndex: 1000,
  },
  userName: {
    fontSize: 16,
    color: Colors.brownText,
    textAlign: "center",
    fontFamily: "Merriweather",
  },
  gobelinName: {
    fontSize: 20,
    // marginBottom: 4,
    fontFamily: "merriweather",
    fontWeight: "bold",
    color: Colors.brownText,
    textAlign: "center",
  },
  cardsSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  mainBackground: {
    width: "100%",
    height: 500,
    justifyContent: "center",
  },
  gobelinContainer: {
    // position: "absolute",
    // top: 10,
    // left: "50%",
    // transform: [{ translateX: "-50%" }],
    height: "100%",
    maxHeight: 500,
    width: "100%",
    zIndex: 1,
    paddingTop: 50,
    position: "relative",
  },
  canvas3D: {
    width: "100%",
    maxWidth: 400,
    height: 400,
    alignSelf: "center",
    marginBottom: 80,
  },
  titleContainer: {},
  gobelinNameTitle: {
    color: Colors.brownText,
    textAlign: "center",
    position: "relative",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
  },
  creatorNameTitle: {
    color: Colors.brownText,
    textAlign: "center",
    position: "relative",
    fontSize: 16,
  },
  bgImageWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 0,
  },
  bgImage: {
    width: "100%",
    height: "100%",
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
  linksContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  linkSection: {
    color: "white",
  },
  linkTitle: {
    fontFamily: "Merriweather-Bold",
    fontSize: 16,
    textAlign: "center",
    color: Colors.brownText,
    paddingBottom: 3,
  },
  linkArrow: {
    fontSize: 20,
    fontWeight: "600",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  popupBackground: {
    width: "105%",
    maxWidth: 425,
    height: "65%",
    maxHeight: 500,
    minHeight: 500,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  popupContent: {
    flex: 1,
    padding: 24,
    marginTop: 50,
    paddingBlock: 50,
    paddingBottom: 62,
    justifyContent: "space-between",
  },
  popupTextContainer: {
    marginBottom: 24,
    paddingInline: 36,
  },
  popupTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.5,
    color: Colors.brownText,
  },
  subtitleImage: {
    width: "100%",
    marginBottom: 16,
    alignSelf: "center",
  },
  popupText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.2,
    color: Colors.brownText,
  },
  buttonContainer: {
    alignItems: "center",
  },
  hintText: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
    color: Colors.brownText,
  },
});
