const sequelize = require('../db')
const { DataTypes } = require('sequelize')

// === 1. USER ===
const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  date_of_birth: { type: DataTypes.DATEONLY, allowNull: true },
  img: { type: DataTypes.STRING, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: false }
})

// === 2. WISHLIST ===
const WishList = sequelize.define('wishList', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

// === 3. WISHLIST ITEM ===
const WishListItem = sequelize.define('wishListItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

// === 4. MERCHANT ===
const Merchant = sequelize.define('merchant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  login: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: true },
  address_link: { type: DataTypes.STRING, allowNull: true }
})

// === 5. PRODUCT ===
const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false }
})

// === 6. SUBSCRIPTION ===
const Subscription = sequelize.define('subscription', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

// Связи
User.hasOne(WishList, { foreignKey: 'userId' })
WishList.belongsTo(User, { foreignKey: 'userId' })

WishList.hasMany(WishListItem, { foreignKey: 'wishListId' })
WishListItem.belongsTo(WishList, { foreignKey: 'wishListId' })

Product.hasMany(WishListItem, { foreignKey: 'productId' })
WishListItem.belongsTo(Product, { foreignKey: 'productId' })

Merchant.hasMany(Product, { foreignKey: 'merchantId' })
Product.belongsTo(Merchant, { foreignKey: 'merchantId' })

User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' })
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'subscriber' })

User.hasMany(Subscription, {
  foreignKey: 'subscribedToUserId',
  as: 'subscribers'
})
Subscription.belongsTo(User, {
  foreignKey: 'subscribedToUserId',
  as: 'subscribedTo'
})

module.exports = {
  sequelize,
  User,
  WishList,
  WishListItem,
  Merchant,
  Product,
  Subscription
}
