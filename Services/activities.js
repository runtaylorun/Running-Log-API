const { executeQuery, queryBuilder } = require('../DB/query')
const moment = require('moment')


const getUserActivities = async (userId, urlQuery, callback) => {
    let sqlQuery = `SELECT Activities.activityId, Activities.userId, Activities.distance, Activities.date, Activities.elapsedTime, Activities.comments, Activities.difficultyRating,
                   Activities.activityTitle, Activities.type, Activities.distanceUnit, activityTypes.type
                   FROM Activities 
		           INNER JOIN activityTypes ON Activities.type = activityTypes.activityCode
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
    const sqlQuery = `SELECT Activities.*, activityTypes.activityCode 
                      FROM Activities 
                      INNER JOIN activityTypes ON Activities.type = activityTypes.activityCode 
                      WHERE activityId = ${activityId}
                      AND userId = ${userId}`
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
    const { activityTitle, type, distanceUnit, distance, date, elapsedTime, comments, difficultyRating, userId } = activity

    const sqlQuery = ` INSERT INTO activities 
    (activityTitle, type, distanceUnit, distance, date, elapsedTime, comments, difficultyRating, userId) 
    VALUES ('${activityTitle}', '${type}', '${distanceUnit}', '${distance}', '${date}', '${elapsedTime}', '${comments}', '${difficultyRating}', '${userId}')`

    try {
        await executeQuery(sqlQuery, (results) => console.log(results))
    } catch (error) {
        console.log('Error inserting activity', error)
    }

}

const updateActivity = async (activity) => {
    const { activityTitle, type, distanceUnit, distance, date, elapsedTime, comments, difficultyRating, activityId } = activity

    const sqlQuery = `UPDATE Activities
                    SET distance = ${distance}, date = '${date}', elapsedTime = '${elapsedTime}', comments = '${comments}', difficultyRating = ${difficultyRating}, type = ${type}, activityTitle = '${activityTitle}', distanceUnit = '${distanceUnit}'
                    WHERE activityId = ${activityId}`

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