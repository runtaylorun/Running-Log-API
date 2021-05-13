const Moment = require('moment')
const secondsToHourMinuteSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - (hours * 3600)) / 60)
  const leftoverSeconds = Math.floor((seconds - (hours * 3600) - (minutes * 60)))

  return {
    hours,
    minutes,
    seconds: leftoverSeconds
  }
}

const subtractTimestamps = (timestamp1, timestamp2) => {
  const date1 = Moment(timestamp2)
  const date2 = Moment(timestamp1)

  return secondsToHourMinuteSeconds(date1.diff(date2, 'seconds'))
}

const getUtc = (timestamp) => {
  return Moment.utc(timestamp).format()
}

module.exports = {
  secondsToHourMinuteSeconds,
  subtractTimestamps,
  getUtc
}
