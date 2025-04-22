import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Text, Button, Card, IconButton } from 'react-native-paper';
import { useCart } from '../context/CartContext';
import AppHeader from '../components/AppHeader';
import { EXPO_APP_BACKEND_URL, EXPO_APP_RAZORPAY_KEY_ID } from "@env"
import RazorpayCheckout from 'react-native-razorpay'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { getUser } from '../api/User_API';
import { createOrder } from '../api/Order_API';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
    const navigation = useNavigation();
    const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
    const [userInfo, setUserInfo] = useState("")
    useEffect(() => {
        const getDecodedToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    const decoded = jwtDecode(token)
                    const userFromDB = await getUser(decoded.id);
                    setUserInfo(userFromDB);
                    // console.log("PROFILE IMAGE Cart:", userInfo)
                } else {
                    console.log('No token found');
                }
            } catch (err) {
                console.error('Error decoding token:', err);
            }
        };

        getDecodedToken();
    }, []);

    const handlePayment = () => {
        const totalInPaise = getTotal() * 100; // Razorpay expects amount in paise
        console.log(totalInPaise)
        const options = {
            description: 'Purchase from Augment Cart',
            image: '../../assets/icon.png',
            currency: 'INR',
            key: EXPO_APP_RAZORPAY_KEY_ID,
            amount: totalInPaise,
            name: 'Augment Cart',
            prefill: {
                email: userInfo?.email || '',
                contact: userInfo?.mobile || '',
                name: userInfo?.name || ''
            },
            theme: { color: '#4caf50' }
        };
        console.log("OPTIONS:", options)

        try {
            console.log("Opening Razorpay...");
            RazorpayCheckout.open(options)
                .then((data) => {
                    console.log("Razorpay success:", data);
                    const orderData = {
                        paymentID: data.razorpay_payment_id,
                        user: userInfo._id,
                        products: cartItems.map(item => ({
                            product: item._id,
                            quantity: item.quantity,
                        })),
                        totalAmount: getTotal(),
                    };
                    console.log("RESULT RZP:", orderData);
                    createOrder(orderData);
                    clearCart();
                    AsyncStorage.removeItem("cart")
                    navigation.navigate('Home', {
                        screen: 'HomeScreen',
                      });
                })
                .catch((error) => {
                    console.error("Razorpay failed:", error);
                });
        } catch (err) {
            console.error("Razorpay native crash or issue:", err);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <AppHeader
                title="Cart"
                rightComponent={cartItems.length > 0 ? (
                    <View>
                        <Button mode="contained" onPress={() => clearCart()} style={{ backgroundColor: '#4caf50', marginRight: 15 }}>
                            Clear Cart
                        </Button>
                    </View>
                ) : undefined}
            />
            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <View>
                        <Text style={styles.totalLabel}>Total Cart Amount:</Text>
                        <Text style={styles.totalValue}>₹{getTotal()}</Text>
                    </View>
                    <Button mode="contained" onPress={() => handlePayment()} style={{ backgroundColor: 'black' }}>
                        Proceed To Payment
                    </Button>

                </View>
            )}
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <View style={styles.cardContent}>
                            <View style={styles.imageWrapper}>
                                <Image
                                    source={{ uri: `${EXPO_APP_BACKEND_URL}/images/product-images/${item.image}` }}
                                    style={styles.image}
                                />
                                <IconButton
                                    icon="delete"
                                    iconColor="#4caf50"
                                    size={20}
                                    style={styles.deleteIcon}
                                    onPress={() => removeFromCart(item.id)}
                                />
                            </View>
                            <View style={styles.details}>

                                <Text style={styles.name}>{item.name}</Text>

                                <Text style={styles.price}>Price: {item.price}</Text>
                                <Card.Actions style={styles.quantityRow}>
                                    <IconButton
                                        icon="minus"
                                        iconColor="#4caf50"
                                        size={20}
                                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                    />
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <IconButton
                                        icon="plus"
                                        iconColor="#4caf50"
                                        size={20}
                                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                    />
                                </Card.Actions>
                            </View>
                        </View>
                    </Card>
                )}
                contentContainerStyle={cartItems.length === 0 ? styles.emptyContainer : styles.contentContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>🛒 Your cart is empty</Text>}
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
    card: {
        marginBottom: 10,
        marginHorizontal: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    totalBlock: {
        flex: 1,
        justifyContent: 'center',
    },
    totalLabel: {
        fontSize: 16,
        color: '#444',
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
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
        height: 150,
        borderRadius: 8,
        borderBottomLeftRadius: 8,
        // margin: 10
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
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 8,
        minWidth: 24,
        textAlign: 'center',
    },
    imageWrapper: {
        position: 'relative',
        width: 150,
        height: '100%',
        margin: 10,
    },

    deleteIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#e0dede',
        zIndex: 1,
    },


});

export default Cart;
