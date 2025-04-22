import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../../api/User_API';
import { useNavigation } from '@react-navigation/native'; 
import { CommonActions } from '@react-navigation/native';


const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const result = await loginUser({ username, password });

    if (result.status === 200) {
      await AsyncStorage.setItem('userToken', JSON.stringify(result.data)).then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTabs' }],
        });
      });
    } else {
      Alert.alert("Login Failed", result.message || 'Check credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      <TextInput
        label="Email or Mobile"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        mode='outlined'
        autoCapitalize='none'
        autoCorrect={false}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        autoCorrect={false}
        autoComplete="off"
        textContentType="password"
      />

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>

      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#FFFFFF', },
  input: { marginBottom: 15 },
  button: { marginTop: 10, backgroundColor: "#4caf50" },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  link: { textAlign: 'center', marginTop: 15, color: '#4CAF50' },
});

export default LoginScreen;
