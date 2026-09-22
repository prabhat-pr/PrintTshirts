import sequelize from "../database.js";

import { Order, OrderItem, Product, User } from "../models/index.js";

export async function createOrder(userId, data) {
  const transaction = await sequelize.transaction();

  try {
    const {
      items,
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPostalCode,
      paymentMethod,
    } = data;

    if (!Array.isArray(items) || items.length === 0) {
      const error = new Error("Order must contain at least one product");

      error.statusCode = 400;
      throw error;
    }

    if (
      !shippingName ||
      !shippingPhone ||
      !shippingAddress ||
      !shippingCity ||
      !shippingState ||
      !shippingPostalCode
    ) {
      const error = new Error("Complete shipping information is required");

      error.statusCode = 400;
      throw error;
    }

    const productIds = [
      ...new Set(items.map((item) => Number(item.productId))),
    ];

    const products = await Product.findAll({
      where: {
        id: productIds,
      },

      transaction,

      lock: transaction.LOCK.UPDATE,
    });

    if (products.length !== productIds.length) {
      const error = new Error("One or more products do not exist");

      error.statusCode = 400;
      throw error;
    }

    let totalAmount = 0;

    const orderItems = [];

    for (const item of items) {
      const product = products.find(
        (product) => product.id === Number(item.productId),
      );

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        const error = new Error("Invalid product quantity");

        error.statusCode = 400;
        throw error;
      }

      if (product.stock < quantity) {
        const error = new Error(`${product.name} does not have enough stock`);

        error.statusCode = 400;
        throw error;
      }

      const price = Number(product.price);
      const subtotal = price * quantity;

      totalAmount += subtotal;

      orderItems.push({
        product,
        quantity,
        price,
        subtotal,
      });
    }

    const order = await Order.create(
      {
        userId,

        totalAmount,

        paymentMethod: paymentMethod || "pending",

        shippingName: shippingName.trim(),

        shippingPhone: shippingPhone.trim(),

        shippingAddress: shippingAddress.trim(),

        shippingCity: shippingCity.trim(),

        shippingState: shippingState.trim(),

        shippingPostalCode: shippingPostalCode.trim(),
      },
      {
        transaction,
      },
    );

    for (const item of orderItems) {
      await OrderItem.create(
        {
          orderId: order.id,

          productId: item.product.id,

          productName: item.product.name,

          productImage: item.product.imageUrl,

          price: item.price,

          quantity: item.quantity,

          subtotal: item.subtotal,
        },
        {
          transaction,
        },
      );

      await item.product.decrement("stock", {
        by: item.quantity,
        transaction,
      });
    }

    await transaction.commit();

    return Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
        },
      ],
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    throw error;
  }
}

export async function getMyOrders(userId) {
  return Order.findAll({
    where: {
      userId,
    },

    include: [
      {
        model: OrderItem,
      },
    ],

    order: [["createdAt", "DESC"]],
  });
}

export async function getMyOrderById(userId, orderId) {
  return Order.findOne({
    where: {
      id: orderId,
      userId,
    },

    include: [
      {
        model: OrderItem,
      },
    ],
  });
}

export async function getAllOrders() {
  return Order.findAll({
    include: [
      {
        model: User,

        attributes: ["id", "name", "email"],
      },

      {
        model: OrderItem,
      },
    ],

    order: [["createdAt", "DESC"]],
  });
}

export async function updateOrderStatus(order, data) {
  const { status, paymentStatus } = data;

  if (status !== undefined) {
    order.status = status;
  }

  if (paymentStatus !== undefined) {
    order.paymentStatus = paymentStatus;
  }

  await order.save();

  return order;
}
