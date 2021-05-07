const { executeQuery } = require('../DB/query')

const patchUserPreferences = async (userId, changes) => {
  const sqlQuery = `UPDATE users SET ${changes?.measurementSystem ? `measurementSystem = '${changes.measurementSystem}'` : ''} WHERE id = ${userId}`

  try {
    await executeQuery(sqlQuery)
  } catch (error) {
    console.log(error)
  }
}

const getUserDetails = async (userId) => {
  const sqlQuery = `SELECT email, firstName, lastName, measurementSystem FROM users
                      WHERE id = ${userId}`

  try {
    const rows = await executeQuery(sqlQuery)

    return { ...rows?.[0] }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  patchUserPreferences,
  getUserDetails
}
