//db.js
import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";

const Connection = async () => {
    const URL = process.env.MONGODB_URI;
    
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB Connected');
    } catch (error) {
        console.log('Error While Connecting Database', error);
    }
}

export default Connection;
