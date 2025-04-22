// components/ProfileImage.js
import React, { useMemo, useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from '../api/User_API';
import {EXPO_APP_BACKEND_URL} from "@env"

const ProfileImage = ({ uri, name, size = 40 }) => {
   const [userInfo, setUserInfo] = useState("")
   useEffect(() => {
    const getDecodedToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decoded = jwtDecode(token)
          const userFromDB = await getUser(decoded.id);
          setUserInfo(userFromDB);
          // console.log("PROFILE IMAGE:" , userInfo)
        } else {
          console.log('No token found');
        }
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    };
  
    getDecodedToken();
  }, []);
  // console.log(basicUserInfo)

  const firstLetter = userInfo.name?.charAt(0)?.toUpperCase();

  // Generate a random background color (memoized so it doesn't change during a single render)
  const backgroundColor = useMemo(() => {
    const colors = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#f44336', '#607d8b'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }, []);

  return userInfo.image === 'default' ? (
    <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}>
      <Text style={styles.initial}>{firstLetter}</Text>
    </View>
  ) : (
    <Image source={{uri :`${EXPO_APP_BACKEND_URL}/images/user-images/${userInfo.image}`}} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
  );
};

const styles = StyleSheet.create({
  image: {
    marginRight: 15,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    paddingBottom:1
  },
  initial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default ProfileImage;
