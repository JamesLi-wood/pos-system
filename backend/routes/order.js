const express = require("express");
const { getMenu, fetchTables } = require("../utils/mongo");
const router = express.Router();

router.get("/menu", async (req, res) => {
  const menu = await getMenu();
  const tables = await fetchTables();

  res.status(200).send({
    menu: menu,
    tables: tables,
  });
});

module.exports = router;
