const axios = require('axios').default;
const db = require('./db')

// object to store weather data
let forecast = {}

// initialize database client to null 
let client = null;


// TODO axios error handling
 async function getWeather(){
  
     weather = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=39.95&lon=-75.15&units=imperial&appid=f89b62f54f1ca1ebdebb9f900a62be83`)
 
     forecast['temp'] = `Current temperature: ${Math.floor(weather.data.current.temp)} degrees`
     forecast['feels_like'] = `Feels like: ${Math.floor(weather.data.current.feels_like)} degrees`
     forecast['wind_spped'] =`Wind speeds is currently: ${Math.floor(weather.data.current.wind_speed)} mph`
     forecast['humidity'] = `Humidity is ${Math.floor(weather.data.current.humidity)} percent`
     forecast['weather'] = weather.data.current.weather[0].main
     forecast['description'] = weather.data.current.weather[0].description
     var date = new Date();
     forecast['date'] = date.toISOString();
 
     client = await db.getDb()
  
     stations = await getBikes()
 
     data = {
         at: forecast.date,
         stations: stations,
         weather: forecast
     }
 
    saveData(data)
 }


// fetch bike and station data from indego API 
async function getBikes() {
    try {
    const response = await axios.get(`https://kiosks.bicycletransit.workers.dev/phl`)
    let bikes = response.data.features
    return bikes
    } catch (error){
     console.log(error)
    }
}

async function saveData(info){
    // save data to the "bikes" database and "rides" collection
    let bikes = client.db("bikes")
    let rides = bikes.collection("rides")

    // insertOne method returns a promise when successful
    const result = await rides.insertOne(info)
    console.log(`A doc was inserted with this Id: ${result.insertedId}`)

}

//export getWeather function
module.exports = {
    getWeather
}