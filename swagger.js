// swagger.js
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// 1) Определяем основную часть спецификации: openapi, info, лицензия, контакт, т.д.
const swaggerDefinition = {
  openapi: '3.0.0', // или '3.0.3'
  info: {
    title: 'Wishlist', // Название API
    version: '1.0.0', // Версия
    description: 'API дока по вишлистам' // Описание
  },
  servers: [
    {
      url: 'http://localhost:5001', // Базовый URL сервера
      description: 'Development server'
    }
  ]
}

// 2) Настройки для swagger-jsdoc
const options = {
  swaggerDefinition,
	// Пути к файлам, где мы пишем JSDoc-аннотации
  apis: [
    './routes/*.js' // Если в папке routes у вас лежат файлы с JSDoc
		// Можете добавить и другие пути, если в других местах есть роуты
  ]
}

// Генерируем спецификацию
const swaggerSpec = swaggerJsdoc(options)

// Экспортируем, чтобы подключить в app.js или server.js
module.exports = {
  swaggerUi,
  swaggerSpec
}
