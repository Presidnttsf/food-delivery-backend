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
  {
  name: "Paneer Tikka Pizza",
  description: "Indian style pizza topped with paneer tikka and onions",
  price: 13.99,
  image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  available: true,
},
{
  name: "Veggie Supreme Pizza",
  description: "Loaded with fresh vegetables and mozzarella cheese",
  price: 12.49,
  image: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49",
  available: true,
},
{
  name: "Double Cheese Burger",
  description: "Two juicy patties with double cheddar cheese",
  price: 11.99,
  image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add",
  available: true,
},
{
  name: "French Fries",
  description: "Golden crispy fries served with ketchup",
  price: 4.99,
  image: "https://images.unsplash.com/photo-1576107232684-1279f390859f",
  available: true,
},
{
  name: "Chicken Wings",
  description: "Spicy crispy chicken wings with dip",
  price: 8.99,
  image: "https://images.unsplash.com/photo-1562967916-eb82221dfb92",
  available: true,
},
{
  name: "Grilled Sandwich",
  description: "Loaded vegetable sandwich grilled to perfection",
  price: 6.49,
  image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af",
  available: true,
},
{
  name: "Club Sandwich",
  description: "Triple layered sandwich with chicken and veggies",
  price: 7.99,
  image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586",
  available: true,
},
{
  name: "Masala Dosa",
  description: "South Indian dosa stuffed with potato masala",
  price: 6.99,
  image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976",
  available: true,
},
{
  name: "Idli Sambar",
  description: "Soft idlis served with sambar and chutney",
  price: 5.49,
  image: "https://images.unsplash.com/photo-1630383249896-424e482df921",
  available: true,
},
{
  name: "Chole Bhature",
  description: "North Indian chickpea curry with fried bread",
  price: 8.49,
  image: "https://images.unsplash.com/photo-1626132647523-66f4c5a1fd95",
  available: true,
},
{
  name: "Butter Chicken",
  description: "Creamy tomato gravy with tender chicken pieces",
  price: 14.99,
  image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
  available: true,
},
{
  name: "Paneer Butter Masala",
  description: "Paneer cubes cooked in rich buttery gravy",
  price: 12.99,
  image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
  available: true,
},
{
  name: "Garlic Naan",
  description: "Soft naan bread topped with garlic and butter",
  price: 2.99,
  image: "https://images.unsplash.com/photo-1617692855027-33b14f061079",
  available: true,
},
{
  name: "Hakka Noodles",
  description: "Stir-fried noodles with vegetables and sauces",
  price: 9.49,
  image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841",
  available: true,
},
{
  name: "Veg Fried Rice",
  description: "Flavorful rice tossed with vegetables and spices",
  price: 8.99,
  image: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
  available: true,
},
{
  name: "Chocolate Shake",
  description: "Rich and creamy chocolate milkshake",
  price: 4.99,
  image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
  available: true,
},
{
  name: "Strawberry Shake",
  description: "Refreshing strawberry flavored milkshake",
  price: 4.99,
  image: "https://images.unsplash.com/photo-1553787499-6f913324e8b6",
  available: true,
},
{
  name: "Ice Cream Sundae",
  description: "Vanilla ice cream topped with chocolate syrup",
  price: 5.99,
  image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
  available: true,
},
{
  name: "Red Velvet Cake",
  description: "Moist red velvet cake with cream cheese frosting",
  price: 6.49,
  image: "https://images.unsplash.com/photo-1586788680434-30f57f0c6f1c",
  available: true,
},
{
  name: "Tiramisu",
  description: "Classic Italian dessert with coffee flavor",
  price: 7.49,
  image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
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
