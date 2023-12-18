const express = require("express");
const {
  addServiceToCart,
  getCartItemByCategory,
  getCartItemCheckout,
  removeServiceFromCart,
} = require("../controllers/cartController");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

router.post("/add-service-to-cart", jwtAuth, addServiceToCart);
router.delete("/remove-service-from-cart/:id", jwtAuth, removeServiceFromCart);
router.get("/cart-item", jwtAuth, getCartItemByCategory);
router.get("/checkout", jwtAuth, getCartItemCheckout);

module.exports = { router };
