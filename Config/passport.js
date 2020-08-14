const LocalStrategy = require('passport-local');
const database = require('../DB/database');

const connection = database.getConnection();

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        connection.query();
    });
};