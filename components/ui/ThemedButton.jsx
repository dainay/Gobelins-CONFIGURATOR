import React from "react";
import { ImageBackground, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

import { Colors } from '../../constants/Colors';

import Button1 from "../../assets/ui/buttons/button1-dark.png";
// import Button2 from '../../assets/ui/buttons/button2.png';
const BUTTON_CONFIG = {
  button1: {
    image: Button1,
    height: 150,
    width: 250,
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

  // If children is a React element of type Text, clone it and merge styles so theme color applies.
  const renderLabel = () => {
    if (React.isValidElement(children) && children.type === Text) {
      const childStyle = children.props.style || {};
      return React.cloneElement(children, {
        style: [styles.text, { color: theme.accentColor1 }, childStyle, textStyle],
      });
    }

    // Otherwise render a Text wrapper with themed style
    return (
      <Text style={[styles.text, { color: theme.accentColor1 }, textStyle]}>{children}</Text>
    );
  };

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <ImageBackground
        source={button.image}
        resizeMode="stretch"
        style={{
          width: "50%",
          height: button.height,
          justifyContent: "center",
          width: button.width,
          transform: button.transform,
          marginVertical: 5,
        }}
      >
        <Pressable {...props}>{renderLabel()}</Pressable>
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
    fontSize: 24,
    textAlign: "center", 
    paddingTop: 8,
    paddingLeft: 10,
  },
});

export default ThemedButton;
