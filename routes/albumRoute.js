const express = require("express");
const { updateAlbumView } = require("../controllers/albumView");

const router = express.Router();

router.patch("/", updateAlbumView);

module.exports = { router };
