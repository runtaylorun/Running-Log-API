const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const database = require('./DB/database');

const main = async () => {
  const app = express();

  // Configuration
  const corsOptions = {
    origin: ['http://localhost:3000', 'https://running-log-web.herokuapp.com/']
  };
  app.use(cors(corsOptions));
  app.use(cookieParser('bigbrain@83859019430090'));
  app.use(bodyParser.json());
  app.use(session({ secret: 'bigbrain@83859019430090', cookie: {}, resave: false, saveUninitialized: false }));
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


  app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
};

main();
