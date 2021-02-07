const { executeQuery, queryBuilder } = require('../DB/query');
const moment = require('moment');


const getUserActivities = async (userId, urlQuery, callback) => {
    let sqlQuery = `SELECT activities.id, activities.userId, activities.distance, activities.date, activities.elapsedTime, activities.comments, activities.difficultyRating,
                   activities.title, activities.type, activities.distanceUnit, activity_types.type
                   FROM activities 
		           INNER JOIN activity_types ON activities.type = activity_types.id
                   WHERE userId = ${userId}`;

    sqlQuery += queryBuilder(urlQuery);
    console.log(sqlQuery);


    try {
        await executeQuery(sqlQuery, (activities) => {
            const formattedActivities = activities.map(activity => (
                {
                    ...activity,
                    date: moment(activity.date).format('YYYY-MM-DD')
                }
            ));

            callback(formattedActivities);
        });
    } catch (error) {
        console.log('Error getting user activities', error);
    }

};

const getUserActivityById = async (userId, activityId, callback) => {
    const sqlQuery = `SELECT activities.*, activity_types.id 
                      FROM activities 
                      INNER JOIN activity_types ON activities.type = activity_types.id 
                      WHERE activities.id = ${activityId}
                      AND activities.userId = ${userId}`;
    try {
        await executeQuery(sqlQuery, (activities) => {
            const formattedActivities = activities.map(activity => (
                {
                    ...activity,
                    date: moment(activity.date).format('YYYY-MM-DD')
                }
            ));

            callback(formattedActivities);
        });
    } catch (error) {
        console.log(error);
    }


};

const createNewActivity = async (activity) => {
    const { title, type, distanceUnit, distance, date, elapsedTime, comments, difficultyRating, userId } = activity;

    const sqlQuery = ` INSERT INTO activities 
    (title, type, distanceUnit, distance, date, elapsedTime, comments, difficultyRating, userId) 
    VALUES ('${title}', '${type}', '${distanceUnit}', '${distance}', '${date}', '${elapsedTime}', '${comments}', '${difficultyRating}', '${userId}')`;

    try {
        await executeQuery(sqlQuery, (results) => console.log(results));
    } catch (error) {
        console.log('Error inserting activity', error);
    }

};

const updateActivity = async (activity) => {
    const { title, type, distanceUnit, distance, date, elapsedTime, comments, difficultyRating, activityId } = activity;

    const sqlQuery = `UPDATE activities
                    SET distance = ${distance}, date = '${date}', elapsedTime = '${elapsedTime}', comments = '${comments}', difficultyRating = ${difficultyRating}, type = ${type}, title = '${title}', distanceUnit = '${distanceUnit}'
                    WHERE id = ${activityId}`;

    try {
        await executeQuery(sqlQuery, (results) => console.log(results));
    } catch (error) {
        console.log('Error inserting activity', error);
    }

};

module.exports = {
    getUserActivities,
    getUserActivityById,
    createNewActivity,
    updateActivity
};
