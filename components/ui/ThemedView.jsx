import { useEffect, useMemo, useState } from "react";
import { Keyboard, Platform, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";

const ThemedView = ({
  style,
  safe = false,
  transparent = true,
  keyboard = false,
  children,
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const bgColor = transparent ? "transparent" : theme.background;

  const insets = useSafeAreaInsets();
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    if (!keyboard) return;

    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const s1 = Keyboard.addListener(showEvt, (e) => {
      setKbHeight(e?.endCoordinates?.height ?? 0);
    });

    const s2 = Keyboard.addListener(hideEvt, () => {
      setKbHeight(0);
    });

    return () => {
      s1.remove();
      s2.remove();
    };
  }, [keyboard]);

   
  const bottomPad = useMemo(() => {
    if (!safe) return keyboard ? kbHeight : 0;
    const safeBottom =
      Platform.OS === "ios" ? insets.bottom : Math.min(insets.bottom, 16);
    return keyboard ? Math.max(safeBottom, kbHeight) : safeBottom;
  }, [keyboard, kbHeight, safe, insets.bottom]);

  const topPad = safe ? insets.top : 0;

  return (
    <View
      style={[
        { flex: 1, backgroundColor: bgColor, paddingTop: topPad, paddingBottom: bottomPad },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

export default ThemedView;
