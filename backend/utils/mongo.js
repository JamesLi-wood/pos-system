const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  connectToMongo: connectToMongo,
};
