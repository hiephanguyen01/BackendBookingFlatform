const express = require("express");
const {
  getRestrictedWordsList,
  getDetailRestrictedWord,
  addRestrictedWord,
  deleteRestrictedWord,
  updateRestrictedWord,
  deleteAllRestrictedWord,
} = require("../controllers/retrictedWord");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");
const router = express.Router();

router.get("/", jwtAuth, authorize({ setting: 2 }), getRestrictedWordsList);
router.post("/", jwtAuth, authorize({ setting: 3 }), addRestrictedWord);
router.get("/:id", jwtAuth, authorize({ setting: 2 }), getDetailRestrictedWord);
router.delete("/:id", jwtAuth, authorize({ setting: 3 }), deleteRestrictedWord);
router.patch("/:id", jwtAuth, authorize({ setting: 3 }), updateRestrictedWord);
router.delete("/", jwtAuth, authorize({ setting: 3 }), deleteAllRestrictedWord);

module.exports = { router };
