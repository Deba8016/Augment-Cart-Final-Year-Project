import express from "express";
import Product from "../model/Product.js";
const router = express.Router();

let unityCart = []
router.post('/', async (req, res) => {
    const cartData = req.body; // [{ _id, quantity, price }...]
    // console.log("🛒 Received Cart Data:", cartData);

    try {
        const enrichedCart = await Promise.all(
            cartData.map(async (item) => {
                const product = await Product.findById(item._id).select("-sold").lean();

                if (!product) {
                    console.warn(`Product not found for ID: ${item._id}`);
                    return null;
                }

                return {
                    ...product,
                    quantity: item.quantity
                };
            })
        );

        // Filter out nulls in case some products weren't found
        const validCart = enrichedCart.filter(item => item !== null);
        // console.log(validCart)
        unityCart = validCart
        console.log("UNITYCART", unityCart)
        res.status(200).json(validCart); // Send enriched cart
    } catch (err) {
        console.error("❌ Error enriching cart data:", err);
        res.status(500).json({ message: "Server error while processing cart" });
    }
});

router.get("/", async(req,res) =>{
    console.log("UNITYCART", unityCart)
    res.status(200).json(unityCart);
})

export default router;
