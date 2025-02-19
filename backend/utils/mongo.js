const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcrypt");

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

async function validateUser(username, password) {
  const db = client.db("restaurant");
  const collection = db.collection("employees");

  const result = await collection.find({ username: username }).toArray();
  if (result.length == 0) return false;

  const verifyPassword = await bcrypt.compare(password, result[0].password);
  if (!verifyPassword) return false;

  return result[0];
}

module.exports = {
  connectToMongo: connectToMongo,
  validateUser: validateUser,
};
