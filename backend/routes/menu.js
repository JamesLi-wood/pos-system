const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addSectionedMenu,
  addSectionedMenuItem,
  deleteSectionedMenu,
  deleteSectionedMenuItem,
  updateSectionedMenuItem,
} = require("../utils/mongo");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/add/sectioned-menu", async (req, res) => {
  const { name } = req.body;

  try {
    await addSectionedMenu(name);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: "Error adding sectioned menu" });
  }
});

router.post(
  "/add/menu-item/:sectionedMenu",
  upload.single("image"),
  async (req, res) => {
    let imageDoc = {
      name: "",
      data: null,
      contentType: "",
    };
    if (req.file) {
      imageDoc = {
        name: req.file.originalname,
        data: req.file.buffer, // buffer data of the image
        contentType: req.file.mimetype,
      };
    }
    const { sectionedMenu } = req.params;
    const data = req.body;

    const item = {
      image: imageDoc,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      requiredOptions: JSON.parse(data.requiredOptions),
      additionalOptions: JSON.parse(data.additionalOptions),
    };

    try {
      await addSectionedMenuItem(sectionedMenu, item);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send({ message: "Error adding menu item" });
    }
  }
);

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

router.patch(
  "/update/:sectionedMenu/:id",
  upload.single("image"),
  async (req, res) => {
    let imageDoc = {
      name: "",
      data: null,
      contentType: "",
    };
    if (req.file) {
      imageDoc = {
        name: req.file.originalname,
        data: req.file.buffer, // buffer data of the image
        contentType: req.file.mimetype,
      };
    }
    const { sectionedMenu, id } = req.params;
    const data = req.body;

    const item = {
      ...(imageDoc.data && { image: imageDoc }),
      name: data.name,
      description: data.description,
      price: Number(data.price),
      requiredOptions: JSON.parse(data.requiredOptions),
      additionalOptions: JSON.parse(data.additionalOptions),
    };

    try {
      await updateSectionedMenuItem(sectionedMenu, id, item);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send({ message: "Error deleting sectioned menu" });
    }
  }
);

module.exports = router;
