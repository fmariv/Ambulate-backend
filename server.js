const express = require('express')
const app = express()
const apiRouter = require('./config/routes.js')
const bodyParser = require('body-parser');
const passport = require('passport')
const local_strategy = require('./config/passport.js')

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

passport.use(local_strategy)

// Init app
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Ambulate API is running. Server initializated at port 8080")
})