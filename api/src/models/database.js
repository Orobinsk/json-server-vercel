const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../db.json');

function loadDatabase() {
    try {
        const dbContent = fs.readFileSync(dbPath, 'UTF-8');
        return JSON.parse(dbContent);
    } catch (e) {
        console.error(e);
        throw e;
    }
}

function saveDatabase(db) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'UTF-8');
    } catch (e) {
        console.error(e);
        throw e;
    }
}

module.exports = {
    loadDatabase,
    saveDatabase,
};