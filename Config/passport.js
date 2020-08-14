const LocalStrategy = require('passport-local').Strategy;
const database = require('../DB/database');

const connection = database.getConnection();

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        connection.query(`SELECT * from users WHERE id = ${id}`, (error, rows) => {
            done(error, rows[0])
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        connection.query(`SELECT * FROM users WHERE username = ${email}`, (error, rows) => {
            if (error) {
                return done(error)
            }

            if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That email is already in use'))
            } else {
                const newUser = {
                    email,
                    password
                }
                const insertQuery = `INSERT INTO users (username, password) VALUES (${email}, ${password})`
                connection.query(insertQuery, (error, rows) => {
                    return done(null, newUser)
                })
            }
        })
    }))

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        (req, email, password, done) => {
            connection.query(`SELECT * FROM users WHERE email = ${email}`, (error, rows) => {
                if (error) {
                    return done(error)
                }

                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'username or password incorrect'))
                }

                if (!(rows[0].password = password)) {
                    return done(null, false, req.flash('loginMessage', 'username or password incorrect'))
                }

                return done(null, rows[0])
            })
        }))
};