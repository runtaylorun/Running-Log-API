const database = require('../DB/database');

const connection = database.getConnection();

module.exports = (app) => {
    app.post('/login')
}