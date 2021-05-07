const LocalStrategy = require('passport-local').Strategy
const database = require('../DB/database')
const bcrypt = require('bcrypt')
const randToken = require('rand-token')
const mailer = require('./mail')

const transport = mailer.getTransport()
const connection = database.getConnection()

const SALT_ROUNDS = 10
const NOT_CONFIRMED = 0

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    await connection.query(`SELECT * from users WHERE id = ${id}`, (error, rows) => {
      done(error, rows[0])
    })
  })

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    const { firstName, lastName } = req.body
    await connection.query(`SELECT * FROM users WHERE email = '${email}'`, async (error, rows) => {
      if (error) {
        return done(error)
      }

      if (rows.length > 0) {
        return done(null, false, { message: 'The email you entered already exists' })
      } else {
        const verificationToken = randToken.generate(64)

        bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
          if (err) {
            return done(err)
          }

          const insertQuery = `INSERT INTO users (email, password, confirmed, verificationToken, firstName, lastName) VALUES ('${email}', '${hash}', 0, '${verificationToken}', '${firstName}', '${lastName}')`
          const confirmationEmail = {
            from: '"Running log" <taylormills190@gmail.com>',
            to: 'taylormills190@gmail.com',
            subject: 'this is a node mailer test',
            text: 'Node mail test',
            html: `<h1>Verify Email</h1><a href='http://localhost:5000/verify/${verificationToken}' >Here</a>`
          }

          await connection.query(insertQuery, (error, rows) => {
            transport.sendMail(confirmationEmail, (error, info) => {
              if (error) {
                console.log('mail error', error)
              }
              console.log('email sent yo')
            })

            return done(null, { email, password: hash })
          })
        })
      }
    })
  }))

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, email, password, done) => {
    await connection.query(`SELECT * FROM users WHERE email = '${email}'`, (error, rows) => {
      if (error) {
        return done(error)
      }

      if (!rows.length) {
        return done(null, false, { message: 'Username or password is incorrect' })
      }

      bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
        if (err) return done(err)

        if (!(rows[0].password === hash)) {
          return done(null, false, { message: 'Username or password is incorrect' })
        }
      })

      if (rows[0].confirmed === NOT_CONFIRMED) {
        return done(null, false, { message: 'Please verify your email' })
      }

      return done(null, rows[0])
    })
  }))
}
