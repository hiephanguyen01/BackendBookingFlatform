const express = require("express");
const { getTop10OrderPhotographerPost } = require("../controllers/PhotographerController");


const router = express.Router();

router.get("/top-10-order",getTop10OrderPhotographerPost );


module.exports = { router };
