const passport = require('passport')
const { confirmEmail } = require('../Lib/auth')
const { verifyResetToken, sendResetEmail, isValidEmail, insertAndGenerateResetToken, updatePassword } = require('../Services/auth')

module.exports = (app) => {
  app.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (error, user, info) => {
      if (error) {
        return next(error)
      }

      if (!user) {
        return res.status(500).send({ authorized: false, message: info.message })
      }

      req.logIn(user, (error) => {
        if (error) {
          return next(error)
        }

        return res.status(200).send({ authorized: true })
      })
    })(req, res, next)
  })

  app.post('/sign-up', passport.authenticate('local-signup', { session: false }), (req, res) => {
    return res.status(200).send(true)
  })

  app.get('/verify/:token', confirmEmail, (req, res) => {
    return res.redirect(200, 'http://localhost:5000/login')
  })

  app.post('/reset', async (req, res) => {
    const { email } = req.body

    await isValidEmail(email, async (validEmail) => {
      if (validEmail) {
        const resetToken = await insertAndGenerateResetToken(email)
        await sendResetEmail(email, resetToken)
      }

      return res.status(200).send({ message: 'Please check your inbox for instructions on resetting your password' })
    })
  })

  app.get('/reset/:token', async (req, res) => {
    const { token } = req.params

    await verifyResetToken(token, (isValidToken) => {
      if (isValidToken) {
        res.status(200).send({ valid: true })
      } else {
        res.status(500).send({ valid: false })
      }
    })
  })

  app.post('/reset/:token', async (req, res) => {
    const { password } = req.body
    const { token } = req.params

    await verifyResetToken(token, async (isValidToken) => {
      if (isValidToken) {
        await updatePassword(token, password)
      }

      return res.status(200).send(true)
    })
  })

  app.get('/logout', (req, res) => {
    req.logout()
    req.session.destroy((error) => {
      res.clearCookie('connect.sid')
      return res.status(200).send('Ok')
    })
  })

  app.get('/auth', (req, res) => {
    if (req.user) {
      res.status(200).send(true)
    } else {
      res.status(200).send(false)
    }
  })
}
