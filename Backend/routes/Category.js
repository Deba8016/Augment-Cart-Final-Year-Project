import express from 'express';
import multer from 'multer';
import Category from "../model/Category.js"

const router = express.Router();
const storage = multer.memoryStorage();

const categoryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images/category-logo");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const categoryUpload = multer({ storage: categoryStorage });


// Get Categories
router.get("/categories", async (req, res) => {
    try {
        const categories = await Category.find(); // Fetch categories from the database
        res.status(200).json(categories); // Return categories as JSON (this is already an array)
    } catch (error) {
        console.error("Error While Fetching Categories:", error);
        res.status(500).json({ message: "Error While Fetching Categories" });
    }
});


// Check if Category Exists
router.get("/checkCategory", async (req, res) => {
    const { categoryName } = req.query;
    try {
        const category = await Category.findOne({ name: categoryName });
        if (category) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        res.status(500).json("Error While Checking Category");
    }
});

// Add Category
router.post("/addCategory", categoryUpload.single("image"), async (req, res) => {
    try {
      const category = new Category({
        name: req.body.name,
        image: req.file.originalname,
      });
      await category.save();
      res.status(201).json("Category Successfully Inserted");
    } catch (error) {
      res.status(500).json("Error While Adding Category");
    }
  }
);

// Delete Category
router.delete("/deleteCategory/:id", async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (category) {
            res.status(200).json("Category Successfully Deleted");
        } else {
            res.status(404).json("Category Not Found");
        }
    } catch (error) {
        res.status(500).json("Error While Deleting Category");
    }
});

// Update Category
router.put("/updateCategory/:id", categoryUpload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        let image;

        // Check if an image file is uploaded
        if (req.file) {
            image = req.file.originalname; // Use new uploaded image if provided
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json("Category Not Found");
        }

        // Update fields
        category.name = name || category.name;
        if (image) {
            category.image = image;
        }

        await category.save(); // Save updated category
        res.status(200).json("Category Successfully Updated");
    } catch (error) {
        res.status(500).json("Error While Updating Category");
    }
}
);


export default router;