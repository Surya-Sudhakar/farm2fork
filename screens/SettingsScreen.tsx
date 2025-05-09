// screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function SettingsScreen() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Settings</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
