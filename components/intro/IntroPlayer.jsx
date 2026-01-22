import { Audio, Video } from 'expo-av';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Vibration } from 'react-native';
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
      id: 1,
      source: require('../../assets/video/intro/intro-partie-1.mp4'),
      isLooping: false, 
      requiresInteraction: true, 
      clickImage: require('../../assets/intro/CTA/eveille-etincelle.png'), // Système d'image de clic désactivé temporairement
      clickText: 'Eveille l\'étincelle',
      lottieSource: require('../../assets/lottie/anim-etincelle.json'),
      isSkipable: true,
      requireUsername: false,
    },
    
    {
      id: 2,
      source: require('../../assets/video/intro/intro-partie-2.mp4'),
      isLooping: true, 
      requiresInteraction: false, 
      clickImage: undefined,
      isSkipable: true,
      requireUsername: false,
    },
    {
      id: 3,
      source: require('../../assets/video/intro/intro-partie-3.mp4'),
      isLooping: true, 
      requiresInteraction: true, 
      clickImage: require('../../assets/intro/CTA/eveille-etincelle.png'), // Système d'image de clic désactivé temporairement
      clickText: 'Mais aujourd\'hui ?',
      lottieSource: undefined, // Ajoutez votre fichier Lottie ici : require('../../assets/lottie/animation.json')
      isSkipable: true,
      requireUsername: false,
    },
    {
      id: 4,
      source: require('../../assets/video/intro/intro-partie-4.mp4'),
      isLooping: false, 
      requiresInteraction: false, 
      clickImage: null,
      isSkipable: false,
      requireUsername: true,
    },
    {
      id: 5,
      source: require('../../assets/video/intro/intro-partie-5.mp4'),
      isLooping: false, 
      requiresInteraction: true, 
      clickImage: require('../../assets/intro/CTA/eveille-etincelle.png'), // Système d'image de clic désactivé temporairement
      clickText: 'Prêt ?',
      lottieSource: undefined, // Ajoutez votre fichier Lottie ici : require('../../assets/lottie/animation.json')
      isSkipable: true,
      requireUsername: false,
    },
    {
      id: 6,
      source: require('../../assets/video/intro/intro-partie-6.mp4'),
      isLooping: false, 
      requiresInteraction: false, 
      clickImage: null,
      isSkipable: false,
      requireUsername: false,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0); // 0 ou 1 pour alterner entre les deux vidéos
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [username, setUsername] = useState('');
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const isLottiePlayingRef = useRef(false); // Pour éviter de relancer l'animation plusieurs fois
  const videoRef0 = useRef(null);
  const videoRef1 = useRef(null);
  const audioRef = useRef(null);
  const creativityAudioRef = useRef(null);
  const lottieRef = useRef(null);
  const fadeAnim0 = useSharedValue(1);
  const fadeAnim1 = useSharedValue(0);
  // const imageFadeAnim = useSharedValue(0); // Système d'image de clic désactivé temporairement
  const usernameIntroFadeAnim = useSharedValue(0);
  const usernameScaleIntroAnim = useSharedValue(0.75);
  const overlayFadeAnim = useSharedValue(0);
  const skipButtonFadeAnim = useSharedValue(0);
  const clickTextFadeAnim = useSharedValue(0);
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
    
    // Mettre à jour le statut d'erreur
    if (status.error) {
      setVideoError(status.error || 'Erreur lors de la lecture de la vidéo');
    } else if (status.isLoaded) {
      setVideoError(null);
    }
    
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
        // Afficher l'overlay noir avec un fade doux
        overlayFadeAnim.value = withTiming(0.5, { duration: 600 });
        // Système d'image de clic désactivé temporairement
        // // Afficher l'image de clic si disponible
        // if (currentConfig.clickImage) {
        //   imageFadeAnim.value = withTiming(1, { duration: 300 });
        // }
        // Afficher le texte de clic si disponible avec un fade doux
        if (currentConfig.clickText) {
          clickTextFadeAnim.value = withTiming(1, { duration: 600 });
        }
        // Marquer la vidéo comme terminée pour permettre le clic
        setIsVideoFinished(true);
        // L'animation Lottie sera lancée lors du press (onPressIn)
        return;
      }

      // Vidéo normale qui se termine automatiquement (sans interaction, avec ou sans isLooping)
      if (!currentConfig.requiresInteraction) {
        goToNextVideo();
      }


    }
  };

  const handlePressIn = () => {
    // Ne pas gérer si on est en train de saisir le username
    if (showUsernameInput) return;

    // Démarrer l'animation Lottie quand on commence à appuyer (une seule fois)
    if (currentConfig.requiresInteraction && isVideoFinished && currentConfig.lottieSource && lottieRef.current && !isLottiePlayingRef.current) {
      isLottiePlayingRef.current = true;
      lottieRef.current.play();
    }
  };

  const handlePress = async () => {
    // Ne pas gérer le clic si on est en train de saisir le username
    if (showUsernameInput) return;

    // Pour la scène 1, on utilise le maintien (handleLongPress) au lieu du clic
    if (currentConfig.id === 1) return;

    // Vidéo avec interaction : passer à la suivante uniquement si la vidéo est terminée
    if (currentConfig.requiresInteraction && isVideoFinished) {
      // Jouer l'audio pour l'avant-dernière vidéo (vidéo 5, id: 5)
      if (currentConfig.id === 5) {
        const playCreativityAudio = async () => {
          try {
            if (creativityAudioRef.current) {
              await creativityAudioRef.current.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync(
              require('../../assets/audio/intro/montre-nous-ta-creativite.mp3'),
              { shouldPlay: true, volume: 1.0 }
            );
            creativityAudioRef.current = sound;
          } catch (error) {
            console.log('Error playing creativity audio:', error);
          }
        };
        playCreativityAudio();
      }
      
      // Système d'image de clic désactivé temporairement
      // imageFadeAnim.value = withTiming(0, { duration: 300 });
      overlayFadeAnim.value = withTiming(0, { duration: 200 });
      clickTextFadeAnim.value = withTiming(0, { duration: 300 });
      // Arrêter et réinitialiser l'animation Lottie
      if (lottieRef.current) {
        lottieRef.current.pause();
        lottieRef.current.reset();
      }
      isLottiePlayingRef.current = false;
      goToNextVideo();
    }
  };

  const handleLongPress = async () => {
    // Ne pas gérer le maintien si on est en train de saisir le username
    if (showUsernameInput) return;

    // Maintien uniquement pour la scène 1
    if (currentConfig.id === 1 && currentConfig.requiresInteraction && isVideoFinished) {
      // Vibration quand on passe de la partie 1 à la partie 2
      Vibration.vibrate(200);
      
      // Système d'image de clic désactivé temporairement
      // imageFadeAnim.value = withTiming(0, { duration: 300 });
      overlayFadeAnim.value = withTiming(0, { duration: 200 });
      clickTextFadeAnim.value = withTiming(0, { duration: 300 });
      // Arrêter et réinitialiser l'animation Lottie
      if (lottieRef.current) {
        lottieRef.current.pause();
        lottieRef.current.reset();
      }
      isLottiePlayingRef.current = false;
      goToNextVideo();
    }
  };

  const handleSkipIntro = () => {
    overlayFadeAnim.value = withTiming(0, { duration: 200 });
    // Arrêter l'animation Lottie si elle est en cours
    if (lottieRef.current) {
      lottieRef.current.pause();
      lottieRef.current.reset();
    }
    isLottiePlayingRef.current = false;
    goToNextVideo();
  }

  const handleSubmitUsername = () => {
    if (username.trim().length > 0) {
      // Arrêter l'audio si il est en cours de lecture
      if (audioRef.current) {
        audioRef.current.stopAsync().catch((error) => {
          console.log('Error stopping audio:', error);
        });
        audioRef.current.unloadAsync().catch((error) => {
          console.log('Error unloading audio:', error);
        });
        audioRef.current = null;
      }
      
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
          console.log('Loading first video:', config.source);
          await videoRef0.current.loadAsync(
            config.source,
            { shouldPlay: false, isLooping: false }
          );
          console.log('First video loaded successfully');
          setVideoError(null);
          // Si shouldStart est déjà true, démarrer la vidéo immédiatement
          if (shouldStart) {
            console.log('shouldStart is true, playing video immediately');
            await videoRef0.current.playAsync();
          }
        } catch (error) {
          console.error('Error loading/playing video:', error);
          setVideoError(error.message || 'Erreur lors du chargement de la vidéo');
        }
      } else {
        console.log('videoRef0.current is null');
      }
    };
    // Petit délai pour s'assurer que le ref est disponible
    setTimeout(loadFirstVideo, 100);
  }, []);

  // Démarrer la vidéo quand shouldStart devient true
  useEffect(() => {
    const startVideo = async () => {
      if (shouldStart && videoRef0.current && currentIndex === 0 && activeVideo === 0) {
        console.log('shouldStart changed to true, attempting to play video');
        try {
          // Vérifier que la vidéo est chargée avant de la jouer
          const status = await videoRef0.current.getStatusAsync();
          console.log('Video status:', status);
          if (status.isLoaded) {
            console.log('Video is loaded, playing...');
            await videoRef0.current.playAsync();
            console.log('Video play command sent');
          } else {
            console.log('Video not loaded yet, waiting...');
            // Si la vidéo n'est pas encore chargée, attendre un peu et réessayer
            setTimeout(async () => {
              try {
                const retryStatus = await videoRef0.current.getStatusAsync();
                console.log('Retry video status:', retryStatus);
                if (retryStatus.isLoaded) {
                  await videoRef0.current.playAsync();
                  console.log('Video play command sent after delay');
                } else {
                  console.log('Video still not loaded after delay');
                }
              } catch (error) {
                console.error('Error playing video after delay:', error);
              }
            }, 200);
          }
        } catch (error) {
          console.error('Error playing video:', error);
        }
      } else {
        if (!shouldStart) console.log('shouldStart is false');
        if (!videoRef0.current) console.log('videoRef0.current is null');
        if (currentIndex !== 0) console.log('currentIndex is not 0:', currentIndex);
        if (activeVideo !== 0) console.log('activeVideo is not 0:', activeVideo);
      }
    };
    startVideo();
  }, [shouldStart, currentIndex, activeVideo]);

  // Masquer l'image de clic et réinitialiser l'état quand on change de vidéo
  useEffect(() => {
    // Système d'image de clic désactivé temporairement
    // imageFadeAnim.value = 0;
    overlayFadeAnim.value = 0;
    clickTextFadeAnim.value = 0;
    setIsVideoFinished(false);
    setVideoError(null);
    
    // Réinitialiser l'animation Lottie
    if (lottieRef.current) {
      lottieRef.current.reset();
      lottieRef.current.pause();
    }
    isLottiePlayingRef.current = false;
    
    // Arrêter et décharger l'audio quand on change de vidéo
    if (audioRef.current) {
      audioRef.current.stopAsync().catch((error) => {
        console.log('Error stopping audio:', error);
      });
      audioRef.current.unloadAsync().catch((error) => {
        console.log('Error unloading audio:', error);
      });
      audioRef.current = null;
    }
    
    // Arrêter et décharger l'audio de créativité quand on change de vidéo
    if (creativityAudioRef.current) {
      creativityAudioRef.current.stopAsync().catch((error) => {
        console.log('Error stopping creativity audio:', error);
      });
      creativityAudioRef.current.unloadAsync().catch((error) => {
        console.log('Error unloading creativity audio:', error);
      });
      creativityAudioRef.current = null;
    }
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

  // Système d'image de clic désactivé temporairement
  // const imageIntroStyle = useAnimatedStyle(() => {
  //   return {
  //     opacity: imageFadeAnim.value,
  //   }
  // })

  const usernameOverlayIntroStyle = useAnimatedStyle(() => {
    return {
      opacity: usernameIntroFadeAnim.value,
      transform: [{ scale: usernameScaleIntroAnim.value }],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayFadeAnim.value,
    };
  });

  const skipButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: skipButtonFadeAnim.value,
    };
  });

  const clickTextStyle = useAnimatedStyle(() => {
    return {
      opacity: clickTextFadeAnim.value,
    };
  });

  // Système d'image de clic désactivé temporairement
  // useEffect(() => {
  //   // L'image de clic sera gérée dans handlePlaybackStatusUpdate quand la vidéo se termine
  //   // On initialise à 0 ici
  //   imageFadeAnim.value = 0;
  // }, [currentIndex]);

  useEffect(() => {
    // Réinitialiser l'opacité à 0 au changement de vidéo
    skipButtonFadeAnim.value = 0;
    setShowSkipButton(false);

    if (!currentConfig.isSkipable) {
      return;
    }

    let hideTimeout;

    const showTimeout = setTimeout(() => {
      setShowSkipButton(true);
      // Animer l'opacité à 1 en 300ms
      skipButtonFadeAnim.value = withTiming(1, { duration: 300 });
      
      // Faire disparaître le bouton après 3 secondes d'affichage
      hideTimeout = setTimeout(() => {
        // Animer l'opacité à 0 en 300ms
        skipButtonFadeAnim.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(setShowSkipButton)(false);
        });
      }, 3000); // 3 secondes après l'apparition
    }, 1000);

    return () => {
      clearTimeout(showTimeout);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [currentIndex]);


  useEffect(() => {
    if (showUsernameInput) {
      usernameIntroFadeAnim.value = withTiming(1, { duration: 200 });
      usernameScaleIntroAnim.value = withTiming(1, { duration: 200 });
      
      // Jouer l'audio pour la vidéo 4 (index 3) quand l'input apparaît
      if (currentIndex === 3) {
        const playAudio = async () => {
          try {
            if (audioRef.current) {
              await audioRef.current.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync(
              require('../../assets/audio/intro/input-name.mp3'),
              { shouldPlay: true, volume: 1.0 }
            );
            audioRef.current = sound;
          } catch (error) {
            console.log('Error playing audio:', error);
          }
        };
        playAudio();
      }
    }
    // else {
    //   usernameIntroFadeAnim.value = 0;
    //   usernameScaleIntroAnim.value = 0;
    // }
  }, [showUsernameInput, currentIndex]);

  // Nettoyer l'audio quand le composant est démonté
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.stopAsync().catch((error) => {
          console.log('Error stopping audio on unmount:', error);
        });
        audioRef.current.unloadAsync().catch((error) => {
          console.log('Error unloading audio on unmount:', error);
        });
        audioRef.current = null;
      }
      if (creativityAudioRef.current) {
        creativityAudioRef.current.stopAsync().catch((error) => {
          console.log('Error stopping creativity audio on unmount:', error);
        });
        creativityAudioRef.current.unloadAsync().catch((error) => {
          console.log('Error unloading creativity audio on unmount:', error);
        });
        creativityAudioRef.current = null;
      }
    };
  }, []);

  return (
    <Pressable 
      style={styles.container} 
      onPress={handlePress}
      onPressIn={handlePressIn}
      onLongPress={handleLongPress}
      delayLongPress={2500}
    >
      <Animated.View style={[styles.videoContainer, animatedStyle0]}>
        <Video
          ref={videoRef0}
          style={styles.video}
          resizeMode="cover"
          volume={1.0}
          onPlaybackStatusUpdate={(status) => handlePlaybackStatusUpdate(status, 0)}
          onError={(error) => {
            console.error('Video 0 error:', error);
            setVideoError('Erreur lors de la lecture de la vidéo');
          }}
        />
      </Animated.View>
      <Animated.View style={[styles.videoContainer, styles.videoOverlay, animatedStyle1]}>
        <Video
          ref={videoRef1}
          style={styles.video}
          resizeMode="cover"
          volume={1.0}
          onPlaybackStatusUpdate={(status) => handlePlaybackStatusUpdate(status, 1)}
          onError={(error) => {
            console.error('Video 1 error:', error);
            setVideoError('Erreur lors de la lecture de la vidéo');
          }}
        />
      </Animated.View>
      {currentConfig.requiresInteraction && (
        <Animated.View style={[styles.interactionOverlay, overlayStyle]} />
      )}
      {currentConfig.requiresInteraction && currentConfig.clickText && (
        <Animated.View style={[styles.clickTextContainer, clickTextStyle]}>
          <ThemedText style={styles.clickText}>{currentConfig.clickText}</ThemedText>
        </Animated.View>
      )}
      {currentConfig.requiresInteraction && currentConfig.lottieSource && isVideoFinished && (
        <Animated.View style={[styles.lottieContainer, clickTextStyle]} pointerEvents="none">
          <LottieView
            ref={lottieRef}
            source={currentConfig.lottieSource}
            autoPlay={false}
            loop={true}
            style={styles.lottieAnimation}
            onAnimationFinish={() => {
              // Réinitialiser le flag quand l'animation se termine (si loop est false)
              // Mais avec loop=true, cette fonction ne sera jamais appelée
              // On la garde au cas où on change loop à false plus tard
              isLottiePlayingRef.current = false;
            }}
          />
        </Animated.View>
      )}
      {/* Système d'image de clic désactivé temporairement */}
      {/* {currentConfig.requiresInteraction && currentConfig.clickImage && (
        <Animated.Image 
        source={currentConfig.clickImage} 
        style={[styles.clickImageIntro, imageIntroStyle]}
        resizeMode="contain"
        />
      )} */}
      {showSkipButton && (
        <Animated.View style={[styles.skipButtonContainer, skipButtonStyle]}>
          <Pressable onPress={handleSkipIntro} style={styles.skipButtonPressable}>
            <Image 
              source={require('../../assets/ui/buttons/skip-button.png')}
              style={styles.skipButtonImage}
              resizeMode="contain"
            />
          </Pressable>
        </Animated.View>
      )}
      {showUsernameInput && currentConfig.requireUsername && (
        <Animated.View style={[styles.usernameIntroOverlay, usernameOverlayIntroStyle]}>
          <ThemedView style={styles.usernameIntroContainer}>
            <ThemedText style={styles.usernameIntroQuestion}>Quel est son nom ?</ThemedText>
            <ThemedTextInput 
              style={styles.usernameIntroInput} 
              value={username} 
              onChangeText={setUsername} 
              placeholder="On jugera pas…" 
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
      {videoError && (
        <Animated.View style={[styles.errorContainer]}>
          <ThemedText style={styles.errorText}>{videoError}</ThemedText>
          <ThemedText style={styles.errorSubtext}>Vérifiez que les fichiers vidéo existent dans assets/video/intro/</ThemedText>
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
  //OVERLAY INTERACTION
  interactionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 50,
  },
  //TEXT CLICK INTRO
  clickTextContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    zIndex: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  lottieContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  lottieAnimation: {
    width: '100%',
    aspectRatio: 1,
  },
  clickText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    // textShadowOffset: { width: 0, height: 2 },
    // textShadowRadius: 4,
    fontFamily: 'Merriweather-Bold',
  },
  //IMAGE CTA INTRO - Système d'image de clic désactivé temporairement
  // clickImageIntro: {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
  //   zIndex: 100,
  //   width: '50%',
  // },
  //BUTTON SKIP INTRO
  skipButtonContainer: {
    position: 'absolute',
    top: '2%',
    right: '5%',
    zIndex: 100,
  },
  skipButtonPressable: {
    padding: 10,
  },
  skipButtonImage: {
    width: 80,
    height: 80,
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
    justifyContent: 'center',
    alignSelf: 'center',
 
  },
  usernameIntroQuestion: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: 'Merriweather-Bold',
  },
  usernameIntroInput: {
    width: '100%', 
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16, 
    fontFamily: 'Merriweather',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  usernameIntroButton: {
    // width: 300,
    // height: 100, 
    marginTop: 30,
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
  //ERROR
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Merriweather-Bold',
  },
  errorSubtext: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Merriweather',
  },
});