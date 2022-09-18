const { MongoClient } = require("mongodb");

// enter connection string here or use environment variable
const uri = ''

let client;

async function startDb(){ 

client = new MongoClient(uri);
    
 try {
        await client.connect()
        console.log('connected to database')
       
    } catch (err){
        console.log (err)
    }
}

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