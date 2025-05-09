// navigation/DrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({ mainComponent, role }: { mainComponent: React.ComponentType<any>, role: string }) {
  return (
    <Drawer.Navigator initialRouteName={role === 'farmer' ? 'Farmer' : 'Shop'}>
      <Drawer.Screen name={role === 'farmer' ? 'Farmer' : 'Shop'} component={mainComponent} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
