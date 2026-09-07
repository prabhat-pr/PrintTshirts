import express from "express";
import sequelize from "./database.js";
import Product from "./models/Product.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("PrintTshirts backend is running!");
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Aiven MySQL connected successfully!");

    await sequelize.sync();
    console.log("Database tables synchronized!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error);
  }
}

startServer();
