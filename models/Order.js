const mongoose = require("mongoose");

const ORDER_STATUSES = ["ORDER_RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be greater than 0"],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Delivery address is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => arr && arr.length > 0,
        message: "Order must contain at least one item",
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: {
        values: ORDER_STATUSES,
        message: "{VALUE} is not a valid order status",
      },
      default: "ORDER_RECEIVED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
