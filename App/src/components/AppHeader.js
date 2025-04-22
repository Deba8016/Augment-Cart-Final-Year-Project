import React, { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileImage from './ProfileImage';

const AppHeader = ({ title, rightComponent }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleProfile = () => {
    closeMenu();
    navigation.navigate('Profile');
  };
  const handleOrder = () => {
    closeMenu();
    navigation.navigate('Orders');
  };

  const handleLogout = async () => {
    closeMenu();
    await AsyncStorage.removeItem('userToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Content title={title} titleStyle={styles.title} />

      {/* If rightComponent === undefined → show profile image & menu */}
      {rightComponent === undefined ? (
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <ProfileImage uri={null} name="Guest" />
            </TouchableOpacity>
          }
          style={styles.menu}
          contentStyle={styles.menuContent}
        >
          <Menu.Item onPress={handleProfile} title="Profile" />
          <Menu.Item onPress={handleOrder} title="My Orders" />
          <Menu.Item onPress={handleLogout} title="Logout" style={styles.logoutItem} />
        </Menu>
      ) : rightComponent === null ? null : rightComponent}

    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    justifyContent: 'space-between',
    marginVertical:5
  },
  title: {
    fontWeight: '600',
    fontSize: 24,
  },
  menu: {
    top: 100,
    width: 150,
    paddingRight: 15,
  },
  menuContent: {
    paddingVertical: 0,
    marginVertical: 0,
    borderRadius: 10,
    overflow: 'hidden',
  },
  logoutItem: {
    backgroundColor: '#ff5959',
  },
});

export default AppHeader;
