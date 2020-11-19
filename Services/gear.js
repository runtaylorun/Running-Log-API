const { executeQuery, queryBuilder } = require('../DB/query');

const getUserGear = async (userId, callback) => {
    const sqlQuery = `SELECT Gear.* FROM Gear
                      INNER JOIN users ON Gear.userId = users.userId
                      WHERE Gear.userId = ${userId}`;

    try {
        await executeQuery(sqlQuery, (gear) => {
            callback(gear);
        });
    } catch (error) {
        console.log('Error getting user gear', error);
    }
};

const createNewGear = async (userId, gear) => {
    const sqlQuery = `INSERT INTO Gear (userId, miles, brand, model, colorway, dateAdded, maxMiles) VALUES (${userId}, ${gear.miles}, '${gear.brand}', '${gear.model}', '${gear.colorway}, '${gear.dateAdded}', ${gear.maxMiles})`

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