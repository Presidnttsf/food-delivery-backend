const express = require("express");
const router = express.Router();
const { createOrder, getOrderById, updateOrderStatus } = require("../controllers/orderController");
const { validateCreateOrder, validateUpdateStatus } = require("../middleware/validate");

router.post("/", validateCreateOrder, createOrder);
router.get("/:id", getOrderById);
router.put("/:id/status", validateUpdateStatus, updateOrderStatus);

module.exports = router;
