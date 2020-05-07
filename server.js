const express = require('express')
const app = express()
const apiRouter = require('./routes/routes.js')

// Add response 
app.use('/api.ambulate/v0', apiRouter)

// Init app at port 8080
app.listen(8080, () => {
    console.log("Ambulate API is running. Server initializated at port 8080")
})