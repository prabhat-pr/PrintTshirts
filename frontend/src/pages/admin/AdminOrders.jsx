// src/pages/admin/AdminOrders.jsx

import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../api/order.api.js";

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function loadOrders(showLoading = true) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const data = await getAllOrders();

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Unable to load orders.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const data = await getAllOrders();

        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load orders.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  async function changeStatus(id, status) {
    try {
      setError("");
      setUpdatingId(id);

      await updateOrderStatus(id, { status });

      await loadOrders(false);
    } catch (err) {
      setError(err?.message || "Unable to update order status.");
    } finally {
      setUpdatingId(null);
    }
  }

  function statusStyle(status) {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700";

      case "cancelled":
        return "bg-red-50 text-red-600";

      case "shipped":
        return "bg-blue-50 text-blue-700";

      case "processing":
        return "bg-amber-50 text-amber-700";

      case "confirmed":
        return "bg-indigo-50 text-indigo-700";

      case "pending":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  function formatStatus(status) {
    return status?.charAt(0).toUpperCase() + status?.slice(1);
  }

  return (
    <section className="min-h-screen bg-white px-4 py-2 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Page Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Admin
              </p>

              <span className="text-gray-300">/</span>

              <h1 className="text-xl font-semibold tracking-tight text-gray-950 sm:text-2xl">
                Orders
              </h1>

              {!loading && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                  {orders.length}
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              View and manage customer orders.
            </p>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => loadOrders()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h5M20 20v-5h-5M5.64 9A7 7 0 0118.36 6.64L20 9M18.36 15A7 7 0 015.64 17.36L4 15"
                />
              </svg>

              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 font-medium text-red-500 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="grid gap-4 border-b border-gray-100 px-5 py-5 last:border-b-0 lg:grid-cols-[90px_minmax(0,1fr)_minmax(0,1fr)_110px_140px_150px]"
              >
                <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-gray-100" />
                <div className="h-9 w-full animate-pulse rounded-md bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="mt-6 rounded-lg border border-gray-200 px-6 py-20 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-6 w-6 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7h18M5 7l1 13h12l1-13M9 7V5a3 3 0 016 0v2"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-sm font-semibold text-gray-900">
              No orders found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Customer orders will appear here once they are placed.
            </p>
          </div>
        )}

        {/* Orders */}
        {!loading && orders.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
            {/* Desktop Header */}
            <div className="hidden grid-cols-[90px_minmax(0,1fr)_minmax(0,1fr)_110px_140px_150px] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 lg:grid">
              <span>Order</span>
              <span>Customer</span>
              <span>Email</span>
              <span>Total</span>
              <span>Status</span>
              <span>Update</span>
            </div>

            {orders.map((order) => {
              const isUpdating = updatingId === order.id;

              return (
                <article
                  key={order.id}
                  className="grid gap-4 border-b border-gray-100 px-5 py-5 last:border-b-0 lg:grid-cols-[90px_minmax(0,1fr)_minmax(0,1fr)_110px_140px_150px] lg:items-center"
                >
                  {/* Order */}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      #{order.id}
                    </p>

                    <p className="mt-1 text-xs text-gray-400 lg:hidden">
                      Order
                    </p>
                  </div>

                  {/* Customer */}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {order.User?.name || "Unknown"}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500 lg:hidden">
                      {order.User?.email || "Unknown"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400 lg:hidden">
                      Customer
                    </p>
                  </div>

                  {/* Email */}
                  <p className="hidden truncate text-sm text-gray-500 lg:block">
                    {order.User?.email || "Unknown"}
                  </p>

                  {/* Total */}
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{Number(order.totalAmount || 0).toFixed(2)}
                  </p>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(
                        order.status,
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </div>

                  {/* Update */}
                  <div>
                    <select
                      value={order.status}
                      disabled={isUpdating}
                      onChange={(event) =>
                        changeStatus(order.id, event.target.value)
                      }
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium capitalize text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>

                    {isUpdating && (
                      <p className="mt-1.5 text-xs text-gray-400">
                        Updating...
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
