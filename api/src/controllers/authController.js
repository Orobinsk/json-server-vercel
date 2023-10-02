const { loadDatabase, saveDatabase } = require('../models/database');
const fs = require("fs");
const path = require("path");

function login(req, res) {
    try {
        const {username, password} = req.body;
        const db = loadDatabase();
        const {users = []} = db;

        const userFromBd = users.find(
            (user) => user.username === username && user.password === password,
        );

        if (userFromBd) {
            return res.json(userFromBd);
        }

        return res.status(403).json({message: 'User not found'});
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

function registration(req, res) {
    try {
        const db = loadDatabase();
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
        saveDatabase(db);

        return res.json(newUser);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

module.exports = {
    login,
    registration,
};