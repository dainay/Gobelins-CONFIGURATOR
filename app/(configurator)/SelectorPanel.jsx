import { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { AvatarOptions } from "../../constants/AvatarOptions";
import { useConfigurateurStore } from "../../src/store/configurateurStore";
import { useGobelinStore } from "../../src/store/gobelinStore";

export default function OptionsPanel() {
  const setConfig = useGobelinStore((state) => state.setConfig);
  const configuration = useGobelinStore((state) => state.configuration);
  const activeTab = useConfigurateurStore((state) => state.activeTab);
  const items = AvatarOptions[activeTab] || [];
  const scrollViewRef = useRef(null);
  const itemLayouts = useRef({});
  const { width: screenWidth } = useWindowDimensions();



//vide l'objet itemLayouts quand on change d'onglets
  useEffect(() => {
    itemLayouts.current = {}
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
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
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
            <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 175,
    backgroundColor: "purple",
    zIndex: 5,
    paddingTop: 32,
    paddingBottom: 24,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    height: 85,
    aspectRatio: 1,
  },
  itemActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    borderWidth: 2,
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
