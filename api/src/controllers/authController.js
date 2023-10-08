const {loadDatabase, saveDatabase} = require('../models/database');

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJwt = (id, username, role) => {
    return jwt.sign(
        {id, username, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

async function login(req, res) {
    try {
        const {username, password} = req.body;
        const db = loadDatabase();
        const {users = []} = db;

        const userFromBd = await users.find((user) => user.username === username);
        if (!userFromBd) {
            return res.status(403).json({message: 'User not found'})
        }
        let comparePassword = bcrypt.compareSync(password, userFromBd.hashPassword)
        if (!comparePassword) {
            return res.status(403).json({message: 'Invalid password'})
        }
        const token = generateJwt(userFromBd.id, userFromBd.username, userFromBd.role)

        return res.json({token});
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

async function registration(req, res) {
    try {
        const db = loadDatabase();
        const {users = []} = db;
        const {username, password, role} = req.body;

        if (!username || !password) {
            return res.status(400).json({message: 'Invalid email or password'});
        }
        // Проверяем, существует ли пользователь с таким именем
        const existingUser = users.find((user) => user.username === username);

        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const newUser = {
            id: users.length + 1, // Генерируем уникальный ID
            role,
            username,
            hashPassword,
        };
        const token = generateJwt(newUser.id, newUser.username, newUser.role)

        // Добавляем нового пользователя в базу данных
        users.push(newUser);
        db.users = users;

        // Сохраняем обновленную базу данных в файл
        saveDatabase(db);

        return res.json(token);
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

async function check(req, res) {
        const token = generateJwt(req.user.id, req.user.username, req.user.role)
        return res.json(token);
}

module.exports = {
    login,
    registration,
    check,
};