import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Card, Button } from 'react-native-paper';
import { getUserOrders } from '../api/Order_API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EXPO_APP_BACKEND_URL } from '@env';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../components/AppHeader';

const OrderScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const { addMultipleToCart, clearCart } = useCart();
    const navigation = useNavigation();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = jwtDecode(await AsyncStorage.getItem('userToken'));
                const userId = token.id;

                if (userId) {
                    const data = await getUserOrders(userId);
                    setOrders(data);
                }
            } catch (error) {
                console.error('Error loading orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const renderProductItem = (productItem, index) => {
        const { product, quantity } = productItem;
        if (!product) return null;

        return (
            <Card key={index} style={styles.productCard}>
                <Card.Content style={styles.productContent}>
                    <Image
                        source={{ uri: `${EXPO_APP_BACKEND_URL}/images/product-images/${product.image}` }}
                        style={styles.productImage}
                    />
                    <View style={styles.productInfo}>
                        <Text variant="titleMedium">{product.name}</Text>
                        <Text variant="bodySmall">Price: ₹{product.price}</Text>
                        <Text variant="bodySmall">Qty: {quantity}</Text>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    const renderOrderItem = ({ item }) => {
        const handleOrderAgain = () => {
            const formattedItems = item.products.map(({ product, quantity }) => ({
                product,
                quantity
            }));
            clearCart();
            addMultipleToCart(formattedItems);
            navigation.navigate('Cart');
        };

        return (
            <View style={styles.orderContainer}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderTitle}>Order ID: {item._id}</Text>
                    <Button mode="outlined" onPress={handleOrderAgain} style={styles.orderAgainButton}>
                        Order Again
                    </Button>
                </View>
                <Text style={styles.orderTotal}>Total: ₹{item.totalAmount}</Text>
                {item.products.map(renderProductItem)}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
        <AppHeader title="My Orders" />
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#4caf50" />
                        <Text>Loading Orders...</Text>
                    </View>
                ) : orders.length === 0 ? (
                    <View style={styles.loader}>
                        <Text style={styles.emptyText}>No orders found.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={orders}
                        keyExtractor={(item) => item._id}
                        renderItem={renderOrderItem}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: -50
    },
    container: {
        flex: 1,
        padding: 12,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
    },
    listContent: {
        paddingBottom: 20,
    },
    orderContainer: {
        marginBottom: 24,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 10,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    orderTitle: {
        fontWeight: 'bold',
    },
    orderTotal: {
        marginBottom: 10,
        fontWeight: '600',
    },
    productCard: {
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    productContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
    },
    orderAgainButton: {
        borderColor: '#4caf50',
    },
});

export default OrderScreen;
