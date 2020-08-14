const database = require('../DB/database');

const connection = database.getConnection();

module.exports = (app) => {
	app.post('/activity', async (req, res) => {
		const { distance, date, elapsedTime, comments, difficultyRating, userId } = req.body;
		console.log(distance);
		console.log(date);
		console.log(req.body);
		//const query = `INSERT INTO (distance, date, elapsedTime, comments, difficultyRating, userId) VALUES (${distance}, ${date}, ${elapsedTime}, ${comments}, ${difficultyRating}, ${userId})`;
		/* try {
			await connection.query(query, (error, results, fields) => {
				res.status(200).send('OK');
			});
		} catch (error) {
			console.log('Error inserting into database');
		} */

		res.status(200).send('ok');
	});

	app.get('/activity/:id', async (req, res) => { });

	app.put('/activity/:id', async (req, res) => { });

	app.delete('/activity/:id', async (req, res) => { });
};
