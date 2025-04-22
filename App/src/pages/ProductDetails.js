import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Title, Paragraph, Divider, IconButton } from 'react-native-paper';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import AppHeader from '../components/AppHeader';

import {EXPO_APP_BACKEND_URL} from "@env"

const ProductDetails = ({ route }) => {
  const { product } = route.params;
  const { addToCart, updateQuantity, cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product._id); // or product.id

  const [added, setAdded] = useState(false);
  const [showQuantityControls, setShowQuantityControls] = useState(false);

  const cartItem = cartItems.find((item) => item._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart({ ...product, id: product._id });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setShowQuantityControls(true);
    }, 1500);
  };

  const handleIncrement = () => {
    updateQuantity(product._id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(product._id, quantity - 1);
    if (quantity - 1 <= 0) {
      setShowQuantityControls(false);
    }
  };

  useEffect(() => {
    if (quantity > 0) {
      setShowQuantityControls(true);
    } else {
      setShowQuantityControls(false);
    }
  }, [quantity]);

  return (
    <ScrollView style={styles.container}>
      <AppHeader title="Details" />
      <Image source={{ uri: `${EXPO_APP_BACKEND_URL}/images/product-images/${product.image}` }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Title style={styles.title}>{product.name}</Title>
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            iconColor="#4caf50"
            style={{ backgroundColor: "#e0dede" }}
            onPress={() => {
              isFavorite ? removeFromWishlist(product._id) : addToWishlist(product);
            }}
          />
        </View>
        <Text style={styles.price}>{product.price}</Text>
        <Divider style={{ marginVertical: 10 }} />
        <Paragraph>
          Fresh and high-quality {product.name} available now! Perfect for your daily grocery needs.
        </Paragraph>

        {showQuantityControls ? (
          <View style={styles.quantityControls}>
            <IconButton icon="minus" style={{ backgroundColor: "#e0dede", borderRadius: 10 }} iconColor="#4caf50" size={24} onPress={handleDecrement} />
            <Text style={styles.quantityText}>{quantity}</Text>
            <IconButton icon="plus" style={{ backgroundColor: "#e0dede", borderRadius: 10 }} iconColor="#4caf50" size={24} onPress={handleIncrement} />
          </View>
        ) : (
          <Button
            mode="contained"
            style={[styles.button, { backgroundColor: added ? '#2aa52f' : '#4caf50' }]}
            textColor="#ffffff"
            onPress={handleAddToCart}
          >
            {added ? 'Added' : 'Add to Cart'}
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  image: {
    width: 350,
    height: 350,
    alignSelf: 'center',
    borderRadius: 20,
    marginVertical: 20,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
  quantityControls: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },

});

export default ProductDetails;
