// Библиотека всех шрифтов
export const Fonts = {
  libreBaskerville: 'LibreBaskerville',
  libreBaskervilleBold: 'LibreBaskerville-Bold',
  merriweather: 'Merriweather',
  merriweatherBold: 'Merriweather-Bold',
  merriweatherLight: 'Merriweather-Light',
  merriweatherUltraBold: 'Merriweather-UltraBold',
  christmasBold: 'ChristmasBold',
  christmas: 'Christmas',
  sofia: 'Sofia',
};
import { Text, useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';


const ThemedText = ({ style, title = false, font = 'libreBaskerville', ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const textColor = title ? theme.title : theme.text;
 
  const fontFamily = Fonts[font] || Fonts.libreBaskerville;

  return (
    <Text
      style={[{ color: textColor, fontFamily }, style]}
      {...props}
    />
  );
}

export default ThemedText