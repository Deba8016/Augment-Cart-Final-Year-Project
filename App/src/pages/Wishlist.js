import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { useWishlist } from '../context/WishlistContext';
import AppHeader from '../components/AppHeader';
import ProductCard from '../components/ProductCard';
import { EXPO_APP_BACKEND_URL } from "@env";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
console.log(wishlistItems)
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader 
      title="Wishlist"
      rightComponent={wishlistItems.length > 0 ? (
        <View >
          <Button mode="contained" onPress={() => clearWishlist()} style={{ backgroundColor: '#4caf50', marginRight: 15 }}>
            Clear Wishlist
          </Button>
        </View>
      ): undefined}
       />
      
      <FlatList
        data={wishlistItems?.filter((item) => item && item._id)}
        keyExtractor={(item, index) => item?._id ?? `key-${index}`}
        numColumns={2}
        style={{marginLeft:15}}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <ProductCard item={item} />
          </View>
        )}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={
          wishlistItems.length === 0 ? styles.emptyContainer : styles.contentContainer
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>💚 Your wishlist is empty</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%'
  },
  card: {
    marginBottom: 10,
    marginHorizontal: 10,
    height: 115
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: '90%',
    borderRadius: 8,
    margin: 10,
  },
  cardContent: {
    flexDirection: 'row',
  },
  details: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  price: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  itemWrapper: {
    flex: 1,
    marginBottom: 10,
    alignItems: 'center', // optional
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});

export default Wishlist;
