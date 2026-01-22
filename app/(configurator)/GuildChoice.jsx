import { router } from "expo-router";
import { GuildsInfo } from "../../constants/GuildsInfo";

import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Fingers from "../../components/Fingers";
import GreenButton from "../../components/ui/GreenButton";
import ThemedButton from "../../components/ui/ThemedButton";
import ThemedText from "../../components/ui/ThemedText";
import { Colors } from "../../constants/Colors";
import { TabsInfo } from "../../constants/TabsInfo";
import { useConfigurateurStore } from "../../src/store/configurateurStore";
import { useGobelinStore } from "../../src/store/gobelinStore";
import { useMenuStore } from "../../src/store/menuStore";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// function CameraSetup() {
//   const { camera } = useThree();
//   camera.position.set(0, 0, 5.5);
//   camera.lookAt(0, 0, 0);
//   return null;
// }

function GuildChoice() {
  const guild = useGobelinStore((state) => state.guild);
  const setGuild = useGobelinStore((state) => state.setGuild);
  const setActiveMenu = useMenuStore((state) => state.setActiveMenu);
  const setActiveTab = useConfigurateurStore((state) => state.setActiveTab);
  // 0 = intro (texte), 1 = Fingers, 2 = écran final (initiation)
  const [flowStep, setFlowStep] = useState(0);

  const randomGuild = () => {
    const guildData =
      GuildsInfo.guilds[Math.floor(Math.random() * GuildsInfo.guilds.length)];
    console.log("Selected guild data:", guildData);
    setGuild(guildData.id);
    setFlowStep(2);
  };

  const selectedGuildData = guild
    ? GuildsInfo.guilds.find((g) => g.id === guild)
    : null;

  // Si on arrive avec une guilde déjà choisie, aller direct à l'écran final
  useEffect(() => {
    if (guild) setFlowStep(2);
    else setFlowStep(0);
  }, [guild]);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require("../../assets/ui/tutorial/long-paper.webp")}
        resizeMode="stretch"
        style={[styles.parcheminBg, styles.debugParchemin]}
      >
        <View style={[styles.container, styles.debugContainer]}>
        <View
          style={[
            styles.actionContainer,
            styles.debugActionContainer,
            flowStep === 2 ? styles.actionContainerWithAbsCta : null,
          ]}
        >
          {flowStep === 2 ? (
            <>
              <View style={styles.step2Content}>
                {selectedGuildData && selectedGuildData.image && (
                  <Image
                    source={selectedGuildData.image}
                    style={styles.guildImage}
                    resizeMode="contain"
                  />
                )}
                {selectedGuildData && selectedGuildData.name && (
                  <ThemedText style={styles.guildName} font="merriweatherBold">
                    {selectedGuildData.name}
                  </ThemedText>
                )}
                {selectedGuildData && selectedGuildData.description && (
                  <ThemedText style={styles.guildDescription} font="merriweather">
                    {selectedGuildData.description}
                  </ThemedText>
                )}
              </View>

              <View style={styles.ctaAbs}>
                <ThemedButton
                  onPress={() => router.replace("/(test)/AnimationChoice")}
                  width={200}
                  height={60}
                  textStyle={styles.buttonText}
                >
                  Dernière étape
                </ThemedButton>
              </View>
            </>
          ) : flowStep === 1 ? (
            <>
              {/* Écran 2 : animation + detection (2 doigts) */}
              <View style={styles.debugFingersWrapper}>
                <Fingers onHandDetected={randomGuild} style={styles.debugFingers}/>
              </View>
            </>
          ) : (
            <>
              {/* Écran 1 : intro texte */}
              <View style={[styles.guildStepPressable, styles.debugPressable]}>
                <View style={[styles.content, styles.debugContent]}>
                  <ThemedText style={styles.title} font="merriweatherBold">
                    Prêt·e à découvrir ta guilde&nbsp;?
                  </ThemedText>
                  <Image
                    source={require("../../assets/ui/tutorial/bar-subtitle.webp")}
                    style={styles.subtitleBar}
                    resizeMode="contain"
                  />

                  <ThemedText style={styles.description} font="merriweather">
                    Ta guilde est ta petite famille gobeline&nbsp;: aide les
                    autres et elle gagnera en prestige.
                  </ThemedText>
                </View>
                <View style={styles.debugHintWrapper}>
                  <View style={styles.choiceRow}>
                    <GreenButton
                      title="Prêt !"
                      onPress={() => setFlowStep(1)}
                      width="100%"
                    />
                    <Pressable
                      onPress={() => {
                        // étape 2 du MenuBar = "pose"
                        setActiveMenu("pose");
                        const firstTabId = TabsInfo.pose?.[0]?.id ?? "pose";
                        setActiveTab(firstTabId);
                      }}
                      style={styles.textButton}
                    >
                      <ThemedText
                        style={styles.skipText}
                        font="merriweather"
                      >
                        Je n'ai pas fini de configurer
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  parcheminBg: {
    width: "100%",
    height: "100%",
    maxHeight: 500,
  },
  container: {
    flex: 1,
    padding: 24,
    // paddingTop: 50,
    paddingBottom: 62,
    justifyContent: "space-between",

  },

  content: {
    marginBottom: 32,
    paddingInline: 24,
    paddingTop: 50,
  },

  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 0.5,
    color: Colors.brownText,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    letterSpacing: 0.2,
    color: Colors.brownText,
  },
  actionContainer: {
    flex: 1,
  },
  actionContainerWithAbsCta: {
    position: "relative",
  },
  step2Content: {
    flex: 1,
    justifyContent: "flex-start",
    paddingInline: 24,
    paddingBottom: 120, // réserve la place du bouton en absolute
    paddingTop: 40,
  },
  ctaAbs: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },
  result: {
    fontSize: 20,
    lineHeight: 26,
    textAlign: "center",
    color: Colors.brownText,
    marginBottom: 12,
  },
  specialText: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
    textAlign: "center",
    letterSpacing: 0.2,
    color: Colors.brownText,
    marginBottom: 16,
  },
  specialText2: {
    fontSize: 20,
    lineHeight: 26,
    paddingHorizontal: 30,
    textAlign: "center",
    color: Colors.brownText,
    paddingBottom: 10,
    // marginTop: 10,
  },
  guildImage: {
    width: "60%",
    height: 120,
    alignSelf: "center",
    marginVertical: 10,
  },
  guildName: {
    fontSize: 20,
    textAlign: "center",
    color: Colors.brownText,
    marginTop: 16,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
  guildDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: Colors.brownText,
    marginTop: 12,
    letterSpacing: 0.2,
  },
  guildStepPressable: {
    flex: 1,
    justifyContent: "space-between",
  },
  choiceRow: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    // gap: 6,
    paddingInline: 24,
    paddingBottom: 24,
  },
  textButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    color: Colors.brownText,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  // DEBUG BORDERS (à enlever quand c'est OK)
  debugParchemin: {
    // borderWidth: 2,
    // borderColor: "red",
  },
  debugContainer: {},
  debugActionContainer: {
    // borderWidth: 2,
    // borderColor: "cyan",
  },
  debugPressable: {
    // borderWidth: 2,
    // borderColor: "orange",
  },
  debugContent: {
    // borderWidth: 2,
    // borderColor: "magenta",
  },
  debugHintWrapper: {
    // borderWidth: 2,
    // borderColor: "yellow",
  },
  debugDivider: {
    // borderWidth: 2,
    // borderColor: "#00a0ff",
  },
  debugFingersWrapper: {
    // borderWidth: 2,
    // borderColor: "#ff00aa",
  },
  hintText: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
    color: Colors.brownText,
  },
  divider: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    marginVertical: 5,
  },
  subtitleBar: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 16,
  },
  buttonText: {
    fontFamily: "Merriweather-Bold",
    fontSize: 16,
    textAlign: "center",
    color: Colors.brownText,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 3,
  },
  canvasContainer: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.3,
    marginBottom: 16,
  },
});

export default GuildChoice;
