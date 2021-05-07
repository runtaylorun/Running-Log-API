const database = require('../DB/database')
const mailer = require('./mail')
const randToken = require('rand-token')
const bcrypt = require('bcrypt')

const transport = mailer.getTransport()
const connection = database.getConnection()
const SALT_ROUNDS = 10

const verifyResetToken = async (token, callback) => {
  const query = `SELECT * FROM users WHERE resetToken = '${token}'`

  await connection.query(query, (error, rows) => {
    if (error) {
      return callback(false)
    }

    if (!rows.length) {
      return callback(false)
    }

    return callback(true)
  })
}

const sendResetEmail = async (emailAddress, resetToken) => {
  const passwordResetEmail = {
    from: '"Running log" <taylormills190@gmail.com>',
    to: 'taylormills190@gmail.com',
    subject: 'this is a node mailer test',
    text: 'Node mail test',
    html: `<h1>To reset password, click </h1><a href='http://localhost:3000/forgot/${resetToken}' >Here</a>`
  }

  transport.sendMail(passwordResetEmail, (error, info) => {
    if (error) {
      console.log('mail error', error)
    }
    console.log('email sent yo')``
  })
}

const insertAndGenerateResetToken = async (email) => {
  const resetToken = randToken.generate(64)

  const query = `UPDATE users SET resetToken = '${resetToken}' WHERE email = '${email}'`

  await connection.query(query, (error, rows) => {
    if (error) {
      console.log(error)
    }
  })

  return resetToken
}

const updatePassword = async (resetToken, password) => {
  // TODO set token = null here in the query
  bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
    const query = `UPDATE users SET password = '${hash}' WHERE resetToken = '${resetToken}'`

    await connection.query(query, (error, rows) => {
      if (error) {
        console.log(error)
      }
    })
  })
}

const isValidEmail = async (email, callback) => {
  const query = `SELECT * FROM users WHERE email = '${email}'`

  await connection.query(query, (error, rows) => {
    if (error) {
      console.log(error)
      return callback(false)
    }

    if (!rows.length) {
      return callback(false)
    }

    return callback(true)
  })
}

module.exports = {
  verifyResetToken,
  sendResetEmail,
  isValidEmail,
  insertAndGenerateResetToken,
  updatePassword
}
