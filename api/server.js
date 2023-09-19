// See https://github.com/typicode/json-server#module
const fs = require('fs');
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const path = require('path');
const multer = require('multer');
const upload = multer();

server.use(middlewares)
// Add this before server.use(router)
// server.use(jsonServer.rewriter({
//     '/api/*': '/$1',
//     '/blog/:resource/:id/show': '/:resource/:id'
// }))
server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

// Эндпоинт для логина
server.post('/login', (req, res) => {
    try {
        const {username, password} = req.body;
        const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
        const {users = []} = db;

        const userFromBd = users.find(
            (user) => user.username === username && user.password === password,
        );

        if (userFromBd) {
            return res.json(userFromBd);
        }

        return res.status(403).json({message: 'User not found'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: e.message});
    }
});

// Эндпоинт для создания нового пользователя
server.post('/registration', (req, res) => {
    try {
        const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
        const {users = []} = db;

        const {username, password} = req.body;

        // Проверяем, существует ли пользователь с таким именем
        const existingUser = users.find((user) => user.username === username);

        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        // Создаем нового пользователя
        const newUser = {
            id: users.length + 1, // Генерируем уникальный ID
            username,
            password,
        };

        // Добавляем нового пользователя в базу данных
        users.push(newUser);
        db.users = users;

        // Сохраняем обновленную базу данных в файл
        fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2), 'UTF-8');

        return res.json(newUser);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: e.message});
    }
});

// Эндпоинт для типов товара в магазине
server.get('/shop/types', (req, res) => {
    try {
        const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
        const {types = []} = db;

        return res.json(types);
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: e.message});
    }
});

// Эндпоинт для брендов в магазине
server.get('/shop/brands', (req, res) => {
    try {
        const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
        const {brands = []} = db;

        return res.json(brands);
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: e.message});
    }
});

// Эндпоинт для списка девайсов в магазине
server.get('/shop/devices', (req, res) => {
    try {
        const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
        let {devices = []} = db;

        let {typeName, brandName, limit, devicePage} = req.query;

        typeName = JSON.parse(typeName)
        brandName = JSON.parse(brandName)
        console.log(brandName)
        // Фильтрация по typeName и brandName
        if (typeName && typeName.length > 0) {
            devices = devices.filter(device => typeName.some(type => device.type.includes(type.name)));
        }
        if (brandName && brandName.length > 0) {
            devices = devices.filter(device => brandName.some(brand => device.brand.includes(brand.name)));
        }
        const totalDevices = devices.length;
        // По умолчанию, если limit не указан, возвращаем все устройства
        if (!limit) {
            return res.json({devices, totalDevices});
        }

        let offset = limit * devicePage

        // Преобразуем limit и offset в числа
        limit = parseInt(limit, 10);
        // offset = parseInt(offset, 10) || 0;

        // Ограничиваем количество возвращаемых устройств
        const limitedDevices = devices.slice(offset, offset + limit);

        return res.json({devices: limitedDevices, totalDevices});
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: e.message});
    }
});

// Эндпоинт для девайса в магазине по id
server.get('/shop/devices/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
        const {devices = []} = db;

        const deviceFromBd = devices.find(
            (device) => device.id === id
        );

        if (deviceFromBd) {
            return res.json(deviceFromBd);
        }

        return res.status(404).json({message: 'Device not found'});
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: e.message});
    }
});

// Эндпоинт для создания нового типа
server.post('/shop/type', (req, res) => {
    try {
        const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
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
        fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2), 'UTF-8');

        return res.json(newType);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: e.message});
    }
});

// Эндпоинт для создания нового бренда
server.post('/shop/brand', (req, res) => {
    try {
        const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
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
        fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2), 'UTF-8');

        return res.json(newBrand);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: e.message});
    }
});

// Эндпоинт для создания нового девайса
server.post('/shop/device', upload.none(), (req, res) => {
    try {
        const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
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
        fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2), 'UTF-8');

        return res.json(createdDevice);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: e.message});
    }
});

server.use(router);

// проверяем, авторизован ли пользователь
// eslint-disable-next-line
server.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({message: 'AUTH ERROR'});
    }

    next();
});

server.use(router)
server.listen(8000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
