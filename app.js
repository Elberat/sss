// app.js
const express = require('express')
const cors = require('cors') // если нужно
const userRoutes = require('./routes/user.routes')
const wishlistRoutes = require('./routes/wishlist.routes')
const wishlistItemRoutes = require('./routes/wishlistItem.routes')
const merchantRoutes = require('./routes/merchant.routes')
const productRoutes = require('./routes/product.routes')
const subscriptionRoutes = require('./routes/subscription.routes')

const { swaggerUi, swaggerSpec } = require('./swagger')

const app = express()

app.use(cors()) // Разрешить CORS (если нужно)
app.use(express.json()) // Парсинг JSON тела

// Подключаем роуты
app.use('/users', userRoutes) // /users
app.use('/users', wishlistRoutes) // /users/:userId/wishlist
app.use('/users', wishlistItemRoutes) // /users/:userId/wishlist/items
app.use('/merchants', merchantRoutes) // /merchants
app.use('/products', productRoutes) // /products
app.use('/users', subscriptionRoutes) // /users/:userId/subscriptions ...

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

module.exports = app
