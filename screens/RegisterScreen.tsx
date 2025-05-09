// screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../services/firebase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'consumer'>('consumer'); // Default

  const registerUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(db, 'users/' + user.uid), {
        email: user.email,
        role: role,
      });

      Alert.alert('Success', `Registered as ${role}`);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" style={styles.input} onChangeText={setPassword} value={password} secureTextEntry />

      <Text>Select Role:</Text>
      <View style={styles.roleButtons}>
        <Button title="Farmer" onPress={() => setRole('farmer')} color={role === 'farmer' ? 'green' : 'gray'} />
        <Button title="Consumer" onPress={() => setRole('consumer')} color={role === 'consumer' ? 'blue' : 'gray'} />
      </View>

      <Button title="Register" onPress={registerUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  title: { fontSize: 24, marginBottom: 20 },
  roleButtons: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
});
