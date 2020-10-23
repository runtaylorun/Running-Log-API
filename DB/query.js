const database = require('./database')
const connection = database.getConnection()

const executeQuery = async (sqlQuery, callback) => {
    try {
        await connection.query(sqlQuery, (error, results) => {
            if (error) throw error
            callback(results)
        })
    } catch (error) {
        console.log('Error executing query', error)
    }
}

const queryBuilder = (urlQuery) => {
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

    return additionalQueries
}

module.exports = {
    executeQuery,
    queryBuilder
}



/* const formattedResults = results.map(activity => (
    {
        ...activity,
        date: moment(activity.date).format('YYYY-MM-DD')
    }
)) */