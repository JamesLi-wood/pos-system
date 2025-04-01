const express = require("express");
const router = express.Router();
const {
  addSectionedMenu,
  addSectionedMenuItem,
  deleteSectionedMenu,
  updateSectionedMenuItem,
} = require("../utils/mongo");

router.post("/add/sectioned-menu", async (req, res) => {
  try {
    const { name } = req.body;
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
  try {
    const { name } = req.params;
    await deleteSectionedMenu(name);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: "Error deleting sectioned menu" });
  }
});

router.delete("/delete/menu-item/:sectionedMenu", (req, res) => {
  const { sectionedMenu } = req.params;
  // do logic
  res.sendStatus(204);
});

router.patch("/update/:sectionedMenu/:id", async (req, res) => {
  const { sectionedMenu, id } = req.params;
  const item  = req.body;
  await updateSectionedMenuItem(sectionedMenu, id, item);
  res.sendStatus(204);
});

module.exports = router;
