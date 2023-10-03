// const jsonServer = require('json-server');
const path = require('path');
// const multer = require('multer');
const express =require('express')
// const upload = multer();
const cors = require('cors')
// const jsonServerMiddlewares = jsonServer.defaults();
const authRoutes = require('./src/routes/authRoutes');
const shopRoutes = require('./src/routes/shopRoutes');
const fileUpload = require('express-fileupload')

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))

// Добавляем JSON-Server middlewares
// server.use(jsonServerMiddlewares);
// server.use(jsonServer.bodyParser);

// Подключаем роуты для авторизации и магазина
app.use('/auth', authRoutes);
app.use('/shop', shopRoutes);

// Подключаем статические файлы
// server.use(jsonServer.static(path.join(__dirname, 'public')));

// Запуск сервера
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
