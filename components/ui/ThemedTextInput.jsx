import { ImageBackground, TextInput, useColorScheme, View } from 'react-native';
import Bar1 from '../../assets/ui/bars/bar1.png';
import Bar2 from '../../assets/ui/bars/bar2.png';
import { Colors } from '../../constants/Colors';

const BAR_CONFIG = {
  bar1: {
    image: Bar1,
    height: 60,
    paddingX: 50,
    width: 330,
    transform: [{ translateX: 5 }],
  },
  bar2: {
    image: Bar2,
    height: 60,
    paddingX: 40,
    width: 300,
     transform: [{ translateX: 0 }],
  },
};


const ThemedTextInput = ({ style, background = 'bar1', ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const bar = BAR_CONFIG[background] ?? BAR_CONFIG.bar1;

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <ImageBackground
        source={bar.image}
        resizeMode="stretch"
        style={{
          width: '80%',
          height: bar.height,
          justifyContent: 'center',
          width: bar.width,
          transform: bar.transform,
          marginVertical: 5,
        }}
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