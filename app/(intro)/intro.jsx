// app/intro.jsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import IntroPlayer from '../../components/intro/IntroPlayer';
import { useIntroFlag } from '../../hooks/useIntroFlag';


export default function IntroRoute() {
  const { markIntroSeen } = useIntroFlag();
  const [started, setStarted] = useState(false);
  const fadeAnim = useSharedValue(1);





  const handleStart = () => {
    setStarted(true);
    fadeAnim.value = withTiming(0, { duration: 600 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  const handleIntroFinished = async () => {
    // await markIntroSeen();     // Décommenter pour activer le flag "intro vue"
    router.replace('/home');  
  };

  return (
    <>
      {/* IntroPlayer chargé en arrière-plan dès le début */}
      <IntroPlayer onIntroFinished={handleIntroFinished} shouldStart={started} />
      
      {/* Écran START par-dessus - reste visible pendant l'animation */}
      <Animated.View 
        style={[
          styles.container, 
          styles.startOverlay, 
          animatedStyle,
          started && styles.hidden
        ]}
        pointerEvents={started ? 'none' : 'auto'}
      >
        <Pressable style={styles.fullArea} onPress={handleStart}>
          <Text style={styles.startText}>START</Text>
        </Pressable>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  startOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  hidden: {
    // Le composant reste mais ne bloque plus après l'animation
  },
  fullArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {
    color: 'white',
    fontSize: 32,
    letterSpacing: 8,
  },
});
