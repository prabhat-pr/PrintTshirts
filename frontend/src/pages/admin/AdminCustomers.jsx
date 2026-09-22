// src/pages/admin/AdminCustomers.jsx

import { useEffect, useState } from "react";
import { getCustomers, updateCustomerStatus } from "../../api/admin.api.js";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Used for refreshes after an update
  async function loadCustomers() {
    try {
      setError("");

      const data = await getCustomers();

      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Unable to load customers.");
    }
  }

  // Initial load
  useEffect(() => {
    let cancelled = false;

    async function fetchCustomers() {
      try {
        setLoading(true);
        setError("");

        const data = await getCustomers();

        if (!cancelled) {
          setCustomers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load customers.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCustomers();

    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle(customer) {
    try {
      setError("");
      setUpdatingId(customer.id);

      await updateCustomerStatus(customer.id, !customer.isActive);

      await loadCustomers();
    } catch (err) {
      setError(err?.message || "Unable to update customer.");
    } finally {
      setUpdatingId(null);
    }
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
                Customers
              </h1>

              {!loading && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                  {customers.length}
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Manage customer accounts and account status.
            </p>
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => loadCustomers()}
            disabled={loading}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
            Refresh
          </button>
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
                className="grid gap-4 border-b border-gray-100 px-5 py-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px_130px]"
              >
                <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
                <div className="h-9 w-24 animate-pulse rounded-md bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && customers.length === 0 && (
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
                  d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-sm font-semibold text-gray-900">
              No customers found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Customer accounts will appear here once users sign up.
            </p>
          </div>
        )}

        {/* Customers */}
        {!loading && customers.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
            {/* Table Header */}
            <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px_130px] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:grid">
              <span>Customer</span>
              <span>Email</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {customers.map((customer) => {
              const isUpdating = updatingId === customer.id;

              return (
                <article
                  key={customer.id}
                  className="grid gap-4 border-b border-gray-100 px-5 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px_130px] sm:items-center"
                >
                  {/* Customer */}
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium text-gray-900">
                      {customer.name || "Unknown"}
                    </h3>

                    <p className="mt-1 truncate text-xs text-gray-400 sm:hidden">
                      {customer.email || "Unknown"}
                    </p>
                  </div>

                  {/* Email */}
                  <p className="hidden truncate text-sm text-gray-500 sm:block">
                    {customer.email || "Unknown"}
                  </p>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        customer.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {customer.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Action */}
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => toggle(customer)}
                    className={`w-fit rounded-md px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      customer.isActive
                        ? "border border-gray-200 text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {isUpdating
                      ? "Updating..."
                      : customer.isActive
                        ? "Deactivate"
                        : "Activate"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
