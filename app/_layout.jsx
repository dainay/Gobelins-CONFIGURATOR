import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { UserProvider } from "../context/UserContext";
// import { GobelinsProvider } from "../context/GobelinsContext"; 

// Empêcher le splash screen de se fermer automatiquement
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  // Charger les fonts personnalisées
  const [fontsLoaded] = useFonts({
    'LibreBaskerville': require('../assets/fonts/LibreBaskerville.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Affiche le splash screen pendant le chargement
  }

  return (
    <UserProvider>
      <StatusBar style="auto" />
      {/* <DisableBackHandler /> */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: theme.title,
          headerTransparent: true,
          headerShown: false,
        }}
      >
        <Slot />
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
