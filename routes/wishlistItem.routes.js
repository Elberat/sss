// routes/wishlistItem.routes.js
const { Router } = require('express')
const { WishList, WishListItem, Product } = require('../models')

const router = Router()

/**
 * @swagger
 * tags:
 *   name: WishListItem
 *   description: Управление товарами (items) в вишлисте
 */

/**
 * @swagger
 * /users/{userId}/wishlist/items:
 *   get:
 *     summary: Получить все товары в вишлисте
 *     tags: [WishListItem]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Массив WishListItem
 */
router.get('/:userId/wishlist/items', async (req, res) => {
  try {
    const { userId } = req.params
    const wishList = await WishList.findOne({ where: { userId } })
    if (!wishList) {
      return res.status(404).json({ message: 'WishList not found' })
    }
    const items = await WishListItem.findAll({
      where: { wishListId: wishList.id },
      include: [Product]
    })
    res.json(items)
  } catch (error) {
    console.error('Error fetching wishlist items:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}/wishlist/items:
 *   post:
 *     summary: Добавить товар в вишлист
 *     tags: [WishListItem]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       description: ID продукта, который добавляем
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item создан
 */
router.post('/:userId/wishlist/items', async (req, res) => {
  try {
    const { userId } = req.params
    const { productId } = req.body

    const wishList = await WishList.findOne({ where: { userId } })
    if (!wishList) {
      return res.status(404).json({ message: 'WishList not found' })
    }

    const newItem = await WishListItem.create({
      wishListId: wishList.id,
      productId
    })

    res.status(201).json(newItem)
  } catch (error) {
    console.error('Error adding item to wishlist:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}/wishlist/items/{itemId}:
 *   get:
 *     summary: Получить конкретный элемент вишлиста
 *     tags: [WishListItem]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: WishListItem
 *       404:
 *         description: Item not found
 */
router.get('/:userId/wishlist/items/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params
    const wishList = await WishList.findOne({ where: { userId } })
    if (!wishList) {
      return res.status(404).json({ message: 'WishList not found' })
    }

    const item = await WishListItem.findByPk(itemId, {
      include: [Product]
    })
    if (!item || item.wishListId !== wishList.id) {
      return res.status(404).json({ message: 'Item not found' })
    }

    res.json(item)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}/wishlist/items/{itemId}:
 *   patch:
 *     summary: Обновить элемент вишлиста (если есть поля, например status)
 *     tags: [WishListItem]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Поля для обновления (напр. status)
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "received"
 *     responses:
 *       200:
 *         description: Обновленный элемент
 *       404:
 *         description: Item not found
 */
router.patch('/:userId/wishlist/items/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params
    const { status } = req.body

    const wishList = await WishList.findOne({ where: { userId } })
    if (!wishList) {
      return res.status(404).json({ message: 'WishList not found' })
    }

    const item = await WishListItem.findByPk(itemId)
    if (!item || item.wishListId !== wishList.id) {
      return res.status(404).json({ message: 'Item not found' })
    }

    if (status !== undefined) {
      item.status = status
    }

    await item.save()
    res.json(item)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}/wishlist/items/{itemId}:
 *   delete:
 *     summary: Удалить товар из вишлиста
 *     tags: [WishListItem]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed
 *       404:
 *         description: Item not found
 */
router.delete('/:userId/wishlist/items/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params
    const wishList = await WishList.findOne({ where: { userId } })
    if (!wishList) {
      return res.status(404).json({ message: 'WishList not found' })
    }

    const item = await WishListItem.findByPk(itemId)
    if (!item || item.wishListId !== wishList.id) {
      return res.status(404).json({ message: 'Item not found' })
    }

    await item.destroy()
    res.json({ message: 'Item removed from wishlist' })
  } catch (error) {
    console.error('Error deleting item from wishlist:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
