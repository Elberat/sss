const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
	process.env.DB_NAME, // DB name
	process.env.DB_USER, // DB user
	process.env.DB_PASSWORD, // DB password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true, // Обязательно требовать SSL
        rejectUnauthorized: false // Отключаем проверку сертификата
      }
    }
  }
)

module.exports = sequelize
