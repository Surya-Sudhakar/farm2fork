import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyProducts from '../farmer/MyProducts';
import AddProduct from '../farmer/AddProduct';
import Orders from '../farmer/Orders';

const Tab = createBottomTabNavigator();

export default function FarmerDashboard() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="My Products" component={MyProducts} />
      <Tab.Screen name="Add Product" component={AddProduct} />
      <Tab.Screen name="Orders" component={Orders} />
    </Tab.Navigator>
  );
}
