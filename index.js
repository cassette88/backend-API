// import dependencies
const axios = require('axios').default;
const _ = require('lodash');
const { MongoClient } = require("mongodb");

const express = require('express')
const app = express()
const port = 3000

const uri =  ''

const client = new MongoClient(uri);

let db;
let collection;
let data = {}

async function getDB(){ 
    try {
        await client.connect()
        console.log('connected to database')
     //   getWeather()
    } catch (err){
        console.log (err)
    }
}


// store data
let forecast = {}


// weather API
// TODO axios error handling
async function getWeather(){
    // let forecast = {}
 
     weather = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=39.95&lon=-75.15&units=imperial&appid=f89b62f54f1ca1ebdebb9f900a62be83`)
 
     forecast['temp'] = `Current temperature: ${Math.floor(weather.data.current.temp)} degrees`
     forecast['feels_like'] = `Feels like: ${Math.floor(weather.data.current.feels_like)} degrees`
     forecast['wind_spped'] =`Wind speeds is currently: ${Math.floor(weather.data.current.wind_speed)} mph`
     forecast['humidity'] = `Humidity is ${Math.floor(weather.data.current.humidity)} percent`
     forecast['weather'] = weather.data.current.weather[0].main
     forecast['description'] = weather.data.current.weather[0].description
     var date = new Date();
     forecast['date'] = date.toISOString();
 
    // forecast ['bikes'] = await getBikes()
     stations = await getBikes()
 
     data = {
         at: forecast.date,
       //  stations: _.flatten(forecast.bikes),
         stations: stations,
         weather: forecast
     }
 
  //   console.log (data)
    saveData(data)
    // bikesAndWeather[0] = forecast
    // console.log(bikesAndWeather)
 }

 // call bike API
// TODO: error handling
async function getBikes() {
    try {
    const response = await axios.get(`https://kiosks.bicycletransit.workers.dev/phl`)
    let bikes = response.data.features
    //console.log(bikes)
    //bikesAndWeather.push(bikes)
    return bikes
    } catch (error){
     console.log(error)

    }
}

async function saveData(info){

    let bikes = client.db("bikes")
    let rides = bikes.collection("rides")

    //const doc = {"test": "string"}

    const result = await rides.insertOne(info)

    console.log(`A doc was inserted with this Id: ${result.insertedId}`)
  //  console.log(data)
}




app.get('/', (req, res) => {
   // res.send('Hello World')
    res.send(data)
})

///api/v1/stations?at=2017-11-01T11:00:00

// on GET "/users?id=4" this would print "4"

// Snapshot of all stations at a specified time
app.get('/api/v1/stations', async (req, res) => {
    
//        res.send(req.query.at)
    
   let bikes = client.db("bikes")
   let rides = bikes.collection("rides")

   try {
   let data = await rides.findOne({at: {$gte:req.query.at}})
   res.send(data)
    } catch (err){
        console.log(err)
    }
 })

// Snapshot of one station at a specific time

app.get('/api/v1/station/:id', async (req, res) => {
    
    let kioskId = req.params.id
    let date = req.query.at   

        let bikes = client.db("bikes")
        let rides = bikes.collection("rides")
    
       try {
       let data = await rides.findOne({at: {$gte:req.query.at}})
       
     let stations =  data.stations
     const result = stations.filter(function(station) {
         return station.properties.id == kioskId
     })

    let test = result[0]
    let snapshot = {'at': data.at, 'station': test, 'weather': data.weather }
    res.send(snapshot)
       // use filter to loop
    //console.log(result)
        } catch (err){
            console.log(err)
        }
     })

//Snapshots of one station over a range of times
 
app.get('/api/v1/stations/:id', async (req, res) => {
    
    let kioskId = req.params.id


        let bikes = client.db("bikes")
        let rides = bikes.collection("rides")

let info = []

    try {
        // don't forget to note .toArray()struggle haha 

       let data = await rides.find({at: {'$gte': req.query.from , '$lt': req.query.to }}).toArray()
       
       let feedback = {}
       // look for station data
        data.forEach(function(station){
    
            feedback['at'] = station.at
            
            let bikes = station.stations
        //    console.log(bikes)
           let test = bikes.filter(function(bike) {
                return bike.properties.id == kioskId
            })
            feedback['station'] = test[0]

            feedback['weather'] = station.weather

            info.push(feedback)

            feedback = {}
        })

//    let bikes =  data
//      const result = bikes.filter(function(bike) {
//          return bike.stations[0].properties.id == kioskId
//      })

  //  let test = result[0]
  //  let snapshot = {'at': data.at, 'station': test, 'weather': data.weather }
    res.send(info)
  //  console.log(result)
        } catch (err){
            console.log(err)
        }
     })    

app.listen(port, () => {
    console.log(`Listening on ${port}`)
 //   getWeather()
    getDB()
   // getBikes()
})






// save data to mongo

// set up express api to query mongo


