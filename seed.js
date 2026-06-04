require("dotenv").config();
const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");

const menuItems = [
  {
    name: "Margherita Pizza",
    description: "Classic tomato sauce with fresh mozzarella and basil",
    price: 12.99,
    image: "/images/jpeg-optimizer_MargheritaPizza.webp",
    available: true,
  },
  {
    name: "Pepperoni Pizza",
    description: "Loaded with spicy pepperoni and melted cheese",
    price: 14.99,
    image: "/images/jpeg-optimizer_PepperoniPizza.webp",
    available: true,
  },
  {
    name: "Chicken Burger",
    description: "Crispy fried chicken fillet with lettuce and mayo",
    price: 8.49,
    image: "/images/ChickenBurger.webp",
    available: true,
  },
  {
    name: "Beef Burger",
    description: "Juicy beef patty with cheese, onion and pickles",
    price: 9.99,
    image: "/images/BeefBurger.webp",
    available: true,
  },
  {
    name: "Veg Biryani",
    description: "Fragrant basmati rice with mixed vegetables and spices",
    price: 10.49,
    image: "/images/jpeg-optimizer_VegBiryani.webp",
    available: true,
  },
  {
    name: "Chicken Biryani",
    description: "Slow cooked chicken with aromatic basmati rice",
    price: 13.49,
    image: "/images/ChickenBiryani.webp",
    available: true,
  },
  {
    name: "Pasta Arrabbiata",
    description: "Penne pasta in spicy tomato and garlic sauce",
    price: 9.49,
    image: "/images/jpeg-optimizer_PastaArrabbiata.webp",
    available: true,
  },
  {
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons and parmesan with caesar dressing",
    price: 7.99,
    image: "/images/CaesarSalad.webp",
    available: true,
  },
  {
    name: "Chocolate Brownie",
    description: "Warm fudgy brownie served with vanilla ice cream",
    price: 5.99,
    image: "/images/ChocolateBrownie.webp",
    available: true,
  },
  {
    name: "Mango Lassi",
    description: "Chilled yogurt based mango drink",
    price: 3.99,
    image: "/images/jpeg-optimizer_MangoLassi.webp",
    available: true,
  },
  {
    name: "Paneer Tikka Pizza",
    description: "Indian style pizza topped with paneer tikka and onions",
    price: 13.99,
    image: "/images/jpeg-optimizer_PaneerTikkaPizza.webp",
    available: true,
  },
  {
    name: "Veggie Supreme Pizza",
    description: "Loaded with fresh vegetables and mozzarella cheese",
    price: 12.49,
    image: "/images/jpeg-optimizer_VeggieSupremePizza.webp",
    available: true,
  },
  {
    name: "Double Cheese Burger",
    description: "Two juicy patties with double cheddar cheese",
    price: 11.99,
    image: "/images/jpeg-optimizer_DoubleCheeseBurger.webp",
    available: true,
  },
  {
    name: "French Fries",
    description: "Golden crispy fries served with ketchup",
    price: 4.99,
    image: "/images/jpeg-optimizer_FrenchFries.webp",
    available: true,
  },
  {
    name: "Chicken Wings",
    description: "Spicy crispy chicken wings with dip",
    price: 8.99,
    image: "/images/ChickenWings.webp",
    available: true,
  },
  {
    name: "Grilled Sandwich",
    description: "Loaded vegetable sandwich grilled to perfection",
    price: 6.49,
    image: "/images/jpeg-optimizer_GrilledSandwich.webp",
    available: true,
  },
  {
    name: "Club Sandwich",
    description: "Triple layered sandwich with chicken and veggies",
    price: 7.99,
    image: "/images/ClubSandwich.webp",
    available: true,
  },
  {
    name: "Masala Dosa",
    description: "South Indian dosa stuffed with potato masala",
    price: 6.99,
    image: "/images/jpeg-optimizer_MasalaDosa.webp",
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
