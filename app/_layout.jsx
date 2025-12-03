import { Stack } from "expo-router";
import { Colors } from "../constants/Colors";
import { useColorScheme, ImageBackground, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "../context/UserContext";
// import { GobelinsProvider } from "../context/GobelinsContext"; 

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
   
      <UserProvider> 
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: 'transparent' },
              headerTintColor: theme.title,
              headerTransparent: true,
              contentStyle: { backgroundColor: 'olive' },
              headerShown: false,
            }}
          >
          </Stack>
      </UserProvider> 
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
