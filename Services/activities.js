const { executeQuery, queryBuilder } = require('../DB/query')
const moment = require('moment')

const getUserActivities = async (userId, urlQuery) => {
  let sqlQuery = `SELECT activities.id, activities.userId, activities.distance, activities.date, activities.hours, activities.minutes, activities.seconds, activities.comments, activities.difficultyRating,
                   activities.title, activities.type, activities.distanceUnit, activity_types.type
                   FROM activities 
		           INNER JOIN activity_types ON activities.type = activity_types.id
                   WHERE userId = ${userId}`

  sqlQuery += queryBuilder(urlQuery)

  try {
    const rows = await executeQuery(sqlQuery)

    const formattedActivities = rows?.map(activity => (
      {
        ...activity,
        date: moment(activity.date).format('MM-DD-YYYY')
      }
    ))

    return formattedActivities
  } catch (error) {
    console.log('Error getting user activities', error)
  }
}

const getUserActivityCount = async (userId) => {
  const sqlQuery = `SELECT COUNT(*) FROM activities WHERE userId = ${userId}`

  try {
    const rows = await executeQuery(sqlQuery)

    return rows[0]['COUNT(*)']
  } catch (error) {
    console.log('Error fetching row count', error)
  }
}

const getUserActivityById = async (userId, activityId) => {
  const sqlQuery = `SELECT activities.*, activity_types.id 
                      FROM activities 
                      INNER JOIN activity_types ON activities.type = activity_types.id 
                      WHERE activities.id = ${activityId}
                      AND activities.userId = ${userId}`
  try {
    const rows = await executeQuery(sqlQuery)

    const formattedActivities = rows?.map(activity => (
      {
        ...activity,
        date: moment(activity.date).format('MM-DD-YYYY')
      }
    ))

    return formattedActivities
  } catch (error) {
    console.log(error)
  }
}

const createNewActivity = async (activity) => {
  const { title, type, distanceUnit, distance, date, hours, minutes, seconds, comments, difficultyRating, userId } = activity

  const sqlQuery = ` INSERT INTO activities 
    (title, type, distanceUnit, distance, date, hours, minutes, seconds, comments, difficultyRating, userId) 
    VALUES ('${title}', '${type}', '${distanceUnit}', '${distance}', '${date}', '${hours}', '${minutes}', '${seconds}', '${comments}', '${difficultyRating}', '${userId}')`

  try {
    await executeQuery(sqlQuery)
  } catch (error) {
    console.log('Error inserting activity', error)
  }
}

const updateActivity = async (activity) => {
  const { title, type, distanceUnit, distance, date, hours, minutes, seconds, comments, difficultyRating, activityId } = activity

  const sqlQuery = `UPDATE activities
                    SET distance = ${distance}, date = '${date}', comments = '${comments}', difficultyRating = ${difficultyRating}, type = ${type}, title = '${title}', distanceUnit = '${distanceUnit}', hours = '${hours}', minutes = '${minutes}', seconds = '${seconds}'
                    WHERE id = ${activityId}`

  try {
    await executeQuery(sqlQuery)
  } catch (error) {
    console.log('Error inserting activity', error)
  }
}

module.exports = {
  getUserActivities,
  getUserActivityById,
  createNewActivity,
  updateActivity,
  getUserActivityCount
}
