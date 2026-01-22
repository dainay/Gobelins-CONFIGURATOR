import { ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import ProgressDiamonds from "../../components/ui/ProgressDiamonds";
import { useConfigurateurStore } from "../../src/store/configurateurStore";
import { useMenuStore } from "../../src/store/menuStore";

import { TabsInfo } from "../../constants/TabsInfo";




export default function MenuBar() {
  const activeMenu = useMenuStore((state) => state.activeMenu);
  const setActiveMenu = useMenuStore((state) => state.setActiveMenu);
  const setActiveTab = useConfigurateurStore((state) => state.setActiveTab);

  const menuNames = Object.keys(TabsInfo); // ['appearance', 'pose', 'guild']
  const currentIndex = menuNames.indexOf(activeMenu);
  const isFirstMenu = currentIndex === 0;
  const isLastMenu = currentIndex === menuNames.length - 1;

  const handleMenuChange = (menuName) => {
    setActiveMenu(menuName);

    const tabsForMenu = TabsInfo[menuName];

    if (tabsForMenu && tabsForMenu.length > 0) {
      const firstTabId = tabsForMenu[0].id;
      setActiveTab(firstTabId);
    } else {
      setActiveTab("default");
    }
  }

  const handlePreviousMenu = () => {
    if (!isFirstMenu && currentIndex > 0) {
      const previousMenu = menuNames[currentIndex - 1];
      handleMenuChange(previousMenu);
    }
  }

  const handleNextMenu = () => {
    if (!isLastMenu && currentIndex < menuNames.length - 1) {
      const nextMenu = menuNames[currentIndex + 1];
      handleMenuChange(nextMenu);
    }
  }

  const handleDiamondPress = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < menuNames.length) {
      const selectedMenu = menuNames[stepIndex];
      handleMenuChange(selectedMenu);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.globalContainer}>
        {/* Bouton précédent */}
        <TouchableOpacity 
          style={styles.sideButton}
          onPress={handlePreviousMenu}
          disabled={isFirstMenu}
          activeOpacity={isFirstMenu ? 1 : 0.7}
        >
          <ImageBackground
            source={isFirstMenu 
              ? require('../../assets/ui/menu-bar/left-button-rock.webp')
              : require('../../assets/ui/menu-bar/left-button-rock-on.webp')
            }
            style={styles.sideButtonBackground}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Conteneur des diamants de progression au milieu */}
        <ImageBackground
          source={require('../../assets/ui/menu-bar/wooden-bar-crop.webp')}
          style={styles.menuButtons}
          resizeMode="stretch"
        >
          <ProgressDiamonds 
            currentStep={currentIndex}
            totalSteps={menuNames.length}
            onDiamondPress={handleDiamondPress}
          />
        </ImageBackground>

        {/* Bouton suivant */}
        <TouchableOpacity 
          style={styles.sideButton}
          onPress={handleNextMenu}
          disabled={isLastMenu}
          activeOpacity={isLastMenu ? 1 : 0.7}
        >
          <ImageBackground
            source={isLastMenu 
              ? require('../../assets/ui/menu-bar/right-button-rock.webp')
              : require('../../assets/ui/menu-bar/right-button-rock-on.webp')
            }
            style={styles.sideButtonBackground}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
  },
  globalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingBlock: 16,
    paddingInline: 2,
    backgroundColor: "transparent",
    //gap: 16,
  },
  sideButton: {
    height: 70,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  sideButtonBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  menuButtons: {
    justifyContent: "center",
    alignItems: "center",
    //width: "50%",
    paddingInline : 48,
    paddingVertical: 4,
    height: 60,
    flex: 1,
  },
});
