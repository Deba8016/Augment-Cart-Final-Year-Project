// components/CategoryList.js
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { categories } from '../data/categories';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';

import { EXPO_APP_BACKEND_URL } from "@env";
import { getCategories } from '../api/Category_API';


const CategoryList = () => {

  const [categories, setCategories] = useState([]);
  // console.log(categories)
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch categories from the backend API
    const fetchCategories = async () => {
      try {
        const response = await getCategories(); // API call to your backend
        setCategories(response); // Assuming response contains category data
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <View style={[globalStyles.container, { marginBottom: 50 }]}>
      <Text style={globalStyles.header}> Categories </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={globalStyles.container}>
        {categories.map((category) => (
          <TouchableOpacity key={category._id} style={styles.card}
            onPress={() =>
              navigation.navigate('ProductsPerCategory', {
                categoryId: category._id,
                categoryName: category.name
              })} >
            <Image source={{ uri: `${EXPO_APP_BACKEND_URL}/images/category-logo/${category.image}` }} style={styles.image} />
            <Text style={styles.label}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 90,
    height: 90,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 10
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CategoryList;
