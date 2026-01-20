import { ImageBackground, TextInput, useColorScheme, View } from 'react-native';
import { default as Bar1, default as Bar2 } from '../../assets/ui/bars/input1.webp';
import { Colors } from '../../constants/Colors';

const BAR_CONFIG = {
  bar1: {
    image: Bar1,
    height: 60,
    paddingX: 25,
    width: 275,
  },
  bar2: {
    image: Bar2,
    height: 60,
    paddingX: 25,
    width: 275,
  },
};


const ThemedTextInput = ({
  style, // style du TextInput (texte à l'intérieur)
  containerStyle, // style du cadre (ImageBackground)
  wrapperStyle, // style du wrapper externe
  background = 'bar2',
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const bar = BAR_CONFIG[background] ?? BAR_CONFIG.bar1;

  return (
    <View style={[{ width: '100%', alignItems: 'center' }, wrapperStyle]}>
      <ImageBackground
        source={bar.image}
        resizeMode="stretch"
        style={[{ 
          height: bar.height,
          justifyContent: 'center',
          width: bar.width,
          transform: bar.transform,
          marginVertical: 0,
        }, containerStyle]}
      >
        <TextInput
          style={[
            {
              width: '100%',
              height: '100%',
              color:  Colors.black,
              paddingHorizontal: bar.paddingX,
              fontFamily: 'Merriweather-Light',
              fontSize: 16,
              textAlignVertical: "center",
               includeFontPadding: false
            },
            style,
          ]}
          {...props}
        />
      </ImageBackground>
    </View>
  );
};

export default ThemedTextInput;