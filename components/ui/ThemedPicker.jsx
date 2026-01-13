import { Picker } from "@react-native-picker/picker";
import {
    ImageBackground,
    Platform,
    StyleSheet,
    useColorScheme,
    View,
} from "react-native";
import { Colors } from "../../constants/Colors";

import Bar1 from "../../assets/ui/bars/bar1.png";
import Bar2 from "../../assets/ui/bars/bar2.png";
import ThemedText from "./ThemedText";

const BAR_CONFIG = {
  bar1: { image: Bar1, height: 60, width: 330, paddingX: 46, translateX: 5 },
  bar2: { image: Bar2, height: 60, width: 300, paddingX: 25, translateX: 0 },
};

export default function ThemedPicker({
  label,
  items = [],
  value,
  onChange,
  background = "bar2",
  style,
  pickerStyle,
  ...props
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const bar = BAR_CONFIG[background] ?? BAR_CONFIG.bar2;

  return (
    <View style={[styles.wrapper, style]}>
      {!!label && <ThemedText style={styles.label}>{label}</ThemedText>}

      <ImageBackground
        source={bar.image}
        resizeMode="stretch"
        style={[
          styles.bar,
          {
            height: bar.height,
            width: bar.width,
            transform: [{ translateX: bar.translateX }],
            color: Colors.black, 
          },
        ]}
      >
        <View
          style={{
            paddingHorizontal: bar.paddingX, 
            // height: 40,
          }}
        >
          <Picker
          mode="dropdown"
            selectedValue={value}
            onValueChange={onChange}
            dropdownIconColor={Colors.black}
            style={[
              styles.picker,
              {
                color: Colors.black,
                fontFamily: "Merriweather-Light",
                  height: 48,              
              },
              pickerStyle,
            ]}
            {...props}
          >
            {items.map((it) => (
          
              <Picker.Item
                key={String(it.value)}
                label={it.label}
                value={it.value}
                style={{
                  color: Colors.black,
                  fontFamily: "Merriweather-Light",
                    backgroundColor: "#D89640",
              
                }}
              /> 
            ))}
          </Picker>
        </View>
      </ImageBackground>
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
  bar: {
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    height: Platform.OS === "android" ? 60 : 60,
    backgroundColor: "transparent",
    color: Colors.black,
  },
});
