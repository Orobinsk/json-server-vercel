const {loadDatabase, saveDatabase} = require('../models/database');
const fs = require("fs");
const path = require("path");

// Контроллер для получения типов товаров в магазине
function getTypes(req, res) {
    try {
        const db = loadDatabase();
        const {types = []} = db;

        return res.json(types);
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

// Контроллер для получения брендов товаров в магазине
function getBrands(req, res) {
    try {
        const db = loadDatabase();
        const {brands = []} = db;

        return res.json(brands);
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

//Контроллер для получения списка девайсов
function getDevices(req, res) {
    try {
        const db = loadDatabase();
        let {devices = []} = db;

        let {search, typeName, brandName, limit, devicePage, filterPrice, sort} = req.query;
        typeName = JSON.parse(typeName)
        brandName = JSON.parse(brandName)
        filterPrice = JSON.parse(filterPrice)

        //Фильтрация по запросу search
        devices=devices.filter(device=>device.name.toLowerCase().includes(search.toLowerCase()))

        // Фильтрация по typeName и brandName
        if (typeName && typeName.length > 0) {
            devices = devices.filter(device => typeName.some(type => device.type.includes(type.name)));
        }
        if (brandName && brandName.length > 0) {
            devices = devices.filter(device => brandName.some(brand => device.brand.includes(brand.name)));
        }

        //Фильтрация по цене
        if (filterPrice.max === '') {
            filterPrice.max = 1000000
        }
        devices = devices.filter((device) => Number(device.price) >= Number(filterPrice.min) && Number(device.price) <= Number(filterPrice.max))

        //Сортировка по цене
        if (sort === 'сначала дешевые') {
            devices = devices.sort((a, b) => a.price - b.price)
        } else if (sort === 'сначала дорогие') {
            devices = devices.sort((a, b) => b.price - a.price)
        }

        const totalDevices = devices.length;
        // По умолчанию, если limit не указан, возвращаем все устройства
        if (!limit) {
            return res.json({devices, totalDevices});
        }

        let offset = limit * devicePage

        // Преобразуем limit в числа
        limit = parseInt(limit, 10);


        // Ограничиваем количество возвращаемых устройств
        const limitedDevices = devices.slice(offset, offset + limit);

        return res.json({devices: limitedDevices, totalDevices});
        // return res.json({devices});
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

//Контроллер для получения девайса по id
function getDeviceId(req, res) {
    try {
        const db = loadDatabase();
        const {devices = []} = db;
        const id = parseInt(req.params.id)

        const deviceFromBd = devices.find(
            (device) => device.id === id
        );

        if (deviceFromBd) {
            return res.json(deviceFromBd);
        }

        return res.status(404).json({message: 'Device not found'});
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

//Контроллер для создания нового типа
function newType(req, res) {
    try {
        const db = loadDatabase();
        const {types = []} = db;

        const {name} = req.body;

        // Проверяем, существует ли тип с таким именем
        const existingType = types.find((type) => type.name === name);

        if (existingType) {
            return res.status(400).json({message: 'Type already exists'});
        }

        // Создаем нового типа
        const newType = {
            id: types.length + 1, // Генерируем уникальный ID
            name,
        };

        // Добавляем новый тип в базу данных
        types.push(newType);
        db.types = types;

        // Сохраняем обновленную базу данных в файл
        saveDatabase(db);

        return res.json(newType);
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

// Контроллер для создания нового бренда
function newBrand(req, res) {
    try {
        const db = loadDatabase();
        const {brands = []} = db;
        const {name} = req.body;

        // Проверяем, существует ли тип с таким именем
        const existingBrand = brands.find((brand) => brand.name === name);

        if (existingBrand) {
            return res.status(400).json({message: 'Brand already exists'});
        }

        // Создаем нового типа
        const newBrand = {
            id: brands.length + 1, // Генерируем уникальный ID
            name,
        };

        // Добавляем новый бренд в базу данных
        brands.push(newBrand);
        db.brands = brands;

        // Сохраняем обновленную базу данных в файл
        saveDatabase(db);

        return res.json(newBrand);
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

// Контроллер для создания нового девайса
function newDevice(req, res) {
    try {
        const db = loadDatabase();
        const {devices = []} = db;
        const newDevice = req.body;

        // Проверяем, существует ли девайс с такими характеристиками
        const existingDevice = devices.find((device) => device.name === newDevice.name);

        if (existingDevice) {
            return res.status(400).json({message: 'Device already exists'});
        }

        // Создаем нового типа
        const createdDevice = {
            id: devices.length + 1, // Генерируем уникальный ID
            ...newDevice,
            info: JSON.parse(newDevice.info)
        };

        // Добавляем новый тип в базу данных
        devices.push(createdDevice);
        db.devices = devices;

        // Сохраняем обновленную базу данных в файл
        saveDatabase(db);

        return res.json(createdDevice);
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

module.exports = {
    getTypes,
    getBrands,
    getDevices,
    getDeviceId,
    newType,
    newBrand,
    newDevice,
};