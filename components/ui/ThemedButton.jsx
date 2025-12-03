import { Pressable, StyleSheet, Text } from 'react-native'
import { Colors } from '../../constants/Colors'

function ThemedButton({ style, children, textStyle, ...props }) {

  return (
    <Pressable 
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]} 
      {...props}
    >
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 6,
    marginVertical: 10
  },
  pressed: {
    opacity: 0.5
  },
  text: {
    color: '#f2f2f2',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
})

export default ThemedButton