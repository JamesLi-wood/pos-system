require("dotenv").config();
const authRoute = require("./routes/auth");
const orderRoute = require("./routes/order");
const menuRoute = require("./routes/menu");
const { connectToMongo } = require("./utils/mongo");
const express = require("express");
const app = express();

const socketIoSetup = require("./utils/socket");
const http = require("http");
const server = http.createServer(app);
socketIoSetup(server);

const cors = require("cors");
app.use(cors());
app.use(express.json());

connectToMongo();

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});

app.use("/auth", authRoute);

app.use("/order", orderRoute);

app.use("/menu", menuRoute);
