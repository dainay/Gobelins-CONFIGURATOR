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
import { playSfx } from "../../src/lib/sounds";

import ButtonBg from "../../assets/ui/buttons/button.webp";

function ThemedButton({ style, children, textStyle, width, height, ...props }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const renderLabel = () => {
    if (React.isValidElement(children) && children.type === Text) {
      const childStyle = children.props.style || {};
      return React.cloneElement(children, {
        // garde le style historique (button1) par défaut
        style: [styles.text, { color: theme.accentColor1 ?? Colors.accentColor1 }, childStyle, textStyle],
      });
    }

    return (
      <Text
        style={[
          styles.text,
          { color: theme.accentColor1 ?? Colors.accentColor1, paddingTop: 8 },
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
        source={ButtonBg}
        resizeMode="stretch"
        style={{
          // mêmes defaults que l'ancien "button1"
          height: height || 150,
          justifyContent: "center",
          width: width || 250,
          transform: [{ translateX: -5 }],
          marginVertical: 5,
          ...(style ?? null),
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
