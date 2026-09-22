import { Sequelize } from "sequelize";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const caPath = path.join(__dirname, "certs", "ca.pem");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",

    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true,
      },
    },

    logging: false,
  },
);

export default sequelize;
