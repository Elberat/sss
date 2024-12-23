// routes/merchant.routes.js
const { Router } = require('express')
const { Merchant, Product } = require('../models')

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Merchants
 *   description: Операции с мерчантами (магазинами)
 */

/**
 * @swagger
 * /merchants:
 *   get:
 *     summary: Получить список всех мерчантов
 *     tags: [Merchants]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по имени мерчанта
 *     responses:
 *       200:
 *         description: Список мерчантов
 */
router.get('/', async (req, res) => {
  try {
    const { search } = req.query
    let where = {}
    if (search) {
			// В Sequelize v6+: use Op.like
      const { Op } = require('sequelize')
      where = {
        name: { [Op.like]: `%${search}%` }
      }
    }
    const merchants = await Merchant.findAll({ where })
    res.json(merchants)
  } catch (error) {
    console.error('Error fetching merchants:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /merchants:
 *   post:
 *     summary: Создать мерчанта
 *     tags: [Merchants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *               img:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               address_link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Merchant created
 */
router.post('/', async (req, res) => {
  try {
    const {
			name,
			login,
			password,
			img,
			description,
			address,
			address_link
		} = req.body
    const newMerchant = await Merchant.create({
      name,
      login,
      password,
      img,
      description,
      address,
      address_link
    })
    res.status(201).json(newMerchant)
  } catch (error) {
    console.error('Error creating merchant:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /merchants/{merchantId}:
 *   get:
 *     summary: Получить одного мерчанта
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Merchant object
 *       404:
 *         description: Merchant not found
 *
 *   patch:
 *     summary: Обновить мерчанта
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: merchantId
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
 *               img:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               address_link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated merchant
 *       404:
 *         description: Merchant not found
 */

/**
 * @swagger
 * /merchants/{merchantId}:
 *   delete:
 *     summary: Удалить мерчанта
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Merchant deleted
 *       404:
 *         description: Merchant not found
 */
router
	.route('/:merchantId')
	.get(async (req, res) => {
  try {
    const { merchantId } = req.params
    const merchant = await Merchant.findByPk(merchantId)
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' })
    }
    res.json(merchant)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})
	.patch(async (req, res) => {
  try {
    const { merchantId } = req.params
    const { name, img, description, address, address_link } = req.body
    const merchant = await Merchant.findByPk(merchantId)
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' })
    }

    if (name !== undefined) merchant.name = name
    if (img !== undefined) merchant.img = img
    if (description !== undefined) merchant.description = description
    if (address !== undefined) merchant.address = address
    if (address_link !== undefined) { merchant.address_link = address_link }

    await merchant.save()
    res.json(merchant)
  } catch (error) {
    console.error('Error updating merchant:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
	.delete(async (req, res) => {
  try {
    const { merchantId } = req.params
    const merchant = await Merchant.findByPk(merchantId)
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' })
    }
    await merchant.destroy()
    res.json({ message: 'Merchant deleted' })
  } catch (error) {
    console.error('Error deleting merchant:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /merchants/{merchantId}/products:
 *   get:
 *     summary: Получить все продукты конкретного мерчанта
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Список продуктов
 */
router.get('/:merchantId/products', async (req, res) => {
  try {
    const { merchantId } = req.params
    const merchant = await Merchant.findByPk(merchantId, {
      include: [Product]
    })
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' })
    }
    res.json(merchant.products)
  } catch (error) {
    console.error('Error fetching merchant products:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
