import { Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import ThemedButton from '../../components/ui/ThemedButton';
import ThemedText from '../../components/ui/ThemedText';
import ThemedTextInput from '../../components/ui/ThemedTextInput';
import ThemedView from '../../components/ui/ThemedView';
import { Colors } from '../../constants/Colors';
import { useGobelinStore } from '../../src/store/gobelinStore';

export default function IntroPlayer({ onIntroFinished, shouldStart = true }) {
  const setName = useGobelinStore((state) => state.setName);
  const videoConfig = [
    {
      source: require('../../assets/video/intro/intro-partie-1.mp4'),
      isLooping: false, 
      requiresInteraction: true, 
      clickImage: require('../../assets/intro/CTA/click.png'),
      isSkipable: true,
      requireUsername: false,
    },
    
    {
      source: require('../../assets/video/intro/intro-partie-2.mp4'),
      isLooping: true, 
      requiresInteraction: false, 
      clickImage: undefined,
      isSkipable: true,
      requireUsername: false,
    },
    {
      source: require('../../assets/video/intro/intro-partie-3.mp4'),
      isLooping: true, 
      requiresInteraction: true, 
      clickImage: require('../../assets/intro/CTA/click.png'),
      isSkipable: true,
      requireUsername: false,
    },
    // {
    //   source: require('../../assets/video/intro/scene1.mp4'),
    //   isLooping: false, 
    //   requiresInteraction: false, 
    //   clickImage: null,
    //   isSkipable: true,
    //   requireUsername: false,
    // },
    {
      source: require('../../assets/video/intro/scene4.mp4'),
      isLooping: false, 
      requiresInteraction: false, 
      clickImage: null,
      isSkipable: false,
      requireUsername: true,
    },
    {
      source: require('../../assets/video/intro/intro-partie-6.mp4'),
      isLooping: false, 
      requiresInteraction: false, 
      clickImage: null,
      isSkipable: true,
      requireUsername: false,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0); // 0 ou 1 pour alterner entre les deux vidéos
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [username, setUsername] = useState('');
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const videoRef0 = useRef(null);
  const videoRef1 = useRef(null);
  const fadeAnim0 = useSharedValue(1);
  const fadeAnim1 = useSharedValue(0);
  const imageFadeAnim = useSharedValue(0);
  const usernameIntroFadeAnim = useSharedValue(0);
  const usernameScaleIntroAnim = useSharedValue(0.75);
  const currentConfig = videoConfig[currentIndex];

  const goToNextVideo = async () => {
    const nextIdx = currentIndex + 1;
    
    if (nextIdx < videoConfig.length) {
      const nextConfig = videoConfig[nextIdx];
      const nextActiveVideo = activeVideo === 0 ? 1 : 0;
      const nextVideoRef = nextActiveVideo === 0 ? videoRef0 : videoRef1;
      const currentVideoRef = activeVideo === 0 ? videoRef0 : videoRef1;
      const nextFadeAnim = nextActiveVideo === 0 ? fadeAnim0 : fadeAnim1;
      const currentFadeAnim = activeVideo === 0 ? fadeAnim0 : fadeAnim1;
      
      try {
        // Précharger la vidéo suivante (toujours sans loop, même si isLooping est true)
        await nextVideoRef.current.loadAsync(
          nextConfig.source,
          { shouldPlay: false, isLooping: false }
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
          setIsVideoFinished(false);
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
        setIsVideoFinished(false);
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
    

    
    if (status.didJustFinish) {

      // Vidéo qui nécessite un username
      if (currentConfig.requireUsername) {
        const currentVideoRef = activeVideo === 0 ? videoRef0 : videoRef1;
        if (currentVideoRef.current) {
          currentVideoRef.current.pauseAsync();
        }
        setShowUsernameInput(true);
        return;
      }

      // Vidéo avec interaction : mettre en pause et afficher l'image de clic
      if (currentConfig.requiresInteraction) {
        const currentVideoRef = activeVideo === 0 ? videoRef0 : videoRef1;
        if (currentVideoRef.current) {
          currentVideoRef.current.pauseAsync();
        }
        // Marquer la vidéo comme terminée pour permettre le clic
        setIsVideoFinished(true);
        // Afficher l'image de clic si disponible
        if (currentConfig.clickImage) {
          imageFadeAnim.value = withTiming(1, { duration: 300 });
        }
        return;
      }

      // Vidéo normale qui se termine automatiquement (sans interaction, avec ou sans isLooping)
      if (!currentConfig.requiresInteraction) {
        goToNextVideo();
      }


    }
  };

  const handlePress = async () => {
    // Ne pas gérer le clic si on est en train de saisir le username
    if (showUsernameInput) return;

    // Vidéo avec interaction : passer à la suivante uniquement si la vidéo est terminée
    if (currentConfig.requiresInteraction && isVideoFinished) {
      imageFadeAnim.value = withTiming(0, { duration: 300 });
      goToNextVideo();
    }
  };

  const handleSkipIntro = () => {
    goToNextVideo();
  }

  const handleSubmitUsername = () => {
    if (username.trim().length > 0) {
      // Save to Zustand store
      setName(username.trim());
      
      usernameIntroFadeAnim.value = withTiming(0, { duration: 200 });
      usernameScaleIntroAnim.value = withTiming(0.75, { duration: 200 });
      
      // Attendre la fin de l'animation (200ms) + délai (500ms) = 700ms
      setTimeout(() => {
        setShowUsernameInput(false);
        setTimeout(() => {
          goToNextVideo();
        }, 500);
      }, 200);
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
            { shouldPlay: shouldStart, isLooping: false }
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

  // Masquer l'image de clic et réinitialiser l'état quand on change de vidéo
  useEffect(() => {
    imageFadeAnim.value = 0;
    setIsVideoFinished(false);
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

  const imageIntroStyle = useAnimatedStyle(() => {
    return {
      opacity: imageFadeAnim.value,
    }
  })

  const usernameOverlayIntroStyle = useAnimatedStyle(() => {
    return {
      opacity: usernameIntroFadeAnim.value,
      transform: [{ scale: usernameScaleIntroAnim.value }],
    };
  });

  useEffect(() => {
    // L'image de clic sera gérée dans handlePlaybackStatusUpdate quand la vidéo se termine
    // On initialise à 0 ici
    imageFadeAnim.value = 0;
  }, [currentIndex]);

  useEffect(() => {
    setShowSkipButton(false);

    const timeout = setTimeout(() => {
      if (currentConfig.isSkipable) {
        setShowSkipButton(true);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [currentIndex]);


  useEffect(() => {
    if (showUsernameInput) {
      usernameIntroFadeAnim.value = withTiming(1, { duration: 200 });
      usernameScaleIntroAnim.value = withTiming(1, { duration: 200 });
    }
    // else {
    //   usernameIntroFadeAnim.value = 0;
    //   usernameScaleIntroAnim.value = 0;
    // }
  }, [showUsernameInput]);

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Animated.View style={[styles.videoContainer, animatedStyle0]}>
        <Video
          ref={videoRef0}
          style={styles.video}
          resizeMode="contain"
          volume={1.0}
          onPlaybackStatusUpdate={(status) => handlePlaybackStatusUpdate(status, 0)}
        />
      </Animated.View>
      <Animated.View style={[styles.videoContainer, styles.videoOverlay, animatedStyle1]}>
        <Video
          ref={videoRef1}
          style={styles.video}
          resizeMode="contain"
          volume={1.0}
          onPlaybackStatusUpdate={(status) => handlePlaybackStatusUpdate(status, 1)}
        />
      </Animated.View>
      {currentConfig.requiresInteraction && currentConfig.clickImage && (
        <Animated.Image 
        source={currentConfig.clickImage} 
        style={[styles.clickImageIntro, imageIntroStyle]}
        resizeMode="contain"
        />
      )}
      {showSkipButton && (
        <ThemedButton style={styles.skipButton} onPress={handleSkipIntro}>
          Skip
        </ThemedButton>
      )}
      {showUsernameInput && currentConfig.requireUsername && (
        <Animated.View style={[styles.usernameIntroOverlay, usernameOverlayIntroStyle]}>
          <ThemedView style={styles.usernameIntroContainer}>
            <ThemedText style={styles.usernameIntroQuestion}>Enter your username</ThemedText>
            <ThemedTextInput 
              style={styles.usernameIntroInput} 
              value={username} 
              onChangeText={setUsername} 
              placeholder="Quel est son nom ?" 
              autoFocus={true}
            />
            <ThemedButton 
              style={styles.usernameIntroButton} 
              onPress={handleSubmitUsername}
            >
              Valider
            </ThemedButton>
          </ThemedView>
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  //VIDEO INTRO
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
  //IMAGE CTA INTRO
  clickImageIntro: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    zIndex: 100,
    width: '75%',

  },
  //BUTTON SKIP INTRO
  skipButton: {
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    zIndex: 100,
  },
  //INPUT PRENOM INTRO
  usernameIntroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  usernameIntroContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  usernameIntroQuestion: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  usernameIntroInput: {
    width: '100%',
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  usernameIntroButton: {
    width: '100%',
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});