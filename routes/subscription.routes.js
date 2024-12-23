// routes/subscription.routes.js
const { Router } = require('express')
const { Subscription, User } = require('../models')

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Подписки пользователей друг на друга
 */

/**
 * @swagger
 * /users/{userId}/subscriptions:
 *   get:
 *     summary: Получить список, на кого данный userId подписан
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Массив подписок (userId -> subscribedToUserId)
 */
router.get('/:userId/subscriptions', async (req, res) => {
  try {
    const { userId } = req.params
    const subs = await Subscription.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'subscribedTo',
          attributes: ['id', 'name', 'email']
        }
      ]
    })
    res.json(subs)
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}/subscriptions:
 *   post:
 *     summary: Подписаться (userId подписывается на другого)
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: ID пользователя, на которого подписываемся
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscribedToUserId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Subscription created
 */
router.post('/:userId/subscriptions', async (req, res) => {
  try {
    const { userId } = req.params
    const { subscribedToUserId } = req.body

    if (Number(userId) === Number(subscribedToUserId)) {
      return res
				.status(400)
				.json({ message: 'Cannot subscribe to oneself' })
    }

    const newSub = await Subscription.create({
      userId,
      subscribedToUserId
    })
    res.status(201).json(newSub)
  } catch (error) {
    console.error('Error creating subscription:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}/subscribers:
 *   get:
 *     summary: Получить список подписчиков пользователя
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Массив подписок, где subscribedToUserId = userId
 */
router.get('/:userId/subscribers', async (req, res) => {
  try {
    const { userId } = req.params
    const subs = await Subscription.findAll({
      where: { subscribedToUserId: userId },
      include: [
        {
          model: User,
          as: 'subscriber',
          attributes: ['id', 'name', 'email']
        }
      ]
    })
    res.json(subs)
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /users/{userId}/subscriptions/{subscriptionId}:
 *   delete:
 *     summary: Отписаться (удалить запись в subscription)
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: subscriptionId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Отписка выполнена
 *       404:
 *         description: Subscription not found
 */
router.delete('/:userId/subscriptions/:subscriptionId', async (req, res) => {
  try {
    const { userId, subscriptionId } = req.params
    const sub = await Subscription.findByPk(subscriptionId)
    if (!sub || sub.userId !== +userId) {
      return res
				.status(404)
				.json({
  message:
						'Subscription not found or not belongs to this user'
})
    }
    await sub.destroy()
    res.json({ message: 'Unsubscribed' })
  } catch (error) {
    console.error('Error deleting subscription:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
