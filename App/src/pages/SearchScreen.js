import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { searchProducts } from '../api/Product_API';
import ProductCard from '../components/ProductCard';

const SearchScreen = () => {
    const route = useRoute();
    const inputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (route.params?.autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [route.params]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const data = await searchProducts(searchQuery);
            setResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <Searchbar
                    ref={inputRef}
                    placeholder="Search products..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    style={styles.searchBar}
                />

                {loading ? (
                    <View style={{ flex: 1, alignSelf: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" style={styles.loader} color={"#4caf50"} />
                        <Text>Searching Products...</Text>
                    </View>
                ) : (
                    
                        <FlatList
                            data={results}
                            keyExtractor={(item) => item._id}
                            numColumns={2}
                            renderItem={({ item }) => <ProductCard item={item} />}
                            ListEmptyComponent={<Text style={styles.noResults}>No products found.</Text>}
                        />
                    
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    searchBar: {
        marginBottom: 12,
    },
    loader: {
        marginTop: 30,
    },
    noResults: {
        textAlign: 'center',
        marginTop: 40,
        color: '#888',
    },
});

export default SearchScreen;
