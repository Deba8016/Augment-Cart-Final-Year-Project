import express from "express";
import mongoose from "mongoose";
import Order from "../model/Order.js"
import Product from "../model/Product.js"
const router = express.Router();



// Create Order
router.post("/createOrder", async (req, res) => {
    const { paymentId, products, totalAmount, userId, date, time } = req.body;
    
  
    try {
      // Map the product objects without converting _id, as they are already valid ObjectId strings
      const formattedProducts = products.map((item) => {
        return {
          product: item.product, // Use the _id directly as it's already an ObjectId string
          quantity: item.quantity,
        };
      });
      // Convert userId to ObjectId if necessary
      const order = new Order({
        _id: req.body.paymentID,
        paymentID: req.body.paymentID,
        user: req.body.user, // Convert userId to ObjectId
        products: formattedProducts, // Correctly formatted products array
        totalAmount: totalAmount,
      });
      // console.log(order);
  
      await order.save();
  
      // Increment sold quantity for each product
      for (const item of formattedProducts) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { sold: item.quantity }, // Increment the sold field by quantity
        });
      }
  
      res.status(201).json("Order created successfully");
    } catch (error) {
      console.error("Error while creating order:", error.message);
      res.status(500).json("Error while creating order");
    }
  });
  
  // Get Order by userId
  router.get("/userOrders/:userId", async (req, res) => {
    const userId = req.params.userId;
    // console.log("User ID:", userId);
  
    try {
      // Convert userId to ObjectId
      const userObjectId = new mongoose.Types.ObjectId(userId);
  
      // Fetch all orders for the given user ID
      const orders = await Order.find({ user: userObjectId })
         // Populate user data if necessary
         .sort({ orderDate: -1 })
        .populate({
          path: "products", // Assuming 'products' is an array of ObjectId references to 'Product'
          populate: {
            path: "product", // Populate the individual products within the array
            select: "name price image" // Only include these fields from the product
          }
        });
  
      //console.log("Orders found:", orders);
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      res.status(500).json("Error fetching orders");
    }
  });
  
  // Get Orders
  router.get("/orders", async (req, res) => {
    try {
      const orders = await Order.find().populate("user").populate("products.product"); 
      // console.log(orders)// Fetch categories from the database
      res.status(200).json(orders); // Return categories as JSON (this is already an array)
    } catch (error) {
      console.error("Error While Fetching Orders:", error);
      res.status(500).json({ message: "Error While Fetching Orders" });
    }
  });

  export default router;