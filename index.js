const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport')
const database = require('./DB/database');

const main = async () => {
	const app = express();

	// Configuration
	const corsOptions = {
		origin: 'http://localhost:3000'
	};
	app.use(cors(corsOptions));
	app.use(bodyParser.json());
	app.use(express.cookieParser())
	app.use(express.session({secret: 'bigbrain@1738475039484789982'}))
	app.use(passport.initialize())
	app.use(passport.session())

	//auth
	require('./Config/passport')(passport)

	// Databases
	await database.connectToDatabase();

	// Routes
	require('./Routes/activities.js')(app);
	require('./Routes/auth.js')(app);

	const port = process.env.PORT || 5000;
	app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
};

main();
