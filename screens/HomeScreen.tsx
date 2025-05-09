// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { RootState } from '../store';
import { clearUser } from '../slices/authSlice';

export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {user?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
