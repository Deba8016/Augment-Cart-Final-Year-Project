import React, { useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { Searchbar } from 'react-native-paper';
import * as Updates from 'expo-updates';
import AppHeader from '../components/AppHeader';
import CategoryList from '../components/Categories';
import NewlyLaunched from '../components/NewlyLaunched';
import ImageSlider from '../components/ImageSlider';
import BestSeller from '../components/BestSeller';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Updates.reloadAsync();
    } catch (err) {
      console.error(err);
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#4caf50']}
          tintColor="#4caf50"
          progressViewOffset={90}
        />
      }
      style={{ backgroundColor: 'white' }}
    >
      <AppHeader title="Augment Cart" />

      <TouchableOpacity
        onPress={() => navigation.navigate('SearchScreen', { autoFocus: true })}
        activeOpacity={0.8}
        style={styles.fakeSearchBar}
      >
      <Icon name="search" size={22} color="#888" style={{ marginRight: 8 }} />
        <Text style={styles.fakeSearchText}>Search groceries...</Text>
      </TouchableOpacity>

      <ImageSlider />
      <CategoryList />
      <NewlyLaunched />
      <BestSeller />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fakeSearchBar: {
  margin: 10,
  padding: 15,
  backgroundColor: '#f1f1f1',
  borderRadius: 120,
  flexDirection: 'row',
  alignItems: 'center',
},

  fakeSearchText: {
    color: '#888',
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 4
  },
});

export default HomeScreen;
