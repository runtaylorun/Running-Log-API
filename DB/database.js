const mysql = require('mysql');
const fs = require('fs')
const config = require('config')

let connection;

const connectToDatabase = async () => {
	try {
		const init = await mysql.createConnection({
			host: process.env.DBHost || config.DBHost,
			port: process.env.DBPort || config.DBPort,
			user: process.env.DBUser || config.DBUser,
			password: process.env.DBPassword || config.DBPassword,
			database: process.env.DBName || config.DBName,
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
