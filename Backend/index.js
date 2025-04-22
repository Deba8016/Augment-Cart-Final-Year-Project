//index.js
import express from 'express'
import cors from 'cors';
import Connection from './db.js';
import categoryRoutes from './routes/Category.js'
import productRoutes from './routes/Products.js'
import userRoutes from './routes/User.js'
import orderRoutes from './routes/Orders.js'
import cartRoutes from './routes/Cart.js'


const app = express()
const PORT = 8000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
Connection()

app.use('/category', categoryRoutes)
app.use('/products', productRoutes)
app.use('/user', userRoutes)
app.use('/orders', orderRoutes)
app.use('/cart', cartRoutes)
app.use('/images/category-logo', express.static('images/category-logo'))
app.use('/images/product-images', express.static('images/product-images', {
    setHeaders: (res, path) => {
        if (path.endsWith('.png')) {
            res.set('Content-Type', 'image/png');
        }
    }
}));
app.use('/images/user-images', express.static('images/user-images'))

app.listen(PORT, () => console.log(`Server Running On Port Number ${PORT}`))