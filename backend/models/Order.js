import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ),
      allowNull: false,
      defaultValue: "pending",
    },

    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      allowNull: false,
      defaultValue: "pending",
    },

    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    shippingName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    shippingPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    shippingCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    shippingState: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    shippingPostalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Orders",
    timestamps: true,
  },
);

export default Order;
