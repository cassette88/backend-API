const express = require('express')
const router = express.Router()
const db = require('../db')

// initialize global client database variable
let client;


// Snapshot of all stations at a specified time
// EXAMPLE API CALL:
// http://localhost:3000/api/v1/stations?at=2022-09-17T14:26:48.369Z

router.get('/api/v1/stations', async (req, res) => {
    
       client = await db.getDb()   
    
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
// EXAMPLE API CALL:
// http://localhost:3000/api/v1/station/3004?at=2022-09-17T14:26:48.369Z 

router.get('/api/v1/station/:id', async (req, res) => {
         client = await db.getDb()   
        
         let kioskId = req.params.id

            let bikes = client.db("bikes")
            let rides = bikes.collection("rides")
        
           try {
           let data = await rides.findOne({at: {$gte:req.query.at}})
           
         let stations =  data.stations
         const result = stations.filter(function(station) {
             return station.properties.id == kioskId //3185
         })
    
        let test = result[0]
        let snapshot = {'at': data.at, 'station': test, 'weather': data.weather }
        res.send(snapshot)
            } catch (err){
                console.log(err)
            }
         })
    
//Snapshots of one station over a range of times
// EXAMPLE API CALL:
// http://localhost:3000/api/v1/stations/3004?from=2022-09-18T16:00:48.369Z&to=2022-09-18T16:35:06.250Z

router.get('/api/v1/stations/:id', async (req, res) => {
        client = await db.getDb()   
        let kioskId = req.params.id
    
    
            let bikes = client.db("bikes")
            let rides = bikes.collection("rides")
    
    let info = []
    
        try {
            // IMPORTANT: .find() method returns a cursor so use .toArray() or another method like .forEach() to iterate
           let data = await rides.find({at: {'$gte': req.query.from , '$lt': req.query.to }}).toArray()
           
           let feedback = {}
           // look for station data
            data.forEach(function(station){
        
                feedback['at'] = station.at
                
                let bikes = station.stations
      
               let test = bikes.filter(function(bike) {
                    return bike.properties.id == kioskId
                })
                feedback['station'] = test[0]
    
                feedback['weather'] = station.weather
    
                info.push(feedback)
    
                feedback = {}
            })
    
        res.send(info)
            } catch (err){
                console.log(err)
            }
         })    


module.exports = router;