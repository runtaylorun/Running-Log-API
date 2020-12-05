const { executeQuery, queryBuilder } = require('../DB/query')
const moment = require('moment')


const getUserActivities = async (userId, urlQuery, callback) => {
    let sqlQuery = `SELECT Activities.id, Activities.userId, Activities.distance, Activities.date, Activities.elapsedTime, Activities.comments, Activities.difficultyRating,
                   Activities.title, Activities.type, Activities.distanceUnit, ActivityTypes.type
                   FROM Activities 
		           INNER JOIN ActivityTypes ON Activities.type = ActivityTypes.id
                   WHERE userId = ${userId}`

    sqlQuery += queryBuilder(urlQuery)

    try {
        await executeQuery(sqlQuery, (activities) => {
            console.log(activities)
            const formattedActivities = activities.map(activity => (
                {
                    ...activity,
                    date: moment(activity.date).format('YYYY-MM-DD')
                }
            ))

            callback(formattedActivities)
        })
    } catch (error) {
        console.log('Error getting user activities', error)
    }

}

const getUserActivityById = async (userId, activityId, callback) => {
    const sqlQuery = `SELECT Activities.*, ActivityTypes.id 
                      FROM Activities 
                      INNER JOIN ActivityTypes ON Activities.type = ActivityTypes.id 
                      WHERE Activities.id = ${activityId}
                      AND Activities.userId = ${userId}`
    try {
        await executeQuery(sqlQuery, (activities) => {
            const formattedActivities = activities.map(activity => (
                {
                    ...activity,
                    date: moment(activity.date).format('YYYY-MM-DD')
                }
            ))

            callback(formattedActivities)
        })
    } catch (error) {
        console.log(error)
    }


}

const createNewActivity = async (activity) => {
    const { title, type, distanceUnit, distance, date, elapsedTime, comments, difficultyRating, userId } = activity

    const sqlQuery = ` INSERT INTO Activities 
    (title, type, distanceUnit, distance, date, elapsedTime, comments, difficultyRating, userId) 
    VALUES ('${title}', '${type}', '${distanceUnit}', '${distance}', '${date}', '${elapsedTime}', '${comments}', '${difficultyRating}', '${userId}')`

    try {
        await executeQuery(sqlQuery, (results) => console.log(results))
    } catch (error) {
        console.log('Error inserting activity', error)
    }

}

const updateActivity = async (activity) => {
    const { title, type, distanceUnit, distance, date, elapsedTime, comments, difficultyRating, activityId } = activity

    const sqlQuery = `UPDATE Activities
                    SET distance = ${distance}, date = '${date}', elapsedTime = '${elapsedTime}', comments = '${comments}', difficultyRating = ${difficultyRating}, type = ${type}, title = '${title}', distanceUnit = '${distanceUnit}'
                    WHERE id = ${activityId}`

    try {
        await executeQuery(sqlQuery, (results) => console.log(results))
    } catch (error) {
        console.log('Error inserting activity', error)
    }

}

module.exports = {
    getUserActivities,
    getUserActivityById,
    createNewActivity,
    updateActivity
}
