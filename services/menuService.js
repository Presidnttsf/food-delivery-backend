const MenuItem = require("../models/MenuItem");

const getAllMenuItems = async () => {
  return MenuItem.find({ available: true }).select("-__v").lean();
};

const getMenuItemById = async (id) => {
  return MenuItem.findById(id).lean();
};

module.exports = { getAllMenuItems, getMenuItemById };
