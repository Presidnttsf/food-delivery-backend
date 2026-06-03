const validateCreateOrder = (req, res, next) => {
  const { customerName, address, phone, items } = req.body;
  const errors = [];

  if (!customerName || !customerName.trim()) {
    errors.push("customerName is required");
  }
  if (!address || !address.trim()) {
    errors.push("address is required");
  }
  if (!phone || !phone.trim()) {
    errors.push("phone is required");
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push("Order must contain at least one item");
  } else {
    items.forEach((item, index) => {
      if (!item.menuItemId) {
        errors.push(`items[${index}].menuItemId is required`);
      }
      if (!item.quantity || item.quantity < 1) {
        errors.push(`items[${index}].quantity must be greater than 0`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;
  if (!status || !status.trim()) {
    return res.status(400).json({ success: false, errors: ["status is required"] });
  }
  next();
};

module.exports = { validateCreateOrder, validateUpdateStatus };
