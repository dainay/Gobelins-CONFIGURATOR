import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { Colors } from "../../constants/Colors";

import Button1 from "../../assets/ui/buttons/button1-dark.png";
import Button3 from "../../assets/ui/buttons/button3.png";
import Button4 from "../../assets/ui/buttons/button4.png";
import Button5 from "../../assets/ui/buttons/button5.png";
import Button6 from "../../assets/ui/buttons/button6.png";
import Button2 from "../../assets/ui/guilds/button-guild.png";

import { playSfx } from "../../src/lib/sounds";

const BUTTON_CONFIG = {
  button1: {
    image: Button1,
    height: 150,
    width: 250,
    transform: [{ translateX: -5 }],
    color: Colors.accentColor1,
    paddingTop: 8,
  },
  button2: {
    image: Button2,
    paddingX: 40,
    width: 300,
    height: 100,
    transform: [{ translateX: 0 }],
    color: Colors.black,
    paddingTop: 25,
  },
  button3: {
    image: Button3,
    height: 150,
    width: 300,
    transform: [{ translateX: 0 }],
    color: Colors.accentColor1,
    paddingTop: 10,
  },
  button4: {
    image: Button4,
    height: 170,
    width: 350,
    transform: [{ translateX: 0 }],
    color: Colors.black,
    paddingTop: 8,
  },
  button5: {
    image: Button5,
    height: 90,
    width: 240,
    transform: [{ translateX: 0 }],
    color: Colors.black,
    paddingTop: 5,
  },
  button6: {
    image: Button6,
    height: 100,
    width: 250,
    transform: [{ translateX: 0 }],
    color: "white",
    paddingTop: -5,
  },
};

function ThemedButton({
  style,
  children,
  textStyle,
  type = "button1",
  width,
  height,
  ...props
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const button = BUTTON_CONFIG[type] ?? BUTTON_CONFIG.button1;

  const renderLabel = () => {
    if (React.isValidElement(children) && children.type === Text) {
      const childStyle = children.props.style || {};
      return React.cloneElement(children, {
        style: [styles.text, { color: button.color }, childStyle, textStyle],
      });
    }

    return (
      <Text
        style={[
          styles.text,
          { color: button.color, paddingTop: button.paddingTop },
          textStyle,
        ]}
      >
        {children}
      </Text>
    );
  };

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <ImageBackground
        source={button.image}
        resizeMode="stretch"
        style={{
          height: height || button.height,
          justifyContent: "center",
          width: width || button.width,
          transform: button.transform,
          marginVertical: 5,
        }}
      >
        <Pressable
          {...props}
          onPress={() => {
            playSfx("button");
            if (props.onPress) props.onPress();
          }}
        >
          {renderLabel()}
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
    fontFamily: "ChristmasBold",
    fontSize: 37,
    textAlign: "center",
    paddingLeft: 10,
  },
});

export default ThemedButton;
