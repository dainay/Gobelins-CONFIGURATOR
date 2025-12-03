import { Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useGobelinStore } from '../../src/store/gobelinStore';
import ThemedText from '../../components/ui/ThemedText';
import ThemedTextInput from '../../components/ui/ThemedTextInput';
import ThemedButton from '../../components/ui/ThemedButton';
import ThemedView from '../../components/ui/ThemedView';

export default function IntroPlayer({ onIntroFinished, shouldStart = true }) {
  const setName = useGobelinStore((state) => state.setName);
  const videoConfig = [
    // {
    //   source: require('../../assets/video/intro/scene1.mp4'),
    //   isLooping: false, 
    //   requiresInteraction: false, 
    //   clickImage: null,
    //   isSkipable: true,
    //   requireUsername: false,
    // },
    {
      source: require('../../assets/video/intro/scene2.mp4'),
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
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0); // 0 ou 1 pour alterner entre les deux vidéos
  const [clickedToFinish, setClickedToFinish] = useState(false);
  const [hasCompletedFirstLoop, setHasCompletedFirstLoop] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [username, setUsername] = useState('');
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const videoRef0 = useRef(null);
  const videoRef1 = useRef(null);
  const fadeAnim0 = useSharedValue(1);
  const fadeAnim1 = useSharedValue(0);
  const imageFadeAnim = useSharedValue(0);
  const usernameIntroFadeAnim = useSharedValue(0);
  const usernameScaleIntroAnim = useSharedValue(0.75);
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
          setHasCompletedFirstLoop(false);
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
        setHasCompletedFirstLoop(false);
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

      // Vidéo avec interaction qui a été cliquée et qui se termine maintenant et qui n'est pas un loop
      if (clickedToFinish) {
        goToNextVideo();
      }
      

      else if (currentConfig.isLooping && hasCompletedFirstLoop === false) {
        setHasCompletedFirstLoop(true);
      }

      else if (currentConfig.requireUsername) {

        const currentVideoRef = activeVideo === 0 ? videoRef0 : videoRef1;
        if (currentVideoRef.current) {
          currentVideoRef.current.pauseAsync();
        }
        setShowUsernameInput(true);
      }

          // Vidéo normale qui se termine automatiquement
      else if (status.didJustFinish && !currentConfig.isLooping && !currentConfig.requiresInteraction) {
        goToNextVideo();
      }


    }
  };

  const handlePress = async () => {
    if (currentConfig.requiresInteraction && currentConfig.isLooping) {
      // Désactiver le loop pour laisser la vidéo se terminer
        setClickedToFinish(true);
        imageFadeAnim.value = withTiming(0, { duration: 300 });

      const currentVideoRef = activeVideo === 0 ? videoRef0 : videoRef1;
      if (currentVideoRef.current) {
        currentVideoRef.current.setIsLoopingAsync(false).catch((error) => {
          console.log('Error disabling loop:', error);
        });
      }
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
    if (hasCompletedFirstLoop && currentConfig.clickImage) {
      //  fade in 0 -> 1
      imageFadeAnim.value = withTiming(1, { duration: 300 });
    }
    else {
      // sinon masquer l'image
      imageFadeAnim.value = 0;
    }
  }, [hasCompletedFirstLoop, currentIndex]);

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
      {hasCompletedFirstLoop && currentConfig.clickImage && (
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
    bottom: '10%',
    left: '5%',
    // transform: [{ translateX: '-50%' }],
    zIndex: 100,
    width: '90%',
    height: '50%',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  usernameIntroContainer: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  usernameIntroQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  usernameIntroInput: {
    width: '100%',
    marginBottom: 15,
  },
  usernameIntroButton: {
    width: '100%',
  },
});