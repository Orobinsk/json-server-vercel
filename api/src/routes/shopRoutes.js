const express = require('express');
const shopController = require('../controllers/shopController');
const checkRole = require('../middleware/checkRoleMiddleware')
const router = express.Router();

// Маршруты для получения типов, брендов и товаров в магазине
router.get('/types', shopController.getTypes);
router.get('/brands', shopController.getBrands);
router.get('/devices', shopController.getDevices);
router.get('/devices/:id', shopController.getDeviceId);

// Маршруты для добавления брендов, типов и товаров в магазине
router.post('/type',checkRole('admin'), shopController.newType);
router.post('/brand',checkRole('admin'), shopController.newBrand);
router.post('/device',checkRole('admin'), shopController.newDevice);


module.exports = router;