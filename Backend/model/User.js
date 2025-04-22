import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    address: {type: String, default: null},
    mobile: String,
    image : {type: String, default: "default"}
});

const User = mongoose.model('User', userSchema);

export default User;