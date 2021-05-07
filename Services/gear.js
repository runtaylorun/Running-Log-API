const { executeQuery, queryBuilder } = require('../DB/query')

const getUserGear = async (userId) => {
  const sqlQuery = `SELECT gear.* FROM gear
                      INNER JOIN users ON gear.userId = users.id
                      WHERE gear.userId = ${userId}`

  try {
    const gear = await executeQuery(sqlQuery)

    return gear
  } catch (error) {
    console.log('Error getting user gear', error)
  }
}

const getGearById = async (userId, gearId) => {
  const sqlQuery = `SELECT gear.* FROM gear
                       WHERE userId = ${userId} AND id = ${gearId}`

  try {
    const gear = await executeQuery(sqlQuery)

    return gear
  } catch (error) {
    console.log(error)
  }
}

const createNewGear = async (userId, gear) => {
  const sqlQuery = `INSERT INTO gear (userId, miles, brand, model, colorway, dateAdded, maxMiles) VALUES (${userId}, ${gear.miles}, '${gear.brand}', '${gear.model}', '${gear.colorway}', '${gear.dateAdded}', ${gear.maxMiles})`

  try {
    await executeQuery(sqlQuery)
  } catch (error) {
    console.log(error)
  }
}

const updateGear = async (userId, gear) => {
  const sqlQuery = `UPDATE gear SET brand = \'${gear.brand}\', colorway = \'${gear.colorway}\', maxMiles = ${gear.maxMiles}, miles = ${gear.miles}, model = \'${gear.model}\'
    WHERE userId = ${userId} AND id = ${gear.id}`

  try {
    await executeQuery(sqlQuery)
  } catch (error) {
    console.log(error)
  }
}

const deleteGear = async (userId, gearId) => {
  const sqlQuery = `DELETE FROM gear WHERE userId = ${userId} AND id = ${gearId}`

  try {
    executeQuery(sqlQuery)
  } catch (error) {
    console.log(error)
  }
}

const updateRunsWithDeletedGear = async (userId, gearId) => {
  const sqlQuery = `UPDATE activities SET gearId = NULL WHERE userId = ${userId} AND gearId = ${gearId}`

  try {
    executeQuery(sqlQuery)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getUserGear,
  getGearById,
  createNewGear,
  deleteGear,
  updateGear,
  updateRunsWithDeletedGear
}
