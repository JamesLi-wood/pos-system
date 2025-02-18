require("dotenv").config();
const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const cors = require("cors");
app.use(cors());
app.use(express.json());

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});