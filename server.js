const express = require('express')
const app = express()
const apiRouter = require('./routes/routes.js')

// Add response 
// Response method not added yet
app.use('/ambulate-api/v1.0', apiRouter)

// Init app at port 8080
app.listen(8080, () => {
    console.log("Ambulate's API is running. Server initializated at port 8080")
})