import { router } from "expo-router";
import { GuildsInfo } from "../../constants/GuildsInfo";

import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import ThemedButton from "../../components/ui/ThemedButton";
import ThemedText from "../../components/ui/ThemedText";
import { Colors } from "../../constants/Colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

import Fingers from "../../components/Fingers";
import { useGobelinStore } from "../../src/store/gobelinStore";

// function CameraSetup() {
//   const { camera } = useThree();
//   camera.position.set(0, 0, 5.5);
//   camera.lookAt(0, 0, 0);
//   return null;
// }

function GuildChoice() {
  const guild = useGobelinStore((state) => state.guild);
  const setGuild = useGobelinStore((state) => state.setGuild);

  const randomGuild = () => {
    const guildData =
      GuildsInfo.guilds[Math.floor(Math.random() * GuildsInfo.guilds.length)];
    console.log("Selected guild data:", guildData);
    setGuild(guildData.id);
  };

  const selectedGuildData = guild
    ? GuildsInfo.guilds.find((g) => g.id === guild)
    : null;

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <ImageBackground
      source={require("../../assets/ui/guilds/scroll-long.png")}
      resizeMode="stretch"
      style={[{ height: SCREEN_HEIGHT - 200, marginBottom: 60 }]}
    >
      <View style={[styles.container]}>
        <View style={styles.actionContainer}>
          {guild ? (
            <>
              <ThemedText style={styles.result} title={false} font="sofia">
                Les anciens murmurent : {"\n"} tu as été reconnu·e par
                {/* la guilde {selectedGuildData?.name || guild}.  */}
              </ThemedText>
              {selectedGuildData?.image && (
                <Image
                  source={selectedGuildData.image}
                  style={styles.guildImage}
                  resizeMode="contain"
                />
              )}
              <ThemedText style={styles.specialText} font="merriweatherLight">
                Ta guilde est ton foyer gobelin. En aidant les autres et en
                relevant des défis, vous gagnez des points ensemble.
              </ThemedText>

             <ImageBackground
                     source={require("../../assets/ui/guilds/divider.png")}
                     resizeMode="stretch"
                     style={{
                       width: "100%",
                      height: 60,
                       justifyContent: "center",
                       marginVertical: 5,
                     }}
                   >
              <View
                style={{
        
                  width: "100%",
                }}
              />
               </ImageBackground>

              <ThemedText style={styles.specialText2} font="sofia">
                Dernière étape de ton initiation gobeline 
              </ThemedText>
              <ThemedText style={styles.specialText} font="merriweatherLight">
                Réveille ton énergie intérieure.
              </ThemedText>

              <ThemedButton
                onPress={() => router.replace("/(test)/AnimationChoice")}
                type="button2"
              >
                C'est parti !
              </ThemedButton>
            </>
          ) : (
            <>
              <View style={styles.content}>
                <ThemedText style={styles.title} font="sofia">
                  Prêt·e à découvrir ta guilde&nbsp;?
                </ThemedText>

                <ThemedText style={styles.description} font="merriweatherLight">
                  Ta guilde est ta petite famille gobeline : aide les autres et elle gagnera en prestige.
                </ThemedText>
              </View>

              {/* <View style={styles.canvasContainer}>
                <Canvas
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
                  }}
                >
                  <CameraSetup />
                  <ambientLight intensity={0.5} />
                  <pointLight position={[5, 5, 5]} />
                  <Book />
                </Canvas>
              </View> */}

              <Fingers onHandDetected={randomGuild} />
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT - 260,
    padding: 30,
    paddingTop: 100,
    borderRadius: 12,
    width: "90%",
    alignSelf: "center",
    marginBottom: 100,
  },
  content: {
    marginBottom: 24,
  },
  title: {
    fontSize: 38,
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    color: Colors.black,
  },
  actionContainer: {
    flex: 1,
  },
  result: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: "center",
    color: Colors.black,
    marginBottom: 12,
  },
  specialText: {
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 20,
    textAlign: "center",
    color: Colors.black,
    marginBottom: 16,
  },
    specialText2: {
    fontSize: 32,
    lineHeight: 38,
    paddingHorizontal: 30,
    textAlign: "center",
    color: Colors.black, 
    marginTop: 10
    },
  guildImage: {
    width: "90%",
    height: 180,
    alignSelf: "center",
    marginVertical: 20,
  },
  canvasContainer: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.3,
    marginBottom: 16,
    borderBlockColor: "#7f3333ff",
    borderWidth: 1,
  },
});

export default GuildChoice;
