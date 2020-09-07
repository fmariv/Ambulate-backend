const Pool = require('pg').Pool
const express = require('express')
const app = express()
const apiRouter = require('./config/routes.js')
const bodyParser = require('body-parser');
const passport = require('passport')
const passportConfig = require('./config/passport.js')

const localStrategy = passportConfig.localStrategy
const serialize = passportConfig.serialize
const deserialize = passportConfig.deserialize

const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
app.use('/api.ambulate/v0', apiRouter)

passport.use(localStrategy)
passport.serializeUser(serialize)
passport.deserializeUser(deserialize)

// Init app
app.listen(process.env.PORT || 8080, () => {
    console.log("Ambulate API is running. Server initializated at port 8080")
})