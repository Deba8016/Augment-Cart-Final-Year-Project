// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { addUser } from '../../api/User_API';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
  });
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const res = await addUser(userData);
  
      if (res.status === 201) {
        await AsyncStorage.setItem('userToken', res.data.token);
        Alert.alert('Success', res.data.message);
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTabs' }], // this triggers re-render in App.js
        });
      } else {
        Alert.alert('Error', res.data || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Register</Title>

      <TextInput
        label="Full Name"
        mode="outlined"
        value={userData.name}
        onChangeText={text => setUserData({ ...userData, name: text })}
        style={styles.input}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <TextInput
        label="Email"
        mode="outlined"
        keyboardType="email-address"
        value={userData.email}
        onChangeText={text => setUserData({ ...userData, email: text })}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={userData.password}
        onChangeText={text => setUserData({ ...userData, password: text })}
        style={styles.input}
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        autoCorrect={false}
        autoComplete="off"
        textContentType="password"
      />
      <TextInput
        label="Mobile"
        mode="outlined"
        keyboardType="phone-pad"
        value={userData.mobile}
        onChangeText={text => setUserData({ ...userData, mobile: text })}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
      >
        Register
      </Button>

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: "white" },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 10 },
  button: { marginTop: 20, backgroundColor: "#4caf50" },
  link: { marginTop: 20, color: '#4CAF50', textAlign: 'center' },
});

export default RegisterScreen;
