import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useIntroFlag } from '../hooks/useIntroFlag';

export default function Index() {
  const { hasSeenIntro, resetIntro } = useIntroFlag();

  // Pendant le développement : réinitialise l'intro à chaque démarrage
  // Commenter cette ligne pour réactiver la logique normale
  useEffect(() => {
    resetIntro();
  }, []);

  if (hasSeenIntro === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!hasSeenIntro) {
    return <Redirect href="/intro" />;
  }

  return <Redirect href="/home" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});
