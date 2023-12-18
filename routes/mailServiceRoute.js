const express = require("express");
const {
  create,
  all,
  destroy,
  edit,
  activate,
} = require("../controllers/mailServiceController");

const router = express.Router();

router.post("/", create);
router.get("/", all);
router.patch("/:id", edit);
router.delete("/:id", destroy);
router.put("/:id", activate);

module.exports = { router };
