// components/SceneIntro.jsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SceneIntro({ scene, onNext }) {
  if (!scene) {
    return null;
  }

  const {
    bg = '#000',           
    title,
    text,
    description,
  } = scene;

  const handlePress = () => {
    if (typeof onNext === 'function') {
      onNext();
    }
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: bg }]}
      onPress={handlePress}
    >
      <View style={styles.inner}>
        {title && <Text style={styles.title}>{title}</Text>}
        {text && <Text style={styles.text}>{text}</Text>}
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
        <Text style={styles.hint}>Appuie pour continuer</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: '#dddddd',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  hint: {
    marginTop: 32,
    color: '#bbbbbb',
    fontSize: 12,
  },
});
