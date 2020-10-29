const { executeQuery, queryBuilder } = require('../DB/query');

const getUserGear = async (userId, callback) => {
    const sqlQuery = `SELECT Gear.* FROM Gear
                      INNER JOIN users ON Gear.userId = users.userId`;

    try {
        await executeQuery(sqlQuery, (gear) => {
            callback(gear);
        });
    } catch (error) {
        console.log('Error getting user gear', error);
    }
};

module.exports = {

};