import { Image, useColorScheme } from 'react-native'

// images
import { default as DarkLogo, default as LightLogo } from '../../assets/img/temp-logo.png'

const ThemedLogo = () => {
  const colorScheme = useColorScheme()
  
  const logo = colorScheme === 'dark' ? DarkLogo : LightLogo

  return (
    <Image source={logo} style={{ width: 200, height: 200, marginVertical: 30 }} />
  )
}

export default ThemedLogo