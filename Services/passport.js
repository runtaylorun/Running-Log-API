const LocalStrategy = require('passport-local').Strategy;
const database = require('../DB/database');

const connection = database.getConnection();

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        await connection.query(`SELECT * from Users WHERE id = ${id}`, (error, rows) => {
            done(error, rows[0]);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        await connection.query(`SELECT * FROM Users WHERE username = ${email}`, async (error, rows) => {
            if (error) {
                return done(error);
            }

            if (rows.length) {
                return done(null, false, { message: 'That email already exists' });
            } else {
                const newUser = {
                    email,
                    password
                };
                const insertQuery = `INSERT INTO Users (username, password) VALUES (${email}, ${password})`;
                await connection.query(insertQuery, (error, rows) => {
                    return done(null, newUser);
                });
            }
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        async (req, email, password, done) => {
            await connection.query(`SELECT * FROM Users WHERE email = '${email}'`, (error, rows) => {
                if (error) {
                    return done(error);
                }

                if (!rows.length) {
                    return done(null, false, { message: 'Username or password is incorrect' });
                }

                if (!(rows[0].password === password)) {
                    return done(null, false, { message: 'Username or password is incorrect' });
                }

                return done(null, rows[0]);
            });
        }));
};