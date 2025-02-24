const express = require("express");
const router = express.Router();
const ticketRoutes = require("../controllers/ticketRoutes");
const { getMenu, fetchTables } = require("../utils/mongo");
const { ticketManager } = require("../utils/ticketManager");

fetchTables().then((tableNames) => {
  ticketManager.initialize(tableNames);
  router.use("/ticket", ticketRoutes(ticketManager));
});

router.get("/menu", async (req, res) => {
  const menu = await getMenu();
  const tables = await fetchTables();

  res.status(200).send({
    menu: menu,
    tables: tables,
  });
});

module.exports = router;
