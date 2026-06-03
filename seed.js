require("dotenv").config();
const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");

const menuItems = [
  {
    name: "Margherita Pizza",
    description: "Classic tomato sauce with fresh mozzarella and basil",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
    available: true,
  },
  {
    name: "Pepperoni Pizza",
    description: "Loaded with spicy pepperoni and melted cheese",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    available: true,
  },
  {
    name: "Chicken Burger",
    description: "Crispy fried chicken fillet with lettuce and mayo",
    price: 8.49,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    available: true,
  },
  {
    name: "Beef Burger",
    description: "Juicy beef patty with cheese, onion and pickles",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    available: true,
  },
  {
    name: "Veg Biryani",
    description: "Fragrant basmati rice with mixed vegetables and spices",
    price: 10.49,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0",
    available: true,
  },
  {
    name: "Chicken Biryani",
    description: "Slow cooked chicken with aromatic basmati rice",
    price: 13.49,
    image: "https://images.unsplash.com/photo-1701579231349-d7459c40919d",
    available: true,
  },
  {
    name: "Pasta Arrabbiata",
    description: "Penne pasta in spicy tomato and garlic sauce",
    price: 9.49,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    available: true,
  },
  {
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons and parmesan with caesar dressing",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1",
    available: true,
  },
  {
    name: "Chocolate Brownie",
    description: "Warm fudgy brownie served with vanilla ice cream",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
    available: true,
  },
  {
    name: "Mango Lassi",
    description: "Chilled yogurt based mango drink",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4",
    available: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log("🗑️  Cleared existing menu items");

    // Insert fresh seed data
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`🌱 Seeded ${inserted.length} menu items successfully`);

    // Display inserted items
    inserted.forEach((item) => {
      console.log(`   → [${item._id}] ${item.name} - $${item.price}`);
    });

    console.log("\n✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedDB();
