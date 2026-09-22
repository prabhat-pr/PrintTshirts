import sequelize from "../database.js";
import { Order, OrderItem, Product, User } from "../models/index.js";

export async function createOrder(req, res, next) {
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
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        error: "Order must contain at least one product",
      });
    }

    if (
      !shippingName ||
      !shippingPhone ||
      !shippingAddress ||
      !shippingCity ||
      !shippingState ||
      !shippingPostalCode
    ) {
      await transaction.rollback();

      return res.status(400).json({
        error: "Complete shipping information is required",
      });
    }

    const productIds = items.map((item) => item.productId);

    const products = await Product.findAll({
      where: {
        id: productIds,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (products.length !== productIds.length) {
      await transaction.rollback();

      return res.status(400).json({
        error: "One or more products do not exist",
      });
    }

    let totalAmount = 0;

    const orderItems = [];

    for (const item of items) {
      const product = products.find((p) => p.id === Number(item.productId));

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        await transaction.rollback();

        return res.status(400).json({
          error: "Invalid product quantity",
        });
      }

      if (product.stock < quantity) {
        await transaction.rollback();

        return res.status(400).json({
          error: `${product.name} does not have enough stock`,
        });
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
        userId: req.user.id,
        totalAmount,
        paymentMethod: paymentMethod || "pending",
        shippingName,
        shippingPhone,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingPostalCode,
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

    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
        },
      ],
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: OrderItem,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function getMyOrderById(req, res, next) {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: [
        {
          model: OrderItem,
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.findAll({
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

    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    if (status !== undefined) {
      order.status = status;
    }

    if (paymentStatus !== undefined) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
}
