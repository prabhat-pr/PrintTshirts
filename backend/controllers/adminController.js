import { Op } from "sequelize";
import { User, Product, Order } from "../models/index.js";

export async function getDashboardStats(req, res, next) {
  try {
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

    res.json({
      products: productCount,
      customers: customerCount,
      orders: orderCount,
      pendingOrders,
      revenue: Number(revenue || 0),
    });
  } catch (error) {
    next(error);
  }
}

export async function getCustomers(req, res, next) {
  try {
    const customers = await User.findAll({
      where: {
        role: "user",
      },
      attributes: ["id", "name", "email", "isActive", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    res.json(customers);
  } catch (error) {
    next(error);
  }
}

export async function updateCustomerStatus(req, res, next) {
  try {
    const customer = await User.findOne({
      where: {
        id: req.params.id,
        role: "user",
      },
    });

    if (!customer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    customer.isActive =
      req.body.isActive === true || req.body.isActive === "true";

    await customer.save();

    res.json({
      id: customer.id,
      isActive: customer.isActive,
    });
  } catch (error) {
    next(error);
  }
}
