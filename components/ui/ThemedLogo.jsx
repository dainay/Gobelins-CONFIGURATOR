import { Image, useColorScheme } from 'react-native'

// images
import { default as DarkLogo, default as LightLogo } from '../../assets/img/logo-goblinks.webp'

const ThemedLogo = () => {
  const colorScheme = useColorScheme()
  
  const logo = colorScheme === 'dark' ? DarkLogo : LightLogo

  return (
    <Image source={logo} style={{ width: 225, height: 225 }} />
  )
}

export default ThemedLogo