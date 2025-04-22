import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Card, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { EXPO_APP_BACKEND_URL } from "@env"

const ProductCard = ({ item }) => {
  const [added, setAdded] = useState(false);
  const navigation = useNavigation();
  const { addToCart, updateQuantity, cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(item._id); // or product.id

  const cartItem = cartItems.find((cart) => cart.id === item._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart({ ...item, id: item._id });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleIncrement = () => updateQuantity(item._id, quantity + 1);
  const handleDecrement = () => updateQuantity(item._id, quantity - 1);

  useEffect(() => {
    if (quantity === 0) setAdded(false);
  }, [quantity]);

  return (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <View style={styles.imageContainer}>
        <Card.Cover source={{ uri: `${EXPO_APP_BACKEND_URL}/images/product-images/${item.image}` }} style={styles.image} />
        <IconButton
          icon={isFavorite ? 'heart' : 'heart-outline'}
          size={20}
          style={styles.wishlistIcon}
          iconColor="#4caf50"
          onPress={() => {
            isFavorite ? removeFromWishlist(item._id) : addToWishlist(item);
          }}
        />
      </View>

      <Card.Content>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.name}</Text>

        </View>
        <Text style={styles.price}>{item.price}</Text>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        {quantity > 0 ? (
          <View style={styles.quantityControls}>
            <IconButton icon="minus" style={{ backgroundColor: "#e0dede", borderRadius: 10 }} iconColor="#4caf50" onPress={handleDecrement} />
            <Text style={styles.quantityText}>{quantity}</Text>
            <IconButton icon="plus" style={{ backgroundColor: "#e0dede", borderRadius: 10 }} iconColor="#4caf50" onPress={handleIncrement} />
          </View>
        ) : (
          <Button
            mode="contained"
            compact
            buttonColor={added ? '#2aa52f' : '#4caf50'}
            textColor="#ffffff"
            onPress={handleAddToCart}
            style={styles.button}
          >
            {added ? 'Added' : 'Add'}
          </Button>
        )}
      </Card.Actions>
    </Card>


  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 285,
    marginRight: 20,
    marginBottom: 10,
  },
  image: {
    height: 150,

  },
  actions: {
    justifyContent: 'center',
  },
  button: {
    width: '100%',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: -1
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  titleRow: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginTop:10,
    marginBottom:2
  },
  price: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  imageContainer: {
    position: 'relative',
  },

  wishlistIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#e0dede',
    zIndex: 1,
  },


});

export default ProductCard;
