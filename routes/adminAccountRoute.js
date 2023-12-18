const express = require("express");
const {
  getAll,
  getById,
  login,
  update,
  createAdmin,
  deleteAdmin,
  me,
} = require("../controllers/adminAccount");

const router = express.Router();

router.get("/", getAll);
router.get("/me", me);
router.get("/:id", getById);
router.post("/login", login);
router.post("/create", createAdmin);
router.patch("/:id", update);
router.delete("/:id", deleteAdmin);

module.exports = { router };
