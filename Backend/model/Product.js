import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: String,
    price: String,
    image: String,
    sold: {type: Number, default: 0},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    categoryName: String,


});

const Product = mongoose.model('Product', productSchema);

export default Product;