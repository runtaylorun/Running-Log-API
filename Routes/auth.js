const database = require('../DB/database');
const passport = require('passport');


module.exports = (app) => {
    app.post('/login', (req, res, next) => {

        passport.authenticate('local-login', (err, user, info) => {
            if (err) throw err;
            if (!user) res.status(401).send('Username or Password not correct');
            else {
                req.login(user, err => {
                    if (err) throw err;
                    res.status(200).send({ userId: user.id });
                });
            }
        })(req, res, next);
    });

    app.get('/logout', (req, res) => {
        req.session.destroy((error) => {
            res.status(200).send('Ok');
        });
    });
};