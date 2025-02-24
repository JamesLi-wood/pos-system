const express = require("express");
const router = express.Router();

module.exports = (ticketManager) => {
  router.post("/get-ticket", (req, res) => {
    const { tableName } = req.body;
    const ticket = ticketManager.getTicket(tableName);
    const price = ticketManager.getPrice(tableName);

    try {
      res.status(200).send({
        ticket: ticket,
        price: price,
      });
    } catch (error) {
      res.status(500).send({ error: "Error processing get ticket request" });
    }
  });

  router.post("/add-ticket", (req, res) => {
    const { tableName, ticket, totalPrice } = req.body;
    try {
      if (tableName == "takeout") {
        ticketManager.addTakeoutTicket(ticket);
      } else {
        ticketManager.addTicket(tableName, ticket, totalPrice);
      }

      res.sendStatus(204);
    } catch (error) {
      res.status(500).send({ error: "Error processing add ticket request" });
    }
  });

  router.post("/clear-ticket", (req, res) => {
    const { tableName } = req.body;
    try {
      ticketManager.clearTicket(tableName);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send({ error: "Error processing empty ticket request" });
    }
  });

  router.post("/remove-item", (req, res) => {
    const { tableName, orderIdx, itemIdx } = req.body;
    try {
      ticketManager.removeItem(tableName, orderIdx, itemIdx);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send({ error: "Error processing remove item request" });
    }
  });

  router.post("/remove-takeout-ticket", (req, res) => {
    const { orderID } = req.body;
    try {
      ticketManager.removeTakeoutTicket(orderID);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send({ error: "Error processing ticket removal" });
    }
  });

  return router;
};
