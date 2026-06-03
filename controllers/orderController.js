const orderService = require("../services/orderService");

const createOrder = async (req, res, next) => {
  try {
    const { customerName, address, phone, items } = req.body;
    const result = await orderService.createOrder({ customerName, address, phone, items });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getOrderById, updateOrderStatus };
