const express = require('express');
const cors = require('cors');

const database = require('./DB/database');

const main = async () => {
	const app = express();

	// Configuration
	app.use(cors());

	// Databases
	await database.connectToDatabase();

	// Routes
	require('./Routes/activities.js')(app);

	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
};

main();
