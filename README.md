# Food Delivery Order Management API

Production-ready REST API built with Node.js, Express, MongoDB, and Mongoose.

## Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Testing**: Jest + Supertest

---

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── menuController.js     # Menu request handlers
│   └── orderController.js    # Order request handlers
├── middleware/
│   ├── errorHandler.js       # Centralized error handling
│   └── validate.js           # Request validation
├── models/
│   ├── MenuItem.js           # MenuItem schema
│   └── Order.js              # Order schema + statuses
├── routes/
│   ├── menuRoutes.js
│   └── orderRoutes.js
├── services/
│   ├── menuService.js        # Menu business logic
│   └── orderService.js       # Order business logic
├── tests/
│   └── api.test.js           # Jest + Supertest tests
├── app.js                    # Express app (no server.listen)
├── server.js                 # Entry point
└── package.json
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI

# 3. Start development server
npm run dev

# 4. Or start production server
npm start
```

---

## API Reference

### Menu

| Method | Endpoint      | Description            |
|--------|---------------|------------------------|
| GET    | /api/menu     | Get all menu items     |

### Orders

| Method | Endpoint                  | Description            |
|--------|---------------------------|------------------------|
| POST   | /api/orders               | Create a new order     |
| GET    | /api/orders/:id           | Get order by ID        |
| PUT    | /api/orders/:id/status    | Update order status    |

### Order Status Flow
```
ORDER_RECEIVED → PREPARING → OUT_FOR_DELIVERY → DELIVERED
```

### Create Order — Request Body
```json
{
  "customerName": "Alice",
  "address": "123 Main Street",
  "phone": "9876543210",
  "items": [
    { "menuItemId": "<ObjectId>", "quantity": 2 }
  ]
}
```

### Create Order — Response
```json
{
  "success": true,
  "data": {
    "orderId": "<ObjectId>",
    "status": "ORDER_RECEIVED",
    "totalAmount": 25.98
  }
}
```

---

## Testing

```bash
# Run all tests
npm test

# With coverage report
npm run test:coverage
```

Tests cover:
- ✅ Get all menu items
- ✅ Create order (valid + multiple items)
- ✅ Invalid order requests (all validation rules)
- ✅ Get order by ID
- ✅ Update order status (all valid statuses)
- ✅ Edge cases: missing fields, invalid IDs, unknown routes

---

## Environment Variables

| Variable        | Default                                      | Description           |
|-----------------|----------------------------------------------|-----------------------|
| PORT            | 3000                                         | Server port           |
| MONGODB_URI     | mongodb://localhost:27017/food-delivery      | MongoDB URI           |
| MONGODB_URI_TEST| mongodb://localhost:27017/food-delivery-test | Test DB URI           |
| NODE_ENV        | development                                  | Environment           |


## Author

- **Tauseef Akhtar** - *Initial Work / Developer* - https://github.com/Presidnttsf/food-delivery-backend