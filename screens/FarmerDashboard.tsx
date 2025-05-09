import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddProductScreen from '../farmer/AddProduct';
import MyProductsScreen from '../farmer/MyProductsScreen';
import orderScreen from '../farmer/Orders';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function FarmerDashboard() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // 🔥 hides labels
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'My Products':
              iconName = 'list';
              break;
            case 'Add Product':
              iconName = 'add-circle';
              break;
            case 'Order':
              iconName = 'cart';
              break;
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="My Products" component={MyProductsScreen} />
      <Tab.Screen name="Add Product" component={AddProductScreen} />
      <Tab.Screen name="Order" component={orderScreen} />
    </Tab.Navigator>
  );
}
