// routes/wishlist.routes.js
const { Router } = require('express')
const { WishList, WishListItem, Product } = require('../models')

const router = Router()

/**
 * @swagger
 * tags:
 *   name: WishList
 *   description: Операции с вишлистом пользователя
 */

/**
 * @swagger
 * /users/{userId}/wishlist:
 *   get:
 *     summary: Получить вишлист пользователя (вместе с товарами)
 *     tags: [WishList]
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: ID пользователя, к которому привязан вишлист
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Возвращает объект вишлиста и связанные WishListItem (+ Product)
 *       404:
 *         description: WishList not found
 */
router.get('/:userId/wishlist', async (req, res) => {
  try {
    const { userId } = req.params
    const wishList = await WishList.findOne({
      where: { userId },
      include: [
        {
          model: WishListItem,
          include: [Product]
        }
      ]
    })
    if (!wishList) {
      return res.status(404).json({ message: 'WishList not found' })
    }
    res.json(wishList)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}/wishlist:
 *   post:
 *     summary: Создать вишлист для пользователя
 *     tags: [WishList]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Вишлист создан
 *       409:
 *         description: Вишлист уже существует
 */
router.post('/:userId/wishlist', async (req, res) => {
  try {
    const { userId } = req.params
		// Проверяем, нет ли уже вишлиста
    const existing = await WishList.findOne({ where: { userId } })
    if (existing) {
      return res.status(409).json({ message: 'WishList already exists' })
    }
    const newWishList = await WishList.create({ userId })
    res.status(201).json(newWishList)
  } catch (error) {
    console.error('Error creating wishlist:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}/wishlist:
 *   patch:
 *     summary: Обновить вишлист (поля, если есть)
 *     tags: [WishList]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Обновленный вишлист
 *       404:
 *         description: WishList not found
 */
router.patch('/:userId/wishlist', async (req, res) => {
  try {
    const { userId } = req.params
    const { title, isPublic } = req.body

    const wishList = await WishList.findOne({ where: { userId } })
    if (!wishList) {
      return res.status(404).json({ message: 'WishList not found' })
    }

		// Если у вас действительно есть такие поля
    if (title !== undefined) {
      wishList.title = title
    }
    if (isPublic !== undefined) {
      wishList.isPublic = isPublic
    }

    await wishList.save()
    res.json(wishList)
  } catch (error) {
    console.error('Error updating wishlist:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}/wishlist:
 *   delete:
 *     summary: Удалить вишлист пользователя
 *     tags: [WishList]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: WishList deleted
 *       404:
 *         description: WishList not found
 */
router.delete('/:userId/wishlist', async (req, res) => {
  try {
    const { userId } = req.params
    const wishList = await WishList.findOne({ where: { userId } })
    if (!wishList) {
      return res.status(404).json({ message: 'WishList not found' })
    }
    await wishList.destroy()
    res.json({ message: 'WishList deleted' })
  } catch (error) {
    console.error('Error deleting wishlist:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
