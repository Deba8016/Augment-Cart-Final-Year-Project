import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './src/pages/authPages/Login';
import RegisterScreen from './src/pages/authPages/Register';
import BottomTabs from './src/components/BottomTabs';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';

const Stack = createNativeStackNavigator();

const greenTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    background: '#FFFFFF',
  },
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };

    checkToken();
  }, []);

  if (isLoggedIn === null) return null; // or splash screen

  return (
    <PaperProvider theme={greenTheme}>
      <NavigationContainer>
        <WishlistProvider>
          <CartProvider>
            <StatusBar style='dark' backgroundColor='white' />
            <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName={isLoggedIn? 'BottomTabs' : 'Login'}>

                <Stack.Screen name="BottomTabs" component={BottomTabs} />
             
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                
             
            </Stack.Navigator>
          </CartProvider>
        </WishlistProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}
