import { TextInput, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'
 

const ThemedTextImport = ({style, ...props}) => {

     const colorScheme = useColorScheme()
      const theme = Colors[colorScheme] ?? Colors.light

  return (
    
      <TextInput
       style={[{ 
        backgroundColor: theme.background,
        color: theme.text,
        borderWidth: 1,
        padding: 20,
        borderRadius: 5,
        width: '90%',
        }, style]}

        {...props}
      />
  )
}

export default ThemedTextImport
 