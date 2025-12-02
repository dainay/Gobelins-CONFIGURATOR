import { Stack } from "expo-router";
import { Colors } from "../constants/Colors";
import { useColorScheme, ImageBackground, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "../context/UserContext";
import { GobelinsProvider } from "../context/GobelinsContext"; 

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <ImageBackground
      source={require("../assets/img/skin.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <UserProvider>
        <GobelinsProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: 'transparent' },
              headerTintColor: theme.title,
              headerTransparent: true,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />

          </Stack>
        </GobelinsProvider>
      </UserProvider>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
