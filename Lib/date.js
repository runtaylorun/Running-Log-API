const Moment = require('moment')

const formatDateYYMMDD = (dateString) => {
  return Moment(dateString).format('YYYY-MM-DD')
}

module.exports = {
  formatDateYYMMDD
}
