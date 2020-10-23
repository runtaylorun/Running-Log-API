const mysql = require('mysql');

let connection;

const connectToDatabase = async () => {
	try {
		const init = await mysql.createConnection({
			host: '192.168.1.19',
			port: 3306,
			user: 'Taylor',
			password: 'Warsawcc@12',
			database: 'sys',
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
