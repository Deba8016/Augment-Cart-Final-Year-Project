import express from 'express'
import multer from 'multer';
import Product from '../model/Product.js'
import Category from '../model/Category.js';

const router = express.Router();
const storage = multer.memoryStorage();

const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images/product-images");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const productUpload = multer({ storage: productStorage });

// Get products
router.get("/latest", async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt'; // default field
    const order = req.query.order === 'asc' ? 1 : -1; // asc = 1, desc = -1

    try {
        const products = await Product.find()
            .sort({ [sortBy]: order }) // dynamic field sorting
            .limit(limit);

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching sorted products:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
});


// Add Product
router.post("/addProduct", productUpload.single("image"), async (req, res) => {
    try {
        const category = await Category.findOne({ name: req.body.category });
        if (!category) {
            return res.status(400).json("Category does not exist");
        }

        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            category: category._id,
            image: req.file.originalname,
            categoryName: category.name,
        });

        await product.save();
        res.status(201).json("Product Successfully Inserted");
    } catch (error) {
        res.status(500).json("Error While Adding Product");
    }
});


// Get Product by ID
router.get("/getProduct/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(`PRODUCTID:${productId}`)
        const product = await Product.findById(productId); // Fetch product from the database using productId
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product); // Return product details as JSON
    } catch (error) {
        console.error("Error while fetching product:", error);
        res.status(500).json({ message: "Error while fetching product" });
    }
});

// Get Products by Category ID
router.get("/getProductsByCategory/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const products = await Product.find({ category: categoryId });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found for this category" });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("Error while fetching products by category:", error);
        res.status(500).json({ message: "Server error while fetching products" });
    }
});


// Update Product
router.put("/updateProduct/:id", productUpload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, price, discountPrice, description, sold, category, brand,
            stockQuantity, rating, sku
        } = req.body;
        let image;

        // Check if an image file is uploaded
        if (req.file) {
            image = req.file.originalname; // Use the new uploaded image if provided
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json("Product Not Found");
        }

        // Update fields if they are provided, otherwise retain current values
        product.name = name || product.name;
        product.price = price || product.price;
        product.discountPrice = discountPrice || product.discountPrice;
        product.description = description || product.description;
        product.sold = sold || product.sold; // Handle sold field
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.stockQuantity = stockQuantity || product.stockQuantity;
        product.rating = rating || product.rating;
        product.sku = sku || product.sku;

        // If a new image is uploaded, update the image field
        if (image) {
            product.image = image;
        }

        await product.save(); // Save updated product
        res.status(200).json("Product Successfully Updated");
    } catch (error) {
        console.error("Error While Updating Product:", error);
        res.status(500).json("Error While Updating Product");
    }
});

// Delete Product
router.delete("/deleteProduct/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) {
            res.status(200).json("Product Successfully Deleted");
        } else {
            res.status(404).json("Product Not Found");
        }
    } catch (error) {
        res.status(500).json("Error While Deleting Product");
    }
});


//Searchbar 
router.get('/search', async (req, res) => {
    const { q } = req.query;
    console.log("Q: ", q);

    if (!q) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        const results = await Product.aggregate([
            {
                $search: {
                    index: 'default',
                    text: {
                        query: q,
                        path: ['name', 'price', 'categoryName'], // Only product fields now
                        fuzzy: {
                            maxEdits: 2,
                            prefixLength: 1,
                        },
                    },
                },
            },
            {
                $limit: 20,
            },
        ]);
console.log(results)
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Search failed' });
    }
});

// For UNITY:
router.get("/getAllProducts", async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products
        res.status(200).json(products); // Return the products as JSON
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
});


// 
export default router;




