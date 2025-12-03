import { useColorScheme, View } from 'react-native'
import { Colors } from '../../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ThemedView = ({ style, safe = false, transparent = true, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const bgColor = transparent ? 'transparent' : theme.background

  if (!safe) return (
    <View
      style={[{ backgroundColor: bgColor }, style]}
      {...props}
    />
  )

  const insets = useSafeAreaInsets()

  return (
    <View 
      style={[{ 
        backgroundColor: bgColor,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }, style]} 
      {...props}
    />
  )
}

export default ThemedView