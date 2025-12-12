import { GuildsInfo } from '../../constants/GuildsInfo';
import { router } from 'expo-router';

import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import ThemedButton from '../../components/ui/ThemedButton';
import ThemedText from '../../components/ui/ThemedText';
import { Canvas, useThree } from '@react-three/fiber/native';
import { OrbitControls } from '@react-three/drei/native';

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

  return (
    <View style={styles.container}>
      
        <View style={styles.actionContainer}>
            {guild ? ( 
              <>
              <Text style={styles.result}>Your guild is: {selectedGuildData?.name || guild} Congratulations! </Text>
              {selectedGuildData?.image && (
                <Image source={selectedGuildData.image} style={styles.guildImage} resizeMode="contain" />
              )}
              <Text style={styles.specialText}>
                This guild is very special because you are in.
              </Text>

              <ThemedButton onPress={() => router.replace("/(test)/AnimationChoice")}> 
                Time to know your inner Energy
              </ThemedButton>
              </>
            ) : (
              <>
               <View style={styles.content}>
          <Text style={styles.title}>Are you ready to discover your guild?</Text>

          <Text style={styles.description}>Your guild is like your little gobelin family: the more you help others, the more points your guild wins</Text>
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