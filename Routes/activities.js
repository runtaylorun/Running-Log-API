const database = require('../DB/database');

const connection = database.getConnection();

module.exports = (app) => {
	app.post('/activity', async (req, res) => {});

	app.get('/activity/:id', async (req, res) => {});

	app.put('/activity/:id', async (req, res) => {});

	app.delete('/activity/:id', async (req, res) => {});
};
