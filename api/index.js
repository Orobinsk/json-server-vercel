const express = require('express');
const fs = require('fs');
const jsonServer = require('json-server');
const path = require('path');
const multer = require('multer');
const upload = multer();
const cors = require('cors')
const authRoutes = require('./src/routes/authRoutes');
const shopRoutes = require('./src/routes/shopRoutes');

const app = express();
const server = jsonServer.create();
app.use(cors())
server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

// Нужно для небольшой задержки, чтобы запрос проходил не мгновенно, имитация реального апи
// server.use(async (req, res, next) => {
//     await new Promise((res) => {
//         setTimeout(res, 300);
//     });
//     next();
// });

app.use(express.json())
app.use('/auth', authRoutes);
app.use('/shop', shopRoutes);

// Подключаем JSON-сервер как middleware
app.use(server);

// Подключаем статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// проверяем, авторизован ли пользователь
// server.use((req, res, next) => {
//     if (!req.headers.authorization) {
//         return res.status(403).json({message: 'AUTH ERROR'});
//     }
//     next();
// });

// запуск сервера
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
