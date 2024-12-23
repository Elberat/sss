// index.js (CommonJS)
require('dotenv').config();
const express = require('express');
const app = require('./app');
const sequelize = require('./db');
// Предположим, что модели вы тоже подтягиваете через require

async function setupAdminJS() {
	// Динамически импортируем ESM-модуль
	const AdminJS = (await import('adminjs')).default;
	const AdminJSExpress = await import('@adminjs/express');
	const AdminJSSequelize = await import('@adminjs/sequelize');

	// Регистрируем адаптер
	AdminJS.registerAdapter({
		Database: AdminJSSequelize.Database,
		Resource: AdminJSSequelize.Resource
	});

	// Импорт моделей из вашего кода
	const {
		User,
		Merchant,
		Product,
		WishList,
		WishListItem,
		Subscription
	} = require('./models');

	const adminJs = new AdminJS({
		resources: [
			{ resource: User },
			{ resource: Merchant },
			{ resource: Product },
			{ resource: WishList },
			{ resource: WishListItem },
			{ resource: Subscription }
		],
		rootPath: '/admin'
	});

	// buildRouter / buildAuthenticatedRouter
	const adminRouter = AdminJSExpress.buildRouter(adminJs);
	app.use(adminJs.options.rootPath, adminRouter);
}

// Запуск
async function start() {
	try {
		await sequelize.authenticate();
		console.log('DB connected successfully');

		await sequelize.sync({ alter: true });
		console.log('ALL MODELS WERE SYNCHRONIZED SUCCESSFULLY');

		// Вызовем настройку AdminJS
		await setupAdminJS();

		const PORT = process.env.PORT || 5001;
		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
			console.log(
				`AdminJS is available under http://localhost:${PORT}/admin`
			);
		});
	} catch (error) {
		console.error('ERROR STARTING SERVER:', error);
	}
}

start();
