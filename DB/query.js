const database = require('./database')
const connection = database.getConnection()
const util = require('util')

const query = util.promisify(connection.query).bind(connection)

const executeQuery = async (sqlQuery) => {
  try {
    const results = await query(sqlQuery)

    return results
  } catch (error) {
    console.log('Error executing query', error)
  }
}

const activityQueryBuilder = (urlQuery) => {
  let additionalQueries = ''

  if (urlQuery.month) {
    additionalQueries += ` AND MONTH(date) = \'${urlQuery.month}\'`
  }

  if (urlQuery.year) {
    additionalQueries += ` AND YEAR(date) = \'${urlQuery.year}\'`
  }

  if (urlQuery.startDate && urlQuery.endDate) {
    additionalQueries += ` AND date BETWEEN \'${urlQuery.startDate}\' AND \'${urlQuery.endDate}\'`
  }

  if (!urlQuery.startDate && urlQuery.endDate) {
    additionalQueries += ` AND date < \'${urlQuery.endDate}\'`
  }

  if (urlQuery.type) {
    additionalQueries += ` AND activities.type = \'${urlQuery.type}\'`
  }

  if (urlQuery.searchTerm) {
    additionalQueries += ` AND title LIKE \'${urlQuery.searchTerm}%\'`
  }

  additionalQueries += ` ORDER BY activities.${urlQuery?.column ?? 'date'} ${urlQuery?.sortDirection ?? 'DESC'}`

  if (urlQuery?.limit) {
    additionalQueries += ` LIMIT ${urlQuery.limit}`
  }

  if (urlQuery?.offset) {
    additionalQueries += ` OFFSET ${urlQuery.offset}`
  }

  return additionalQueries
}

const gearQueryBuilder = (urlQuery) => {
  let additionalQueries = ''

  if (urlQuery.startDate && urlQuery.endDate) {
    additionalQueries += ` AND date BETWEEN \'${urlQuery.startDate}\' AND \'${urlQuery.endDate}\'`
  }

  if (!urlQuery.startDate && urlQuery.endDate) {
    additionalQueries += ` AND date < \'${urlQuery.endDate}\'`
  }

  if (urlQuery?.limit) {
    additionalQueries += ` LIMIT ${urlQuery.limit}`
  }

  return additionalQueries
}

module.exports = {
  executeQuery,
  activityQueryBuilder,
  gearQueryBuilder
}
