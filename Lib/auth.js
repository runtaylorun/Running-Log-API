const database = require('../DB/database')

const connection = database.getConnection()

const confirmEmail = async (req, res, next) => {
    await connection.query(`UPDATE users SET confirmed = 1 WHERE verificationToken = '${req.params.token}'`, (error, rows) => {
        if (error) return res.status(500).send({ error })



        next()
    })
}

module.exports = {
    confirmEmail
}