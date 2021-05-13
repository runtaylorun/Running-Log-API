const FitParser = require('fit-file-parser').default
const util = require('util')
const { toActivityCode } = require('./activity')
const { formatDateYYMMDD } = require('./date')
const { secondsToHourMinuteSeconds, getUtc } = require('./time')

const parseFitFile = async (buffer) => {
  const fitParser = new FitParser({
    force: true,
    speedUnit: 'km/h',
    lengthUnit: 'km',
    temperatureUnit: 'fahrenheit',
    elapsedRecordField: true,
    mode: 'cascade'
  })

  const parse = util.promisify(fitParser.parse).bind(fitParser)

  const results = await parse(buffer)

  console.log('results', results)

  const totalTimeInSeconds = getTotalTime(results)
  console.log(totalTimeInSeconds)

  const fileId = getUtc(getFileId(results))
  const date = formatDateYYMMDD(getFileId(results))
  const type = toActivityCode(getActivityType(results))
  const distance = getDistance(results)
  const title = getActivityTitle(results)
  const lapCoordinates = getLapCoordinates(results)
  const { hours, minutes, seconds } = secondsToHourMinuteSeconds(totalTimeInSeconds)

  return {
    fileId,
    date,
    type,
    title,
    lapCoordinates,
    hours,
    minutes,
    seconds,
    distance,
    distanceUnit: 'Km',
    difficultyRating: 1,
    comments: ''
  }
}

const getDistance = (object) => {
  return object.activity.sessions[0].total_distance
}

const getFileId = (object) => {
  return object.activity.timestamp
}

const getTotalTime = (object) => {
  return object.activity.sessions[0].total_timer_time
}

const getLapCoordinates = (object) => {
  const coordinates = []

  coordinates.push({
    latitude: object.activity.sessions[0].start_position_lat,
    longitude: object.activity.sessions[0].start_position_long
  })

  for (const lap of object.activity.sessions[0].laps) {
    coordinates.push({
      latitude: lap.start_position_lat,
      longitude: lap.start_position_long
    })

    coordinates.push({
      latitude: lap.end_position_lat,
      longitude: lap.end_position_long
    })
  }

  return coordinates
}

const getActivityType = (object) => {
  return object.activity.sports[0].sport
}

const getActivityTitle = (object) => {
  return object.activity.sports[0].name
}

module.exports = {
  parseFitFile
}
