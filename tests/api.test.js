require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");

const TEST_DB_URI =
  process.env.MONGODB_URI_TEST || process.env.MONGODB_URI;
// ─── Test data ────────────────────────────────────────────────────────────────
const sampleMenuItems = [
  {
    name: "Margherita Pizza",
    description: "Classic tomato and mozzarella",
    price: 12.99,
    image: "https://example.com/pizza.jpg",
  },
  {
    name: "Chicken Burger",
    description: "Crispy chicken fillet burger",
    price: 8.49,
    image: "https://example.com/burger.jpg",
  },
];

// ─── Lifecycle ────────────────────────────────────────────────────────────────
beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

beforeEach(async () => {
  await MenuItem.deleteMany({});
  await Order.deleteMany({});
  await MenuItem.insertMany(sampleMenuItems);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// ─── Menu Tests ───────────────────────────────────────────────────────────────
describe("GET /api/menu", () => {
  it("returns all available menu items with 200", async () => {
    const res = await request(app).get("/api/menu");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toMatchObject({
      name: expect.any(String),
      price: expect.any(Number),
    });
  });

  it("returns an empty array when no menu items exist", async () => {
    await MenuItem.deleteMany({});
    const res = await request(app).get("/api/menu");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

// ─── Order Creation Tests ─────────────────────────────────────────────────────
describe("POST /api/orders", () => {
  it("creates an order and returns orderId, status, totalAmount", async () => {
    const menuItems = await MenuItem.find();
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Alice",
        address: "123 Main St",
        phone: "9876543210",
        items: [{ menuItemId: menuItems[0]._id, quantity: 2 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      orderId: expect.any(String),
      status: "ORDER_RECEIVED",
      totalAmount: menuItems[0].price * 2,
    });
  });

  it("calculates totalAmount correctly for multiple items", async () => {
    const menuItems = await MenuItem.find();
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Bob",
        address: "456 Elm St",
        phone: "1234567890",
        items: [
          { menuItemId: menuItems[0]._id, quantity: 1 },
          { menuItemId: menuItems[1]._id, quantity: 3 },
        ],
      });

    const expectedTotal =
      menuItems[0].price * 1 + menuItems[1].price * 3;

    expect(res.status).toBe(201);
    expect(res.body.data.totalAmount).toBeCloseTo(expectedTotal, 2);
  });

  // ── Validation failures ──
  it("returns 400 when customerName is missing", async () => {
    const menuItems = await MenuItem.find();
    const res = await request(app)
      .post("/api/orders")
      .send({
        address: "123 Main St",
        phone: "9876543210",
        items: [{ menuItemId: menuItems[0]._id, quantity: 1 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toContain("customerName is required");
  });

  it("returns 400 when address is missing", async () => {
    const menuItems = await MenuItem.find();
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Alice",
        phone: "9876543210",
        items: [{ menuItemId: menuItems[0]._id, quantity: 1 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain("address is required");
  });

  it("returns 400 when phone is missing", async () => {
    const menuItems = await MenuItem.find();
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Alice",
        address: "123 Main St",
        items: [{ menuItemId: menuItems[0]._id, quantity: 1 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain("phone is required");
  });

  it("returns 400 when items array is empty", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Alice",
        address: "123 Main St",
        phone: "9876543210",
        items: [],
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain("Order must contain at least one item");
  });

  it("returns 400 when quantity is 0", async () => {
    const menuItems = await MenuItem.find();
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Alice",
        address: "123 Main St",
        phone: "9876543210",
        items: [{ menuItemId: menuItems[0]._id, quantity: 0 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toMatch(/quantity must be greater than 0/i);
  });

  it("returns 404 when menuItemId does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Alice",
        address: "123 Main St",
        phone: "9876543210",
        items: [{ menuItemId: fakeId, quantity: 1 }],
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/menu item not found/i);
  });

  it("returns 400 when menuItemId is an invalid ObjectId", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Alice",
        address: "123 Main St",
        phone: "9876543210",
        items: [{ menuItemId: "not-a-valid-id", quantity: 1 }],
      });

    expect(res.status).toBe(400);
  });
});

// ─── Get Order By ID Tests ────────────────────────────────────────────────────
describe("GET /api/orders/:id", () => {
  let createdOrderId;

  beforeEach(async () => {
    const menuItems = await MenuItem.find();
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Carol",
        address: "789 Oak Ave",
        phone: "5551234567",
        items: [{ menuItemId: menuItems[0]._id, quantity: 1 }],
      });
    createdOrderId = res.body.data.orderId;
  });

  it("returns the order with all fields", async () => {
    const res = await request(app).get(`/api/orders/${createdOrderId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      customerName: "Carol",
      address: "789 Oak Ave",
      phone: "5551234567",
      status: "ORDER_RECEIVED",
      totalAmount: expect.any(Number),
      items: expect.arrayContaining([
        expect.objectContaining({ quantity: 1 }),
      ]),
    });
  });

  it("returns 404 for a non-existent order ID", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/orders/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/order not found/i);
  });

  it("returns 400 for an invalid ObjectId format", async () => {
    const res = await request(app).get("/api/orders/invalid-id");
    expect(res.status).toBe(400);
  });
});

// ─── Update Order Status Tests ────────────────────────────────────────────────
describe("PUT /api/orders/:id/status", () => {
  let createdOrderId;

  beforeEach(async () => {
    const menuItems = await MenuItem.find();
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Dave",
        address: "321 Pine Rd",
        phone: "4449876543",
        items: [{ menuItemId: menuItems[1]._id, quantity: 2 }],
      });
    createdOrderId = res.body.data.orderId;
  });

  it.each([
    ["PREPARING"],
    ["OUT_FOR_DELIVERY"],
    ["DELIVERED"],
    ["ORDER_RECEIVED"],
  ])("updates status to %s successfully", async (newStatus) => {
    const res = await request(app)
      .put(`/api/orders/${createdOrderId}/status`)
      .send({ status: newStatus });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(newStatus);
  });

  it("returns 400 for an invalid status value", async () => {
    const res = await request(app)
      .put(`/api/orders/${createdOrderId}/status`)
      .send({ status: "CANCELLED" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when status field is missing", async () => {
    const res = await request(app)
      .put(`/api/orders/${createdOrderId}/status`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain("status is required");
  });

  it("returns 404 for a non-existent order", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/orders/${fakeId}/status`)
      .send({ status: "PREPARING" });

    expect(res.status).toBe(404);
  });
});

// ─── 404 Route Tests ──────────────────────────────────────────────────────────
describe("Unknown routes", () => {
  it("returns 404 for undefined routes", async () => {
    const res = await request(app).get("/api/unknown-route");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
