import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { decode as atob, encode as btoa } from 'base-64';

// Expo runtime (React Native) doesn't provide these by default
if (!global.atob) global.atob = atob;
if (!global.btoa) global.btoa = btoa;

// Some loaders also reference global.Base64
global.Base64 = {
  atob,
  btoa,
};
// Synchronous in-memory localStorage polyfill for Appwrite compatibility
//do not touch - needed for Appwrite SDK to work in React Native environment
if (typeof global.localStorage === 'undefined') {
  let storage = {};
  global.localStorage = {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
    },
    setItem(key, value) {
      storage[key] = value.toString();
    },
    removeItem(key) {
      delete storage[key];
    },
    clear() {
      storage = {};
    },
    key(index) {
      const keys = Object.keys(storage);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(storage).length;
    }
  };
}

import { Stack } from "expo-router";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "../context/UserContext";
import { GobelinsProvider } from "../context/GobelinsContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <UserProvider>
      <GobelinsProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.navBackground },
            headerTintColor: theme.title,
          }}
        >
          {/* Individual Screens (make index the first/initial route) */}
          <Stack.Screen name="index" options={{ title: "Home" }} />

          {/* Groups */}
          <Stack.Screen name="(auth)" options={{ headerShown: true }} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: true }} />

          <Stack.Screen name="(three)" options={{ headerShown: true }} />

        </Stack>
      </GobelinsProvider>
    </UserProvider>
  );
}
