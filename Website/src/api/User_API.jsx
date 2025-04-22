import axios from "axios";


const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/user`
// console.log(URL)

// Add User
export const addUser = async (data) => {
    try {
        return await axios.post(`${URL}/addUser`, data);
    } catch (error) {
        console.error('Error While Connecting API:', error);
        return error.response ? error.response : { message: 'Unknown error occurred' };
    }
};

// Login user function
export const loginUser = async ({ username, password }) => {
    try {
        const response =  await axios.post(`${URL}/loginUser`, { username, password });
        console.log(response)
        return response;
    } catch (error) {
        console.error('Error While Connecting API:', error);
        return error.response ? error.response : { message: 'Unknown error occurred' };
    }
};


export const updateUser = async (id, userData) => {
    try {
        console.log("API:", userData)
        const response = await axios.put(`${URL}/updateUser/${id}`, userData 
            
        );
        return response.data;
    } catch (error) {
        console.error('Error updating user', error);
        throw error;
    }
};


// Fetch User
// Fetch user details by userId
export const getUser = async (userId) => {
    try {
        const response = await axios.get(`${URL}/getUser/${userId}`); // Pass the userId in the URL
        return response.data; // Return the user details
    } catch (error) {
        console.error('Error while fetching user:', error);
        return null; // Return null on error
    }
};

