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
  const [fontsLoaded, fontError] = useFonts({
    'LibreBaskerville': require('../assets/fonts/LibreBaskerville.ttf'),
    'LibreBaskerville-Bold': require('../assets/fonts/LibreBaskerville-Bold.ttf'),
    'Merriweather': require('../assets/fonts/Merriweather-Regular.ttf'),
    'Merriweather-Bold': require('../assets/fonts/Merriweather-Bold.ttf'),
    'Merriweather-Light': require('../assets/fonts/Merriweather Light.ttf'),
    'Merriweather-UltraBold': require('../assets/fonts/Merriweather UltraBold.ttf'),
    'ChristmasBold': require('../assets/fonts/christmas-bold.ttf'),
    'Christmas': require('../assets/fonts/christmas.ttf'),
    'Sofia': require('../assets/fonts/sofia.ttf'),
    
  });

  useEffect(() => {
    // Masquer le splash screen immédiatement, ne pas attendre les polices
    // Les polices se chargeront en arrière-plan et seront disponibles quand prêtes
    SplashScreen.hideAsync();
    
    if (fontError) {
      // Log uniquement en cas d'erreur pour le débogage
      console.warn('⚠️ Erreur de chargement des polices (utilisation des polices système):', fontError);
    }
  }, [fontsLoaded, fontError]);

  // Ne pas bloquer l'app si les polices ne se chargent pas
  // L'app continuera avec les polices système par défaut
  // On ne vérifie plus fontsLoaded pour le rendu, l'app démarre toujours
 if (!fontsLoaded) return null;
 
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
