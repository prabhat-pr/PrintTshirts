const express = require("express");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("PrintTshirts backend is running!");
});

app.get("/api/products", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Classic Black T-Shirt",
      price: 499,
    },
    {
      id: 2,
      name: "White Graphic T-Shirt",
      price: 599,
    },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
