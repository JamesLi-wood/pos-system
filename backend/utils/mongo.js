const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcrypt");

const uri = process.env.MONGO_URI;
let client;
try {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
} catch (error) {
  console.log(error);
}

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
}

async function validateUser(username, password) {
  try {
    const db = client.db("restaurant");
    const collection = db.collection("employees");

    const result = await collection.find({ username: username }).toArray();
    if (result.length == 0) return false;

    const verifyPassword = await bcrypt.compare(password, result[0].password);
    if (!verifyPassword) return false;

    return result[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getMenu() {
  try {
    const db = client.db("menu");
    const collections = await db.listCollections().toArray();
    const allData = [];

    for (const collection of collections) {
      const collectionName = collection.name;

      allData.push({
        name: collectionName,
        data: await db.collection(collectionName).find({}).toArray(),
      });
    }

    return allData;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw new Error("Failed to fetch menu");
  }
}

async function fetchTables() {
  try {
    const db = client.db("restaurant");
    const collection = db.collection("tables");
    const tableNames = (await collection.find({}).toArray()).map(
      (data) => data.name
    );
    return tableNames;
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw new Error("Failed to fetch tables");
  }
}

async function addSectionedMenu(name) {
  try {
    const db = client.db("menu");
    await db.createCollection(name);
  } catch (error) {
    console.log(error);
  }
}

async function deleteSectionedMenu(name) {
  try {
    const db = client.db("menu");
    await db.collection(name).drop();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  connectToMongo: connectToMongo,
  validateUser: validateUser,
  getMenu: getMenu,
  fetchTables: fetchTables,
  addSectionedMenu: addSectionedMenu,
  deleteSectionedMenu: deleteSectionedMenu,
};
