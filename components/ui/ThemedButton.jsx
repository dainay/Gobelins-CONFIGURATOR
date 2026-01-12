import { ImageBackground, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

import { Colors } from '../../constants/Colors';

import Button1 from "../../assets/ui/buttons/button1-dark.png";
// import Button2 from '../../assets/ui/buttons/button2.png';
const BUTTON_CONFIG = {
  button1: {
    image: Button1,
    height: 200, 
    width: 330,
    transform: [{ translateX: -5 }],
  },
  // button2: {
  //   image: Button2,
  //   height: 60,
  //   paddingX: 40,
  //   width: 300,
  //   transform: [{ translateX: 0 }],
  // },
};

function ThemedButton({ style, children, textStyle, type = "button1", ...props}) {

  const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    const button = BUTTON_CONFIG[type] ?? BUTTON_CONFIG.button1;
  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <ImageBackground
        source={button.image}
        resizeMode="stretch"
        style={{
          width: "80%",
          height: button.height,
          justifyContent: "center",
          width: button.width,
          transform: button.transform,
          marginVertical: 5,
        }}
      >
        <Pressable
          {...props}
        >
          <Text style={[styles.text,  { color: theme.accentColor1 }]}>{children}</Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  
  pressed: {
    opacity: 0.5,
  },
  text: {
    fontFamily: "Sofia",
    fontSize: 37,
    textAlign: "center", 
    paddingTop: 8,
    paddingLeft: 10,
  },
});

export default ThemedButton;
