import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { getProductsByCategory } from '../api/Product_API';
import AppHeader from '../components/AppHeader';
import ProductCard from '../components/ProductCard';

const ProductsPerCategory = () => {
    const route = useRoute();
    const { categoryId, categoryName } = route.params;

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProductsByCategory(categoryId);
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        fetchProducts();
    }, [categoryId]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <AppHeader title={categoryName} />
            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.itemWrapper}>
                        <ProductCard item={item} />
                    </View>
                )}
                numColumns={2}
                contentContainerStyle={products.length === 0 ? styles.emptyContainer : styles.contentContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>No products found in this category</Text>}
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
        margin: 10
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
});

export default ProductsPerCategory;
