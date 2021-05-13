const util = require('util')
const parseString = require('xml2js').parseString
const { toActivityCode } = require('./activity')
const { formatDateYYMMDD } = require('./date')
const { subtractTimestamps, getUtc } = require('./time')

const parseXmlString = util.promisify(parseString)

const parseGpxFile = async (gpxString) => {
  const activityObject = await parseXmlString(gpxString)

  const activity = { ...activityObject.gpx.trk }

  const fileId = getUtc(getFileId(activityObject))
  const title = getActivityTitle(activity)
  const type = toActivityCode(getActivityType(activity))
  const lapCoordinates = getLapCoordinates(activity)
  const { hours, minutes, seconds } = getTime(activity)
  const date = formatDateYYMMDD(getActivityDate(activityObject))
  const cadence = getCadence(activity)
  const distance = getDistance(lapCoordinates)

  return {
    fileId,
    type,
    hours,
    minutes,
    seconds,
    distance,
    distanceUnit: 'Km',
    difficultyRating: 1,
    title,
    comments: '',
    coordinates: lapCoordinates,
    date,
    cadence
  }
}

const getTime = (activity) => {
  const startTime = activity['0'].trkseg[0].trkpt[0].time[0]
  const endTime = activity['0'].trkseg[0].trkpt[activity['0'].trkseg[0].trkpt.length - 1].time[0]

  return subtractTimestamps(startTime, endTime)
}

const getFileId = (activity) => {
  return activity.gpx.metadata[0].time[0]
}

const getCadence = (activity) => {
  return activity[0].trkseg[0].trkpt[0].extensions[0]['ns3:TrackPointExtension'][0]['ns3:Track:cad']
}

const getActivityDate = (activity) => {
  return activity.gpx.metadata[0].time[0]
}

const getActivityTitle = (activity) => {
  return activity['0'].name[0]
}

const getActivityType = (activity) => {
  return activity['0'].type[0]
}

const getLapCoordinates = (activity) => {
  return activity['0'].trkseg[0].trkpt.map((lap) => {
    return {
      latitude: parseFloat(lap.$.lat),
      longitude: parseFloat(lap.$.lon)
    }
  })
}

const getDistance = (coords) => {
  const distances = []
  for (let i = 0; i < coords.length - 1; i++) {
    distances.push(haversine(coords[i], coords[i + 1]))
  }

  return distances.reduce((accumulator, value) => {
    return accumulator + value
  }, 0)
}

const toRad = (number) => {
  return number * Math.PI / 180
}

const haversine = (coordinate1, coordinate2) => {
  var lat2 = coordinate2.latitude
  var lon2 = coordinate2.longitude
  var lat1 = coordinate1.latitude
  var lon1 = coordinate1.longitude

  var R = 6371 // km
  var x1 = lat2 - lat1
  var dLat = toRad(x1)
  var x2 = lon2 - lon1
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var distance = R * c

  return distance
}

module.exports = {
  parseGpxFile
}
