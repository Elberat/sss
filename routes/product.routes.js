// routes/product.routes.js
const { Router } = require('express')
const { Product } = require('../models')

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Операции с товарами
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Список всех товаров (с возможностью поиска)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по названию
 *     responses:
 *       200:
 *         description: Массив продуктов
 */
router.get('/', async (req, res) => {
  try {
    const { search } = req.query
    let where = {}
    if (search) {
      const { Op } = require('sequelize')
      where = {
        name: { [Op.like]: `%${search}%` }
      }
    }
    const products = await Product.findAll({ where })
    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Создать новый продукт
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               img:
 *                 type: string
 *               price:
 *                 type: integer
 *               merchantId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Продукт создан
 */
router.post('/', async (req, res) => {
  try {
    const { name, description, img, price, merchantId } = req.body
    const newProduct = await Product.create({
      name,
      description,
      img,
      price,
      merchantId
    })
    res.status(201).json(newProduct)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Получить продукт по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Продукт
 *       404:
 *         description: Product not found
 *
 *   patch:
 *     summary: Обновить данные продукта
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               img:
 *                 type: string
 *               price:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Продукт обновлён
 *       404:
 *         description: Product not found
 *
 *   delete:
 *     summary: Удалить продукт
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Продукт удален
 */
router
	.route('/:productId')
	.get(async (req, res) => {
  try {
    const { productId } = req.params
    const product = await Product.findByPk(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})
	.patch(async (req, res) => {
  try {
    const { productId } = req.params
    const { name, description, img, price } = req.body
    const product = await Product.findByPk(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    if (name !== undefined) product.name = name
    if (description !== undefined) product.description = description
    if (img !== undefined) product.img = img
    if (price !== undefined) product.price = price
    await product.save()
    res.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
	.delete(async (req, res) => {
  try {
    const { productId } = req.params
    const product = await Product.findByPk(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    await product.destroy()
    res.json({ message: 'Product deleted' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
