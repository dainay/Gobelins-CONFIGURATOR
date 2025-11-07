import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { appwritePing } from '../lib/appwrite';

export default function PingScreen() {
  const [msg, setMsg] = useState('Проверяю связь с Appwrite...');

  useEffect(() => {
    appwritePing()
      .then((r) => setMsg(`✅ OK: ${r.country} / ${r.ip}`))
      .catch((e) => setMsg(`❌ Ошибка: ${String(e)}`));
  }, []);

  return (
    <View style={{ padding: 24 }}>
      <Text>{msg}</Text>
    </View>
  );
}
