// routes/user.routes.js
const { Router } = require('express')
const { User, WishList } = require('../models')

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Операции для работы с пользователями
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: qwerty123
 *         date_of_birth:
 *           type: string
 *           format: date
 *           example: 1990-01-01
 *         img:
 *           type: string
 *           nullable: true
 *           example: http://example.com/avatar.png
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, password, date_of_birth, img } = req.body

    const newUser = await User.create({
      name,
      email,
      password,
      date_of_birth,
      img
    })

		// Автоматически создаем вишлист
    await WishList.create({ userId: newUser.id })

    res.status(201).json(newUser)
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Объект пользователя (без пароля)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     summary: Обновить данные пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       description: Поля для обновления (name, email, date_of_birth, img и т.д.)
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Объект пользователя после обновления
 *       404:
 *         description: Пользователь не найден
 */
router.patch('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { name, email, date_of_birth, img } = req.body

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (name !== undefined) user.name = name
    if (email !== undefined) user.email = email
    if (date_of_birth !== undefined) user.date_of_birth = date_of_birth
    if (img !== undefined) user.img = img

    await user.save()
    res.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Удалить пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь удален
 *       404:
 *         description: Пользователь не найден
 */
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    await user.destroy()
    res.json({ message: 'User deleted' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
