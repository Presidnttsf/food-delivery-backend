const menuService = require("../services/menuService");

const getMenu = async (req, res, next) => {
  try {
    const items = await menuService.getAllMenuItems();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMenu };
