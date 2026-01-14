import { router } from 'expo-router';
import { GuildsInfo } from '../../constants/GuildsInfo';

import { Canvas, useThree } from '@react-three/fiber/native';
import { Dimensions, Image, StyleSheet, useColorScheme, View } from 'react-native';
import ThemedButton from '../../components/ui/ThemedButton';
import ThemedText from '../../components/ui/ThemedText';
import { Colors } from '../../constants/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

import Book from '../(three)/Book';
import Fingers from '../../components/Fingers';
import { useGobelinStore } from '../../src/store/gobelinStore';

function CameraSetup() {
  const { camera } = useThree();
  camera.position.set(0, 0, 5.5);
  camera.lookAt(0, 0, 0);
  return null;
} 

function GuildChoice() {

const guild = useGobelinStore((state) => state.guild);
const setGuild = useGobelinStore((state) => state.setGuild);

const randomGuild = () => {
  const guildData = GuildsInfo.guilds[Math.floor(Math.random() * GuildsInfo.guilds.length)];
  console.log("Selected guild data:", guildData);
  setGuild(guildData.id);
}

const selectedGuildData = guild ? GuildsInfo.guilds.find(g => g.id === guild) : null;

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.uiBackground }]}> 
      
        <View style={styles.actionContainer}>
            {guild ? ( 
              <>
              <ThemedText style={styles.result} title={false} font="merriweather">Ta guilde : {selectedGuildData?.name || guild} — bravo !</ThemedText>
              {selectedGuildData?.image && (
                <Image source={selectedGuildData.image} style={styles.guildImage} resizeMode="contain" />
              )}
              <ThemedText style={styles.specialText} font="merriweatherLight">Cette guilde te protège et grandit avec tes bonnes actions.</ThemedText>

              <ThemedButton onPress={() => router.replace("/(test)/AnimationChoice")}> 
                Time to know your inner Energy
              </ThemedButton>
              </>
            ) : (
              <>
                <View style={styles.content}>
          <ThemedText style={styles.title} font="sofia">Prêt·e à découvrir ta guilde&nbsp;?</ThemedText>

          <ThemedText style={styles.description} font="merriweatherLight">Ta guilde est ta petite famille gobeline : aide les autres et elle gagnera en prestige.</ThemedText>
        </View>
              <View style={styles.canvasContainer}>
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
              </View>

              <Fingers onHandDetected={randomGuild} 
              />
              </>
            )}
        </View>
     
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT - 260,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 70,
  },
  content: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#666',
  },
  actionContainer: {
    flex: 1, 
  },
  result: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 12,
  },
  specialText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  guildImage: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 20,
  },
  canvasContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.3,
    marginBottom: 16,
    borderBlockColor: '#7f3333ff',
    borderWidth: 1,
  },
});

export default GuildChoice