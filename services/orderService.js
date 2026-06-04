const Order = require("../models/Order");
const { ORDER_STATUSES } = require("../models/Order");
const { getMenuItemById } = require("./menuService");

const createOrder = async ({ customerName, address, phone, items }) => {
  // Validate items array presence (belt-and-suspenders beyond Mongoose)
  if (!items || items.length === 0) {
    const err = new Error("Order must contain at least one item");
    err.statusCode = 400;
    throw err;
  }

  // Resolve each menu item and build enriched order items
  const enrichedItems = await Promise.all(
    items.map(async ({ menuItemId, quantity }) => {
      if (!quantity || quantity < 1) {
        const err = new Error("Quantity must be greater than 0");
        err.statusCode = 400;
        throw err;
      }

      const menuItem = await getMenuItemById(menuItemId);
      if (!menuItem) {
        const err = new Error(`Menu item not found: ${menuItemId}`);
        err.statusCode = 404;
        throw err;
      }

      return {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      };
    })
  );

  const totalAmount = enrichedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    customerName,
    address,
    phone,
    items: enrichedItems,
    totalAmount,
  });

  return {
    orderId: order._id,
    status: order.status,
    totalAmount: order.totalAmount,
  };
};

const getOrderById = async (id) => {
  const order = await Order.findById(id).select("-__v").lean();
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }
  return order;
};

const updateOrderStatus = async (id, status) => {
  if (!ORDER_STATUSES.includes(status)) {
    const err = new Error(
      `Invalid status. Allowed: ${ORDER_STATUSES.join(", ")}`
    );
    err.statusCode = 400;
    throw err;
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  )
    .select("-__v")
    .lean();

  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }

  return order;
};

const updateOrderToNextStatus = async (id) => {
  const order = await Order.findById(id);

  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }

  const statusFlow = [
    "ORDER_RECEIVED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  const currentIndex = statusFlow.indexOf(order.status);

  if (currentIndex < statusFlow.length - 1) {
    order.status = statusFlow[currentIndex + 1];
    await order.save();
  }

  return order;
};


module.exports = { createOrder, getOrderById, updateOrderStatus, updateOrderToNextStatus };
