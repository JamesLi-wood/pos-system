const express = require("express");
const router = express.Router();
const {
  addSectionedMenu,
  addSectionedMenuItem,
  deleteSectionedMenu,
  deleteSectionedMenuItem,
  updateSectionedMenuItem,
} = require("../utils/mongo");

router.post("/add/sectioned-menu", async (req, res) => {
  const { name } = req.body;

  try {
    await addSectionedMenu(name);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: "Error adding sectioned menu" });
  }
});

router.post("/add/menu-item/:sectionedMenu", async (req, res) => {
  const { sectionedMenu } = req.params;
  const item = req.body;

  try {
    await addSectionedMenuItem(sectionedMenu, item);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: "Error adding menu item" });
  }
});

router.delete("/delete/sectioned-menu/:name", async (req, res) => {
  const { name } = req.params;

  try {
    await deleteSectionedMenu(name);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: "Error deleting sectioned menu" });
  }
});

router.delete("/delete/menu-item/:sectionedMenu/:id", async (req, res) => {
  const { sectionedMenu, id } = req.params;

  try {
    await deleteSectionedMenuItem(sectionedMenu, id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: "Error deleting sectioned menu" });
  }
});

router.patch("/update/:sectionedMenu/:id", async (req, res) => {
  const { sectionedMenu, id } = req.params;
  const item = req.body;

  try {
    await updateSectionedMenuItem(sectionedMenu, id, item);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: "Error deleting sectioned menu" });
  }
});

module.exports = router;
