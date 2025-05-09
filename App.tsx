import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, RootState } from './store';
import LoginScreen from './screens/LoginScreen';
import FarmerDashboard from './screens/FarmerDashboard';
import ConsumerTabs from './screens/ConsumerTabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { setUser, clearUser } from './slices/authSlice';
import RegisterScreen from './screens/RegisterScreen';
import { getDatabase, ref, get } from 'firebase/database';
import DrawerNavigator from './navigation/DrawerNavigator';

const Stack = createNativeStackNavigator();

function AppInner() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [initializing, setInitializing] = React.useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const db = getDatabase();
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          dispatch(setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: userData.role,
          }));
        } else {
          dispatch(setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: 'consumer',
          }));
        }
      } else {
        dispatch(clearUser());
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen
            name="Main"
            children={() => (
              <DrawerNavigator
                mainComponent={user.role === 'farmer' ? FarmerDashboard : ConsumerTabs}
                role={user.role}
              />
            )}
          />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppInner />
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
});