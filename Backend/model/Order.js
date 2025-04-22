import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    _id: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Product ID
      quantity: { type: Number, required: true } // Quantity
    }
  ],
    totalAmount: Number,
    orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

export default Order