const { MongoClient } = require("mongodb")

const mongoClient =  new MongoClient(process.env.Database_URI)


module.exports = async function (context, req) {

    try{
        await mongoClient.connect();
        const database = await mongoClient.db(process.env.MONGODB_DATABASE)
        const collection = database.collection(process.env.MONGODB_COLLECTION)
        const results = await collection.find({}).toArray()
        context.res = {
            "headers":{
                "content-type": "application/json"
            },
            "body": results
        }
    } catch (error) {
        context.res = {
            "status": 500,
            "headers": {
                "content-type": "application/json"
            },
            "body": {
                "message": error.toString()
            }
        }

    }


}