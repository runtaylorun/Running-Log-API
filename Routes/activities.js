const database = require('../DB/database');

const connection = database.getConnection();

module.exports = (app) => {
	app.get('/activity/:id', async (req, res) => {
		const activity = await connection.query('SELECT * FROM Activities', (err, results, fields) => {
			res.send(results[0]);
		});
	});
};
