import { Op } from "sequelize";

import { User, Product, Order } from "../models/index.js";

export async function getDashboardStats() {
  const [productCount, customerCount, orderCount, pendingOrders, revenue] =
    await Promise.all([
      Product.count(),

      User.count({
        where: {
          role: "user",
        },
      }),

      Order.count(),

      Order.count({
        where: {
          status: {
            [Op.in]: ["pending", "confirmed", "processing"],
          },
        },
      }),

      Order.sum("totalAmount", {
        where: {
          paymentStatus: "paid",
        },
      }),
    ]);

  return {
    products: productCount,
    customers: customerCount,
    orders: orderCount,
    pendingOrders,
    revenue: Number(revenue || 0),
  };
}

export async function getCustomers() {
  return User.findAll({
    where: {
      role: "user",
    },

    attributes: ["id", "name", "email", "isActive", "createdAt"],

    order: [["createdAt", "DESC"]],
  });
}

export async function updateCustomerStatus(customer, isActive) {
  customer.isActive = isActive === true || isActive === "true";

  await customer.save();

  return {
    id: customer.id,
    isActive: customer.isActive,
  };
}
