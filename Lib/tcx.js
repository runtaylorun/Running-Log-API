const util = require('util')
const parseString = require('xml2js').parseString
const { secondsToHourMinuteSeconds, getUtc } = require('./time')
const { toActivityCode } = require('./activity')
const { formatDateYYMMDD } = require('./date')

const parseXmlString = util.promisify(parseString)

const parseTcxFile = async (tcxString) => {
  const activityObject = await parseXmlString(tcxString)

  const activity = { ...activityObject.TrainingCenterDatabase.Activities[0].Activity }

  const totalTimeInSeconds = getTotalTime(activity)
  const { hours, minutes, seconds } = secondsToHourMinuteSeconds(totalTimeInSeconds)
  const fileId = getUtc(getActivityId(activity))
  const type = toActivityCode(getActivityType(activity))
  const totalDistanceInMeters = Math.round(getTotalDistanceInMeters(activity))
  const calories = getTotalCaloriesBurned(activity)
  const lapCoordinates = getLapCoordinates(activity)
  const title = getActivityType(activity)
  const date = formatDateYYMMDD(getActivityDate(activity))
  console.log(activity)
  return {
    fileId,
    type,
    hours,
    minutes,
    seconds,
    distance: totalDistanceInMeters,
    distanceUnit: 'M',
    difficultyRating: 1,
    title,
    comments: '',
    calories,
    coordinates: lapCoordinates,
    date
  }
}

const getActivityType = (activity) => {
  return activity['0'].$.Sport
}

const getActivityDate = (activity) => {
  return activity['0'].Lap[0].$.StartTime
}

const getActivityId = (activity) => {
  return activity['0'].Id[0]
}

const getTotalTime = (activity) => {
  return activity['0'].Lap.reduce((accumulator, lap) => {
    return accumulator + parseFloat(lap.TotalTimeSeconds)
  }, 0)
}

const getTotalDistanceInMeters = (activity) => {
  return activity['0'].Lap.reduce((accumulator, lap) => {
    return accumulator + parseFloat(lap.DistanceMeters)
  }, 0)
}

const getTotalCaloriesBurned = (activity) => {
  return activity['0'].Lap.reduce((accumulator, lap) => {
    return accumulator + parseFloat(lap.Calories)
  }, 0)
}

const getLapCoordinates = (activity) => {
  return activity['0'].Lap.map((lap) => {
    return lap.Track[0].Trackpoint.map((point) => {
      return {
        latitude: parseFloat(point.Position[0].LatitudeDegrees[0]),
        longitude: parseFloat(point.Position[0].LongitudeDegrees[0])
      }
    })
  })
}

module.exports = {
  parseTcxFile
}
