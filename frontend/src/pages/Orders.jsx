// src/pages/Orders.jsx

import { useEffect, useState } from "react";
import { getMyOrders } from "../api/order.api.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();

        if (cancelled) return;

        setOrders(data ?? []);
      } catch (err) {
        if (cancelled) return;

        setError(err?.message || "Unable to load your orders.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white px-6 py-2 text-gray-900">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            PrintT
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            My Orders
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View your order history and purchase details.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-lg border border-gray-200 p-6"
              >
                <div className="h-4 w-28 rounded bg-gray-100" />

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-4 w-24 rounded bg-gray-100" />
                </div>

                <div className="mt-6 h-16 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-gray-500">No orders found.</p>
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-lg border border-gray-200"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Order
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">#{order.id}</h2>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-gray-100 px-3 py-1 capitalize text-gray-700">
                      {order.status}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 capitalize text-gray-700">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="grid border-b border-gray-200 sm:grid-cols-3">
                  <div className="border-b border-gray-200 p-5 sm:border-b-0 sm:border-r">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize">
                      {order.status}
                    </p>
                  </div>

                  <div className="border-b border-gray-200 p-5 sm:border-b-0 sm:border-r">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Payment
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize">
                      {order.paymentStatus}
                    </p>
                  </div>

                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Total
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Items */}
                {order.OrderItems?.length > 0 && (
                  <div className="p-5">
                    <h3 className="text-sm font-semibold">Items</h3>

                    <div className="mt-4 divide-y divide-gray-100">
                      {order.OrderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {item.productName}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-sm text-gray-500">
                              ₹{Number(item.price).toFixed(2)} × {item.quantity}
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              ₹{Number(item.subtotal).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
