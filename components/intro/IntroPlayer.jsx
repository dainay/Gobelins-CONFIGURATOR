import { Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function IntroPlayer({ onIntroFinished, shouldStart = true }) {
  const videoConfig = [
    {
      source: require('../../assets/video/intro/scene1.mp4'),
      isLooping: false, 
      requiresInteraction: false, 
    },
    {
      source: require('../../assets/video/intro/scene2.mp4'),
      isLooping: true, 
      requiresInteraction: true, 
    },
    {
      source: require('../../assets/video/intro/scene1.mp4'),
      isLooping: false, 
      requiresInteraction: false, 
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0); // 0 ou 1 pour alterner entre les deux vidéos
  const [clickedToFinish, setClickedToFinish] = useState(false);
  const videoRef0 = useRef(null);
  const videoRef1 = useRef(null);
  const fadeAnim0 = useSharedValue(1);
  const fadeAnim1 = useSharedValue(0);
  const currentConfig = videoConfig[currentIndex];

  const goToNextVideo = async () => {
    setClickedToFinish(false);
    const nextIdx = currentIndex + 1;
    
    if (nextIdx < videoConfig.length) {
      const nextConfig = videoConfig[nextIdx];
      const nextActiveVideo = activeVideo === 0 ? 1 : 0;
      const nextVideoRef = nextActiveVideo === 0 ? videoRef0 : videoRef1;
      const currentVideoRef = activeVideo === 0 ? videoRef0 : videoRef1;
      const nextFadeAnim = nextActiveVideo === 0 ? fadeAnim0 : fadeAnim1;
      const currentFadeAnim = activeVideo === 0 ? fadeAnim0 : fadeAnim1;
      
      try {
        // Précharger la vidéo suivante
        await nextVideoRef.current.loadAsync(
          nextConfig.source,
          { shouldPlay: false, isLooping: nextConfig.isLooping }
        );
        
        // Démarrer la vidéo suivante
        await nextVideoRef.current.playAsync();
        
        // Fonction à exécuter après l'animation
        const finishTransition = async () => {
          // Arrêter et décharger l'ancienne vidéo
          if (currentVideoRef.current) {
            await currentVideoRef.current.pauseAsync();
            await currentVideoRef.current.unloadAsync();
          }
          
          // Réinitialiser l'opacité de l'ancienne vidéo
          currentFadeAnim.value = 0;
          
          // Mettre à jour les index
          setCurrentIndex(nextIdx);
          setActiveVideo(nextActiveVideo);
        };
        
        // Crossfade : l'ancienne disparaît, la nouvelle apparaît
        currentFadeAnim.value = withTiming(0, { duration: 50 }, () => {
          runOnJS(finishTransition)();
        });
        nextFadeAnim.value = withTiming(1, { duration: 50 });
      } catch (error) {
        console.log('Error loading next video:', error);
        setCurrentIndex(nextIdx);
        setActiveVideo(nextActiveVideo);
      }
    } else {
      setTimeout(() => {
        onIntroFinished?.();
      }, 0);
    }
  };

  const handlePlaybackStatusUpdate = (status, videoIndex) => {
    // Ne traiter que les événements de la vidéo active
    if (videoIndex !== activeVideo) return;
    
    // Vidéo normale qui se termine automatiquement
    if (status.didJustFinish && !currentConfig.isLooping && !currentConfig.requiresInteraction) {
      goToNextVideo();
    }
    // Vidéo avec interaction qui a été cliquée et qui se termine maintenant
    if (status.didJustFinish && clickedToFinish) {
      goToNextVideo();
    }
  };

  const handlePress = async () => {
    if (currentConfig.requiresInteraction && currentConfig.isLooping) {
      // Désactiver le loop pour laisser la vidéo se terminer
        setClickedToFinish(true);

      const currentVideoRef = activeVideo === 0 ? videoRef0 : videoRef1;
      if (currentVideoRef.current) {
        currentVideoRef.current.setIsLoopingAsync(false).catch((error) => {
          console.log('Error disabling loop:', error);
        });
      }
    }
  };

  // Charger la première vidéo au montage (sans la jouer si shouldStart est false)
  useEffect(() => {
    const loadFirstVideo = async () => {
      if (videoRef0.current) {
        const config = videoConfig[0];
        try {
          await videoRef0.current.loadAsync(
            config.source,
            { shouldPlay: shouldStart, isLooping: config.isLooping }
          );
        } catch (error) {
          console.log('Error loading/playing video:', error);
        }
      }
    };
    // Petit délai pour s'assurer que le ref est disponible
    setTimeout(loadFirstVideo, 100);
  }, []);

  // Démarrer la vidéo quand shouldStart devient true
  useEffect(() => {
    if (shouldStart && videoRef0.current && currentIndex === 0 && activeVideo === 0) {
      videoRef0.current.playAsync().catch((error) => {
        console.log('Error playing video:', error);
      });
    }
  }, [shouldStart]);

  // Réinitialiser clickedToFinish quand on change de vidéo
  useEffect(() => {
    setClickedToFinish(false);
  }, [currentIndex]);

  const animatedStyle0 = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim0.value,
    };
  });

  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim1.value,
    };
  });

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Animated.View style={[styles.videoContainer, animatedStyle0]}>
        <Video
          ref={videoRef0}
          style={styles.video}
          resizeMode="cover"
          volume={1.0}
          onPlaybackStatusUpdate={(status) => handlePlaybackStatusUpdate(status, 0)}
        />
      </Animated.View>
      <Animated.View style={[styles.videoContainer, styles.videoOverlay, animatedStyle1]}>
        <Video
          ref={videoRef1}
          style={styles.video}
          resizeMode="cover"
          volume={1.0}
          onPlaybackStatusUpdate={(status) => handlePlaybackStatusUpdate(status, 1)}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoOverlay: {
    zIndex: 1,
  },
  video: {
    flex: 1,
  },
});