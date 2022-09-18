const { MongoClient } = require("mongodb");

// enter connection string here or use environment variable
const uri = ''

let client;

// establish a connection with the database
async function startDb(){ 

client = new MongoClient(uri);
    
 try {
        await client.connect()
        console.log('connected to database')
       
    } catch (err){
        console.log (err)
    }
}

// share the database connection with other parts of the app

async function getDb(){
    if(!client){
        client = new MongoClient(uri);
        await client.connect()
        return client
    } else {
        return client 
    }
}



module.exports = { 
    startDb, getDb

}