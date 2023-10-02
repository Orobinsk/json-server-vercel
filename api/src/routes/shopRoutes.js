const express = require('express');
const shopController = require('../controllers/shopController');

const router = express.Router();

// Маршрут для получения типов товаров в магазине
router.get('/types', shopController.getTypes);

// Маршрут для получения брендов товаров в магазине
router.get('/brands', shopController.getBrands);
router.get('/devices', shopController.getDevices);
router.get('/devices/:id', shopController.getDeviceId);
router.get('/type', shopController.newType);
router.get('/brand', shopController.newBrand);
router.get('/device', shopController.newDevice);


module.exports = router;