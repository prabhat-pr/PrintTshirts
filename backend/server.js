import "dotenv/config";

import app from "./app.js";
import sequelize from "./database.js";

// Import models and associations before sync.
import "./models/index.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Aiven MySQL connected successfully!");

    await sequelize.sync({
      alter: true,
    });

    console.log("Database tables synchronized!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error);

    process.exit(1);
  }
}

startServer();
