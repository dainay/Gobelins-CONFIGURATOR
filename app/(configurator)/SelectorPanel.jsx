import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { AvatarOptions } from "../../constants/AvatarOptions";
import { useConfigurateurStore } from "../../src/store/configurateurStore";
import { useGobelinStore } from "../../src/store/gobelinStore";
import { useMenuStore } from "../../src/store/menuStore";

export default function OptionsPanel() {
  const setConfig = useGobelinStore((state) => state.setConfig);
  const configuration = useGobelinStore((state) => state.configuration);
  const activeTab = useConfigurateurStore((state) => state.activeTab);
  const tutorialCompleted = useConfigurateurStore((state) => state.tutorialCompleted);
  const activeMenu = useMenuStore((state) => state.activeMenu);
  const items = AvatarOptions[activeTab] || [];
  const scrollViewRef = useRef(null);
  const itemLayouts = useRef({});
  const { width: screenWidth } = useWindowDimensions();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const porteGaucheAnim = useRef(new Animated.Value(0)).current;
  const porteDroiteAnim = useRef(new Animated.Value(0)).current;
  const isMenuBarChangeRef = useRef(false);
  const hasDelayedDrawerAfterTutorialRef = useRef(false);
  
  // Calcul du top pour la corde : (containerHeight - itemHeight - paddingVertical*2) / 2
  // Container: 250px, Item: 120px, Padding: 8px*2 = 16px
  // top = (250 - 120 - 16) / 2 = 57px
  const cordeTop = (250 - 120 - 16) / 2;

  // --- Tiroirs: calcul du cadrage "cover" + ancrage gauche/droite ---
  const drawerTop = 50;
  const drawerHeight = 150;
  const drawerWidth = screenWidth * 0.51; // correspond au width: "51%" des styles

  const tiroirGaucheAsset = Image.resolveAssetSource(
    require("../../assets/ui/tabs-bar/tiroir-gauche.png")
  );
  const tiroirDroiteAsset = Image.resolveAssetSource(
    require("../../assets/ui/tabs-bar/tiroir-droite.png")
  );

  const { tiroirGaucheStyle, tiroirDroiteStyle } = useMemo(() => {
    const makeCoverStyle = (asset, align) => {
      const imgW = asset?.width ?? 1;
      const imgH = asset?.height ?? 1;

      // scale "cover"
      const scale = Math.max(drawerWidth / imgW, drawerHeight / imgH);
      const scaledW = imgW * scale;
      const scaledH = imgH * scale;

      // on centre verticalement, et on ancre horizontalement
      const topOffset = (drawerHeight - scaledH) / 2;

      return {
        position: "absolute",
        top: topOffset,
        width: scaledW,
        height: scaledH,
        ...(align === "right" ? { right: 0 } : { left: 0 }),
      };
    };

    return {
      tiroirGaucheStyle: makeCoverStyle(tiroirGaucheAsset, "right"),
      tiroirDroiteStyle: makeCoverStyle(tiroirDroiteAsset, "left"),
    };
  }, [drawerWidth, drawerHeight, tiroirGaucheAsset, tiroirDroiteAsset]);

  // Détecter le changement de MenuBar
  useEffect(() => {
    isMenuBarChangeRef.current = true;
  }, [activeMenu])

//vide l'objet itemLayouts quand on change d'onglets
  useEffect(() => {
    itemLayouts.current = {}
  }, [activeTab])

  // Animation de fermeture puis ouverture des portes au changement de MenuBar uniquement
  useEffect(() => {
    // Calcul : déplacer les portes de presque toute leur largeur (48%) pour laisser 2% visible
    const porteWidth = screenWidth * 0.5; // 50% de l'écran
    const translateDistance = porteWidth * 0.96; // 96% de la largeur de la porte (48% de l'écran)
    
    const closeDrawer = () => {
      Animated.parallel([
        Animated.timing(porteGaucheAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(porteDroiteAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    };

    const runDrawerAnimation = () => {
      Animated.parallel([
        Animated.sequence([
          // Fermeture : revenir à la position initiale
          Animated.timing(porteGaucheAnim, {
            toValue: 0,
            duration: 100,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          // Ouverture : déplacer vers la gauche
          Animated.timing(porteGaucheAnim, {
            toValue: -translateDistance,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          // Fermeture : revenir à la position initiale
          Animated.timing(porteDroiteAnim, {
            toValue: 0,
            duration: 100,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          // Ouverture : déplacer vers la droite
          Animated.timing(porteDroiteAnim, {
            toValue: translateDistance,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    // Quand on est sur le 3e menu (guild), on force les portes à rester fermées
    if (activeMenu === "guild") {
      closeDrawer();
      return;
    }

    // Cas demandé : à la toute première apparition après le tuto, attendre 1s avant l'ouverture du tiroir.
    if (tutorialCompleted && !hasDelayedDrawerAfterTutorialRef.current) {
      hasDelayedDrawerAfterTutorialRef.current = true;
      const timeout = setTimeout(() => {
        runDrawerAnimation();
      }, 500);
      return () => clearTimeout(timeout);
    }

    runDrawerAnimation();
  }, [activeMenu, screenWidth, tutorialCompleted])

  // Animation de changement d'onglet : monte puis redescend avec rotation
  // Délai de 100ms uniquement si le changement vient du MenuBar
  useEffect(() => {
    const delay = isMenuBarChangeRef.current ? 100 : 0;
    isMenuBarChangeRef.current = false; // Réinitialiser le flag après utilisation
    
    Animated.parallel([
      Animated.sequence([
        ...(delay > 0 ? [Animated.delay(delay)] : []), // Délai uniquement si changement de MenuBar
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 100,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        ...(delay > 0 ? [Animated.delay(delay)] : []), // Délai uniquement si changement de MenuBar
        Animated.timing(rotateAnim, {
          toValue: 5,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 100,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [activeTab])

//centrer l'item actif quand il change
  useEffect(() => {
//recuperer les donnnes de litem actif
    const activeItemLabel = configuration[activeTab]

    //on verifie que activeitemlabel existe, que le scrollview existe et que le layout de litem est bien mesurer ( > 1 )
    if (activeItemLabel && scrollViewRef.current && Object.keys(itemLayouts.current).length > 0) {
      //on recupere la positon de litem actif
      const activeItemLayout = itemLayouts.current[activeItemLabel];

      // -> si jamais on trouve la position
      if (activeItemLayout) {
        //position de litem - moitie de lecran + moitie de la width de litem
        const scrollToX = activeItemLayout.x - (screenWidth / 2 ) + (activeItemLayout.width / 2)


        //on scroll vers la positon scrollToX
        scrollViewRef.current.scrollTo({
          x: Math.max(0, scrollToX), //pas de valeur negtive
          animated: true, //fluide
        });
        }
      }
    
  }, [activeTab, configuration[activeTab], screenWidth])


  console.log("Active Tab:", activeTab);

  const handlePress = (item) => {
    
    setConfig({ [activeTab]: item.label });
  };

  return (
    <ImageBackground
      source={require("../../assets/ui/tabs-bar/fond-tabs.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <Image
        source={require("../../assets/ui/tabs-bar/haut-armoir.png")}
        style={styles.hautArmoir}
        resizeMode="stretch"
        pointerEvents="none"
      />
      <Image
        source={require("../../assets/ui/tabs-bar/bas-armoir.png")}
        style={styles.basArmoir}
        resizeMode="stretch"
        pointerEvents="none"
      />
      <Animated.Image
        source={require("../../assets/ui/tabs-bar/corde.png")}
        style={[
          styles.corde,
          { top: cordeTop },
          {
            transform: [
              { translateY: slideAnim },
              { rotate: rotateAnim.interpolate({
                  inputRange: [0, 5],
                  outputRange: ['0deg', '5deg'],
                })},
            ],
          },
        ]}
        resizeMode="contain"
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.porteGauche,
          {
            transform: [{ translateX: porteGaucheAnim }],
          },
        ]}
        pointerEvents="none"
      >
        <Image
          source={require("../../assets/ui/tabs-bar/tiroir-gauche.png")}
          style={tiroirGaucheStyle}
          resizeMode="cover"
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.porteDroite,
          {
            transform: [{ translateX: porteDroiteAnim }],
          },
        ]}
        pointerEvents="none"
      >
        <Image
          source={require("../../assets/ui/tabs-bar/tiroir-droite.png")}
          style={tiroirDroiteStyle}
          resizeMode="cover"
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.scrollViewWrapper,
          {
            transform: [
              { translateY: slideAnim },
              { rotate: rotateAnim.interpolate({
                  inputRange: [0, 5],
                  outputRange: ['0deg', '5deg'],
                })},
            ],
          },
        ]}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.itemContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => {
          const isActive = configuration[activeTab] === item.label;
          return (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.item, isActive && styles.itemActive]}
              onPress={() => handlePress(item)}
              activeOpacity={1}
              //onlayout est appeler au rendu initial de l'item et a chaques fois qu'il change de taille ( donc qd il devient active )
              onLayout={(event) => {
                //event.nativeEvent.layout contient les dimensions de l'item (x, y, width, height)
                const { x, width } = event.nativeEvent.layout
                //permet de retrouver la postion d'un item grace a son label
                itemLayouts.current[item.label] = { x, width}
                console.log("itemLayouts", itemLayouts.current)
              }}
            >
              <ImageBackground
                source={isActive 
                  ? require("../../assets/ui/tabs-bar/btn-tabs-active.png")
                  : require("../../assets/ui/tabs-bar/btn-tabs-inactive.png")
                }
                style={styles.itemBackground}
                resizeMode="contain"
              >
                <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
              </ImageBackground>
            </TouchableOpacity>
          );
        })}
        </ScrollView>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: 250,
    zIndex: 5,
    // paddingTop: 32,
    // paddingBottom: 32,
    overflow: "hidden",
  },
  hautArmoir: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 50,
    zIndex: 10,
    opacity: 1,
  },
  basArmoir: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 50,
    zIndex: 10,
    opacity: 1,
  },
  porteGauche: {
    position: "absolute",
    left: 0,
    top: 50,
    width: "51%",
    height: 150,
    zIndex: 3,
    overflow: "hidden",
  },
  porteDroite: {
    position: "absolute",
    right: 0,
    top: 50,
    width: "51%",
    height: 150,
    zIndex: 3,
    overflow: "hidden",
  },
  scrollViewWrapper: {
    alignSelf: "center",
    zIndex: 2,
  },
  scrollView: {
    zIndex: 2,
  },
  itemContainer: {
    position: "relative",
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    alignSelf: "center",
  },
  corde: {
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1,
  },
  item: {
    height: 120,
    aspectRatio: 1,
    // borderWidth: 2,
    // borderColor: "yellow",
  },
  itemBackground: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    // paddingVertical: 10,
    // paddingHorizontal: 16,
  },
  itemActive: {
    // borderColor: "lime",
    // borderWidth: 3,
  },
  thumb: {
    width: 60,
    height: 60,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  labelActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});
