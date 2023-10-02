const jsonServer = require('json-server');
const path = require('path');
const multer = require('multer');
const upload = multer();
const jsonServerMiddlewares = jsonServer.defaults();
const authRoutes = require('./src/routes/authRoutes');
const shopRoutes = require('./src/routes/shopRoutes');

const server = jsonServer.create();

// Добавляем JSON-Server middlewares
server.use(jsonServerMiddlewares);
server.use(jsonServer.bodyParser);

// Подключаем роуты для авторизации и магазина
server.use('/auth', authRoutes);
server.use('/shop', shopRoutes);

// Подключаем статические файлы
// server.use(jsonServer.static(path.join(__dirname, 'public')));

// Запуск сервера
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
