const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const MySQLStore = require('express-mysql-session')(session)
const database = require('./DB/database')
const mailer = require('./Services/mail')
const config = require('config')

const main = async () => {
  const app = express()

  const storeOptions = {
    host: process.env.DBHost || config.DBHost,
    port: process.env.DBPort || config.DBPort,
    user: process.env.DBUser || config.DBUser,
    password: process.env.DBPassword || config.DBPassword,
    database: process.env.DBName || config.DBName
  }

  const sessionStore = new MySQLStore(storeOptions)

  // Cors Configuration
  const corsOptions = {
    origin: ['http://localhost:3000', 'https://running-log-web.herokuapp.com/'],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  }
  app.use(cors(corsOptions))
  app.use(bodyParser.json())
  app.use(session({ secret: 'saijfi22jf8ej2fijojg9j20j1893jdnfjsweoiun49n58safdioj', cookie: { maxAge: 14400000 }, store: sessionStore, resave: false, saveUninitialized: false }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())

  // Databases
  await database.connectToDatabase()

  // Mail Service
  mailer.createTransport()

  // auth
  require('./Services/passport')(passport)

  // Routes
  require('./Routes/activities.js')(app)
  require('./Routes/auth.js')(app)
  require('./Routes/gear.js')(app)
  require('./Routes/user')(app)

  const host = config.HOST || '0.0.0.0'
  const port = process.env.PORT || 5000

  app.listen(port, host, () => {
    console.log(`Server running on port ${port}`)
  })
}

main()
