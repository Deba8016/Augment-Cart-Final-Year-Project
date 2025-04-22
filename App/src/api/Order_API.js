import axios from "axios";

import {EXPO_APP_BACKEND_URL} from "@env";

const URL = `${EXPO_APP_BACKEND_URL}/orders`

//Create Order
export const createOrder = async (orderData) => {
    try {
        console.log("RESULT RZP:", orderData)
        const result = await axios.post(`${URL}/createOrder`, orderData);
        return result.data;
    } catch (error) {
        console.error('Error while creating order:', error);
        throw error;
    }
};

//fetch order
export const getUserOrders = async (userId) => {
    // //console.log(userId);
    try {
        // console.log(userId);
        const response = await axios.get(`${URL}/userOrders/${userId}`);
        
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};

