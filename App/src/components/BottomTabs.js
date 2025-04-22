import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeStack from './HomeStack'; // 🔁 Stack inside tab
import Wishlist from '../pages/Wishlist';
import Cart from '../pages/Cart';
import OrderAgain from '../pages/OrderAgain';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Recent Orders') iconName = 'history';
          else if (route.name === 'Wishlist') iconName = 'heart-outline';
          else if (route.name === 'Cart') iconName = 'cart';

          return <Icon name={iconName} color={color} size={28} />;
        },
        tabBarActiveTintColor: '#4caf50',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 80,
          paddingTop: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Recent Orders" component={OrderAgain} />
      <Tab.Screen name="Wishlist" component={Wishlist} />
      <Tab.Screen name="Cart" component={Cart} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
