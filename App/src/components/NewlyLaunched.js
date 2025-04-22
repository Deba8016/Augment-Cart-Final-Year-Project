import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Text } from 'react-native-paper';
import ProductCard from './ProductCard';
import globalStyles from '../styles/global';
import { getSortedProducts } from '../api/Product_API';

const NewlyLaunched = ({ limit = 10, sortBy = 'createdAt', order = 'desc' }) => {
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getSortedProducts({ limit, sortBy, order });
      setRecentItems(products);
    };
    fetchProducts();
  }, [limit, sortBy, order]);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.header}>Newly Launched</Text>
      <FlatList
        data={recentItems}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => <ProductCard item={item} />}
      />
    </View>
  );
};

export default NewlyLaunched;
