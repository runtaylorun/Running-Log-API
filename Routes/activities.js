const database = require('../DB/database');
const moment = require('moment');

const connection = database.getConnection();

module.exports = (app) => {
  app.post('/activity', async (req, res) => {
    const { activityTitle, type, distanceUnit, distance, date, elapsedTime, comments, difficultyRating, userId } = req.body.activity;
    const query = ` INSERT INTO activities 
    (activityTitle, type, distanceUnit, distance, date, elapsedTime, comments, difficultyRating, userId) 
    VALUES ('${activityTitle}', '${type}', '${distanceUnit}', '${distance}', '${date}', '${elapsedTime}', '${comments}', '${difficultyRating}', '${userId}')`;

    try {
      await connection.query(query, (error, results, fields) => {
        if (error) throw error;

        res.status(201).send('ok');
      });
    } catch (error) {
      console.log('Error inserting into database');
    }
  });

  app.get('/activity/:userId', async (req, res) => {
    const { userId } = req.params;

    const query = `SELECT Activities.activityId, Activities.userId, Activities.distance, Activities.date, Activities.elapsedTime, Activities.comments, Activities.difficultyRating,
    Activities.activityTitle, Activities.type, Activities.distanceUnit, activityTypes.type
    FROM Activities 
		INNER JOIN activityTypes ON Activities.type = activityTypes.activityCode
		WHERE userId = ${userId} AND MONTH(date) = ${req.query.month} AND YEAR(date) 
			= ${req.query.year} `;

    try {
      await connection.query(query, (error, results, fields) => {
        if (error) throw error;

        const formattedResults = results.map(activity => {
          return {
            ...activity,
            date: moment(activity.date).format('YYYY-MM-DD')
          };
        });

        res.status(200).send(formattedResults);
      });
    } catch (error) {
      console.log('Error getting user activities', error);
    }
  });

  app.get('/activity/:userId/:activityId', async (req, res) => {
    const { activityId } = req.params;

    const query = `SELECT Activities.*, activityTypes.activityCode FROM Activities INNER JOIN activityTypes ON Activities.type = activityTypes.activityCode WHERE activityId = ${activityId}`;

    try {
      await connection.query(query, (error, results, fields) => {
        if (error) throw error;

        const formattedResults = results.map(activity => {
          return {
            ...activity,
            date: moment(activity.date).format('YYYY-MM-DD')
          };
        });
        res.status(200).send(formattedResults);
      });
    } catch (error) {
      console.log('error fetching single activity', error);
    }
  });

  app.put('/activity/:id', async (req, res) => {
    const { activityTitle, type, distanceUnit, distance, date, elapsedTime, comments, difficultyRating, activityId } = req.body.activity;

    const query = `UPDATE Activities
                    SET distance = ${distance}, date = '${date}', elapsedTime = '${elapsedTime}', comments = '${comments}', difficultyRating = ${difficultyRating}, type = ${type}, activityTitle = '${activityTitle}', distanceUnit = '${distanceUnit}'
                    WHERE activityId = ${activityId}`;

    await connection.query(query, (error, results, fields) => {
      if (error) throw error;

      res.status(200).send(results);
    });

  });

  app.delete('/activity/:id', async (req, res) => { });
};
