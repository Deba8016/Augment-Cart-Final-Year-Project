import Product from "../model/Product.js";
import Category from "../model/Category.js";
import { products } from "./products.js";
import Connection from "../db.js"; // import your connection function

async function uploadProducts() {
  try {
    await Connection(); // ✅ Wait for DB to connect before doing anything

    const productsWithCategoryIds = [];

    for (const product of products) {
      const categoryDoc = await Category.findOne({ name: product.category });

      if (!categoryDoc) {
        console.warn(`⚠️ Category "${product.category}" not found. Skipping ${product.name}`);
        continue;
      }

      productsWithCategoryIds.push({
        ...product,
        category: categoryDoc._id,
      });
    }

    await Product.insertMany(productsWithCategoryIds);
    console.log('✅ Products uploaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading products:', error);
    process.exit(1);
  }
}

uploadProducts();
