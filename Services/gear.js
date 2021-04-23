const { executeQuery, queryBuilder } = require('../DB/query');

const getUserGear = async (userId) => {
    const sqlQuery = `SELECT gear.* FROM gear
                      INNER JOIN users ON gear.userId = users.id
                      WHERE gear.userId = ${userId}`;

    try {
        const gear = await executeQuery(sqlQuery)

        return gear
    } catch (error) {
        console.log('Error getting user gear', error);
    }
};

const createNewGear = async (userId, gear) => {
    const sqlQuery = `INSERT INTO gear (userId, miles, brand, model, colorway, dateAdded, maxMiles) VALUES (${userId}, ${gear.miles}, '${gear.brand}', '${gear.model}', '${gear.colorway}', '${gear.dateAdded}', ${gear.maxMiles})`

    try {
        executeQuery(sqlQuery)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getUserGear,
    createNewGear
};