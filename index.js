const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)
const cookieParser = require('cookie-parser');
const database = require('./DB/database');
const config = require('./config.json')

const main = async () => {
  const app = express();

  const storeOptions = {
    host: process.env.DBHost || config.DBHost,
    port: process.env.DBPort || config.DBPort,
    user: process.env.DBUser || config.DBUser,
    password: process.env.DBPassword || config.DBPassword,
    database: process.env.DBName || config.DBName,
  }

  const sessionStore = new MySQLStore(storeOptions)

  // Configuration
  const corsOptions = {
    origin: ['http://localhost:3000', 'https://running-log-web.herokuapp.com/']
  };
  app.use(cors(corsOptions));
  app.use(cookieParser('bigbrain@83859019430090'));
  app.use(bodyParser.json());
  app.use(session({ secret: 'bigbrain@83859019430090', store: sessionStore, cookie: {}, resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Databases
  await database.connectToDatabase();

  // auth
  require('./Config/passport')(passport);

  // Routes
  require('./Routes/activities.js')(app);
  require('./Routes/auth.js')(app);
  require('./Routes/gear.js')(app);


  const host = config?.HOST || '0.0.0.0'
  const port = process.env.PORT || 5000

  app.listen(port, host, () => {
    console.log(`Server running on port ${port}`);
  });
};

main();
