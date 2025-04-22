import axios from "axios";
const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/category`;
console.log(URL);

export const getCategories = async() =>{
    try {
        const response = await axios.get(`${URL}/categories`);
        
        return Array.isArray(response.data) ? response.data : [];
    }
    catch(error){
        console.error('Error While Fetching Categories:', error);
        return []; // Return an empty array on error
    }
}