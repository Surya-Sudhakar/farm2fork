import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../consumer/HomeScreen';
import CartScreen from '../consumer/CartScreen';
import FavoritesScreen from '../consumer/FavoritesScreen';

const Tab = createBottomTabNavigator();

export default function ConsumerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}
