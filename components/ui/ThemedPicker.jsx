import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";

import { useEffect, useMemo, useRef, useState } from "react";
import { default as Bar2 } from "../../assets/ui/bars/input1.webp";
import ThemedText from "./ThemedText";

// Un seul style de "bar" pour le picker
const PICKER_BAR = { image: Bar2, height: 60, width: 275, paddingX: 25, transform: [{ translateX: 0 }] };

export default function ThemedPicker({
  label,
  items = [],
  value,
  onChange,
  style,
  pickerStyle,
}) {
  const bar = PICKER_BAR;
  const [open, setOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const OPTION_ROW_HEIGHT = 44;
  const DROPDOWN_PADDING_TOP = 10;
  const DROPDOWN_PADDING_BOTTOM = 28; // réserve pour le "bout-parchemin"
  const DROPDOWN_CONTENT_BOTTOM = 8;

  const selectedLabel = useMemo(() => {
    const found = items.find((it) => it?.value === value);
    return found?.label ?? "";
  }, [items, value]);

  const dropdownHeight = useMemo(() => {
    const count = Array.isArray(items) ? items.length : 0;
    return (
      DROPDOWN_PADDING_TOP +
      DROPDOWN_PADDING_BOTTOM +
      DROPDOWN_CONTENT_BOTTOM +
      count * OPTION_ROW_HEIGHT
    );
  }, [items]);

  const openDropdown = () => {
    if (dropdownVisible) return;
    setDropdownVisible(true);
    setOpen(true);
    Animated.timing(anim, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      // height animation => JS driver
      useNativeDriver: false,
    }).start();
  };

  const closeDropdown = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 160,
      easing: Easing.in(Easing.cubic),
      // height animation => JS driver
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) return;
      setOpen(false);
      setDropdownVisible(false);
    });
  };

  // Si on ferme via state externe, s'assurer de démonter proprement
  useEffect(() => {
    if (!open && dropdownVisible) {
      closeDropdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Animation "déploiement" (hauteur 0 -> hauteur finale)
  const dropdownAnimStyle = {
    height: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, dropdownHeight],
    }),
  };

  return (
    <View style={[styles.wrapper, style]}>
      {!!label && (
        <ThemedText font="merriweather" style={styles.label}>
          {label}
        </ThemedText>
      )}

      <View style={styles.relative}>
        {/* Trigger (dans la barre) */}
        <Pressable
          onPress={() => (dropdownVisible ? closeDropdown() : openDropdown())}
          style={styles.triggerPressable}
        >
          <ImageBackground
            source={bar.image}
            resizeMode="stretch"
            style={[
              styles.bar,
              {
                height: bar.height,
                width: bar.width,
                transform: bar.transform,
              },
              pickerStyle,
            ]}
          >
            <View style={[styles.triggerInner, { paddingHorizontal: bar.paddingX }]}>
              <Text style={styles.selectedText} numberOfLines={1}>
                {selectedLabel}
              </Text>
              <Text style={styles.chevron}>▾</Text>
            </View>
          </ImageBackground>
        </Pressable>

        {/* Dropdown (dans le style de la barre / au-dessus du reste) */}
        {dropdownVisible && (
          <>
            {/* overlay pour fermer en cliquant ailleurs */}
            <Pressable style={styles.backdrop} onPress={closeDropdown} />

            <View style={[styles.dropdown, { width: bar.width }]}>
              {/* clip animé: se déplie de haut en bas */}
              <Animated.View style={[styles.dropdownClip, dropdownAnimStyle]}>
                <ImageBackground
                  source={require("../../assets/ui/tutorial/background-square.png")}
                  resizeMode="stretch"
                  style={styles.dropdownBg}
                >
                  <View style={styles.dropdownContent}>
                    {items.map((it) => (
                      <Pressable
                        key={String(it.value)}
                        onPress={() => {
                          onChange?.(it.value);
                          closeDropdown();
                        }}
                        style={[styles.optionRow, { height: OPTION_ROW_HEIGHT }]}
                      >
                        <Text style={styles.optionText}>{it.label}</Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* déco bas parchemin (suit le bas car position: absolute) */}
                  <Image
                    source={require("../../assets/ui/tutorial/bout-parchemin.png")}
                    style={styles.dropdownBottomDeco}
                    resizeMode="stretch"
                    pointerEvents="none"
                  />
                </ImageBackground>
              </Animated.View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: "white",
  },
  relative: {
    position: "relative",
    zIndex: 999,
    elevation: 999,
  },
  triggerPressable: {
    zIndex: 2,
    elevation: 60,
  },
  bar: {
    justifyContent: "center",
    alignItems: "center",
  },
  triggerInner: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedText: {
    flex: 1,
    color: Colors.black,
    fontFamily: "Merriweather",
    fontSize: 16,
  },
  chevron: {
    marginLeft: 10,
    color: Colors.black,
    fontSize: 16,
    fontFamily: "Merriweather",
  },
  backdrop: {
    position: "absolute",
    top: -9999,
    left: -9999,
    right: -9999,
    bottom: -9999,
    zIndex: 0,
  },
  dropdown: {
    position: "absolute",
    top: 50,
    left: 0,
    // Doit être derrière la barre sélectionnée ("2e année")
    zIndex: 1,
    elevation: 10,
  },
  dropdownClip: {
    overflow: "hidden",
    width: "100%",
  },
  dropdownBg: {
    width: "100%",
    paddingVertical: 10,
    // paddingBottom: 28,
    height: "100%",
  },
  dropdownContent: {
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  optionRow: {
    paddingVertical: 10,
    justifyContent: "center",
  },
  optionText: {
    color: Colors.black,
    fontFamily: "Merriweather",
    fontSize: 16,
  },
  dropdownBottomDeco: {
    position: "absolute",
    left: "-5%",
    bottom: 4,
    width: "110%",
    height: 40,
    zIndex: 5,
    elevation: 5,
  },
});
