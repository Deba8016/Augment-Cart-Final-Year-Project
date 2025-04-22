import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: { type: String, unique: true, index: true },
    image: String,
});

const Category = mongoose.model('Category', categorySchema);

export default Category;