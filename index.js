// import dependencies
const weather = require('./saveData')
const client = require('./db')
const express = require('express')
const app = express()
const port = 3000

// route and middleware setup
const stationData = require('./routes/stations')
app.use(stationData)


// start app
app.listen(port, () => {
    console.log(`Listening on ${port}`)

// connect to database
    client.startDb()
})

// fetch weather and bicycle data to be saved
weather.getWeather()
// then save at certain interval, here 30 minutes (in milliseconds)
setInterval(() => {(weather.getWeather())}, 1800000)













