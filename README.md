# Overview
Indego is a bike sharing program launched in Philadelphia. A design company in the city created a challenge for developers. The task was to build an app that saves the results from the bicycle API to a MongoDB database at a specific interval. The data can be queried via 3 APIs:

- Snapshot of all stations at a specified time

- Snapshot of one station at a specific time

- Snapshots of one station over a range of times

# Functions  

## Start Application 
- app.listen

## getDB
-  Establishes a connection with the database

## getWeather
- Fetches the current weather

## getBikes
- Fetches bike availability from the indego API

## saveData
- Saves historical bicycle data

## API Routes:

##### Snapshot of all stations at a specified time

* app.get /api/v1/stations

#####  Snapshot of one station at a specific time
* app.get /api/v1/station/:id

#####  Snapshots of one station over a range of times
* app.get /api/v1/stations/:id
    
<br/><br/>
To Do:
Add tests