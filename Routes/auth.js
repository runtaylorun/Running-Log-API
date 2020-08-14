const database = require('../DB/database');
const passport = require('passport')

const connection = database.getConnection();

module.exports = (app) => {
    app.post('/login', passport.authenticate('local-login', { failureFlash: true }), (req, res) => {
        res.status(200).send(req.user)
    })
}