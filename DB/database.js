const mysql = require('mysql');
const config = require('../config.json')

let connection;

const connectToDatabase = async () => {
	try {
		const init = await mysql.createConnection({
			host: config.DBHost,
			port: config.DBPort,
			user: config.DBUser,
			password: config.DBPassword,
			database: config.DBName,
			ssl: {
				ca: fs.readFileSync(__dirname + '/Certs/rds-ca-2019-root.pem')
			},
			insecureAuth: true,
		});
		connection = init;
	} catch (error) {
		console.log('Error connecting to database:', error);
	}
};

module.exports = {
	connectToDatabase,
	getConnection: () => connection,
};
