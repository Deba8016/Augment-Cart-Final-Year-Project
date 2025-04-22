import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
    Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUser, getUser } from '../api/User_API';
import { jwtDecode } from 'jwt-decode';
import AppHeader from '../components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileImage from '../components/ProfileImage';
import { EXPO_APP_BACKEND_URL } from '@env';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageViewing from 'react-native-image-viewing';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
    const navigation = useNavigation();

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        address: '',
        image: '',
    });
    const [originalUserData, setOriginalUserData] = useState(null);
    const [userId, setUserId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [forceRerenderKey, setForceRerenderKey] = useState(0);

    useEffect(() => {
        const loadUser = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const decoded = jwtDecode(token);
                setUserId(decoded.id);
                const userFromDB = await getUser(decoded.id);
                const parsedUser = {
                    firstName: userFromDB.name?.split(' ')[0] || '',
                    lastName: userFromDB.name?.split(' ')[1] || '',
                    email: userFromDB.email || '',
                    mobile: userFromDB.mobile || '',
                    address: userFromDB.address || '',
                    image: userFromDB.image || 'default',
                };
                setUserData(parsedUser);
                setOriginalUserData(parsedUser);
            }
        };
        loadUser();
    }, []);

    const hasChanges = () => {
        if (!originalUserData) return false;
        return (
            userData.firstName !== originalUserData.firstName ||
            userData.lastName !== originalUserData.lastName ||
            userData.email !== originalUserData.email ||
            userData.mobile !== originalUserData.mobile ||
            userData.address !== originalUserData.address ||
            JSON.stringify(userData.image) !== JSON.stringify(originalUserData.image)
        );
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.5,
            base64: true,
            aspect: [1, 1]
        });

        if (!result.canceled) {
            const selectedAsset = result.assets[0];

            setUserData((prev) => ({
                ...prev,
                image: {
                    uri: selectedAsset.uri,
                    base64: selectedAsset.base64,
                    type: selectedAsset.type || 'image/jpeg',
                },
            }));
            setForceRerenderKey(prev => prev + 1);
        }

        setModalVisible(false);
    };

    const handleUpdate = async () => {
        const payload = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            mobile: userData.mobile,
            address: userData.address,
        };

        if (userData.image === 'default') {
            payload.image = 'default';
        } else if (typeof userData.image === 'object') {
            payload.image = userData.image.base64;
            payload.imageType = userData.image.type || 'image/jpeg';
        }

        try {
            const res = await updateUser(userId, payload);
            Alert.alert('Success', res);

            const updatedUser = {
                ...userData,
                image:
                    userData.image === 'default'
                        ? 'default'
                        : typeof userData.image === 'object'
                        ? res.filename || userData.image.uri.split('/').pop()
                        : userData.image,
            };

            setUserData(updatedUser);
            setOriginalUserData(updatedUser);

            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Could not update user');
        }
    };

    const handleDeleteImage = () => {
        setUserData((prev) => ({
            ...prev,
            image: 'default',
        }));
        setModalVisible(false);
    };

    const getImageUri = () => {
        if (!userData.image || userData.image === 'default') return null;
        if (typeof userData.image === 'object') return userData.image.uri;
        return `${EXPO_APP_BACKEND_URL}/images/user-images/${userData.image}`;
    };
    

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Profile" rightComponent={null} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity
                    style={styles.profileImageWrapper}
                    onPress={() => setModalVisible(true)}
                >
                    {!getImageUri() ? (
                        <ProfileImage name={userData.firstName} size={120} />
                    ) : (
                        <Image
                            key={forceRerenderKey}
                            source={{ uri: getImageUri() }}
                            style={styles.avatar}
                        />
                    )}
                    <View style={styles.editIcon}>
                        <Icon name="pencil-circle" size={28} color="#4CAF50" />
                    </View>
                </TouchableOpacity>

                <TextInput
                    label="First Name"
                    mode="outlined"
                    value={userData.firstName}
                    onChangeText={(text) => setUserData({ ...userData, firstName: text })}
                    style={styles.input}
                />
                <TextInput
                    label="Last Name"
                    mode="outlined"
                    value={userData.lastName}
                    onChangeText={(text) => setUserData({ ...userData, lastName: text })}
                    style={styles.input}
                />
                <TextInput
                    label="Mobile"
                    mode="outlined"
                    value={userData.mobile}
                    onChangeText={(text) => setUserData({ ...userData, mobile: text })}
                    style={styles.input}
                    keyboardType="phone-pad"
                />
                <TextInput
                    label="Address"
                    mode="outlined"
                    value={userData.address}
                    onChangeText={(text) => setUserData({ ...userData, address: text })}
                    style={styles.input}
                />

                {hasChanges() && (
                    <Button mode="contained" onPress={handleUpdate} style={styles.button}>
                        Save Changes
                    </Button>
                )}
            </ScrollView>

            {/* Bottom Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Button icon="image-edit" onPress={pickImage}>
                            Change Photo
                        </Button>
                        {getImageUri() && (
                            <>
                                <Button
                                    icon="image"
                                    onPress={() => {
                                        setModalVisible(false);
                                        setImageViewerVisible(true);
                                    }}
                                >
                                    View Image
                                </Button>
                                <Button icon="delete" onPress={handleDeleteImage} textColor="red">
                                    Delete Photo
                                </Button>
                            </>
                        )}
                        <Button onPress={() => setModalVisible(false)}>Cancel</Button>
                    </View>
                </View>
            </Modal>

            {/* Fullscreen Image Viewer */}
            <ImageViewing
                images={[{ uri: getImageUri() }]}
                imageIndex={0}
                visible={imageViewerVisible}
                onRequestClose={() => setImageViewerVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: -25,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: 'cover',
    },
    input: {
        marginBottom: 12,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#4CAF50',
    },
    profileImageWrapper: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 20,
        marginTop: -10,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#00000055',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
});

export default ProfileScreen;
