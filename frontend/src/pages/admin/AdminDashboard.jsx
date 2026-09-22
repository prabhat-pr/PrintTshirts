// src/pages/admin/AdminDashboard.jsx

import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/admin.api.js";
import { useAuth } from "../../context/useAuth.js";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initial dashboard fetch
  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardStats();

        if (!cancelled) {
          setStats(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load dashboard.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = stats
    ? [
        {
          label: "Products",
          value: stats.products,
        },
        {
          label: "Customers",
          value: stats.customers,
        },
        {
          label: "Orders",
          value: stats.orders,
        },
        {
          label: "Pending Orders",
          value: stats.pendingOrders,
        },
        {
          label: "Revenue",
          value: `₹${Number(stats.revenue || 0).toFixed(2)}`,
        },
      ]
    : [];

  return (
    <section className="min-h-screen bg-white px-4 py-2 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Admin
              </p>

              <span className="text-gray-300">/</span>

              <h1 className="text-xl font-semibold tracking-tight text-gray-950 sm:text-2xl">
                Dashboard
              </h1>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Overview of your PrintT store.
            </p>
          </div>

          {/* Admin Info + Clock */}
          <div className="shrink-0 text-left lg:text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.name
                ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                : "Admin"}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {user?.email || "Admin account"}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {currentTime.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              ·{" "}
              {currentTime.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="shrink-0 font-medium text-red-600 hover:text-red-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-lg border border-gray-200 bg-gray-50"
              />
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && stats && (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-lg border border-gray-200 bg-white p-5 transition hover:border-gray-300"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {card.label}
                  </p>

                  <p className="mt-3 truncate text-2xl font-semibold tracking-tight text-gray-950">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Summary */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Store Overview
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Monitor products, customers, orders, and revenue from your
                    administration panel.
                  </p>
                </div>

                <span className="mt-2 text-xs font-medium text-indigo-600 sm:mt-0">
                  Live dashboard
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
