import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    // DO NOT manually navigate or set user — onAuthStateChanged will do that
  } catch (err: any) {
    setError(err.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" style={styles.input} onChangeText={setPassword} value={password} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  title: { fontSize: 24, marginBottom: 20 },
  error: { color: 'red', marginBottom: 10 },
  registerText: { marginTop: 15, color: 'blue', textAlign: 'center' },
});
