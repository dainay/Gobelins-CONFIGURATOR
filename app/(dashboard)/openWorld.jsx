import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useUser } from '../../hooks/useUser'

import ThemedView from '../../components/ui/ThemedView'

const openWorld = () => {
  const router = useRouter()
  const { user } = useUser()

  console.log("User in openWorld:", user);

  return (
    <ThemedView safe={true} style={styles.container}>
      {/* Avatar with name on the top page - redirection to page perso */}
      <Pressable style={styles.avatarSection} onPress={() => router.push('/(dashboard)/profile')}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.userName}>{user?.user_metadata?.display_name || 'User'}</Text>
      </Pressable>

      {/* card with other avatars - swipe left, swipe right. tap - sound - tap animation */}
      <View style={styles.cardsSection}>
        <View style={styles.card}>
          <View style={styles.cardAvatar}>
            <Text style={styles.cardAvatarText}>👥</Text>
          </View>
          <Text style={styles.cardTitle}>Other Gobelins</Text>
          <Text style={styles.cardSubtitle}>Swipe to explore</Text>
        </View>
      </View>

      {/* my demands */}
      <Pressable style={styles.linkSection} onPress={() => console.log('Navigate to demands')}>
        <Text style={styles.linkTitle}>📋 My Demands</Text>
        <Text style={styles.linkArrow}>→</Text>
      </Pressable>

      {/* my propositions of help */}
      <Pressable style={styles.linkSection} onPress={() => console.log('Navigate to propositions')}>
        <Text style={styles.linkTitle}>🤝 My Propositions</Text>
        <Text style={styles.linkArrow}>→</Text>
      </Pressable>
    </ThemedView>
  )
}

export default openWorld

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardsSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardAvatarText: {
    fontSize: 48,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  linkSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  linkArrow: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
})