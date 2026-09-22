// src/pages/Account.jsx

import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function Account() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
        <div className="mx-auto max-w-3xl">
          <div className="border-b border-gray-200 pb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              PrintT
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              My Account
            </h1>
          </div>

          <div className="py-16 text-center">
            <p className="text-sm text-gray-500">
              Please log in to view your account.
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Log In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            PrintT
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            My Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your account information.
          </p>
        </div>

        {/* Account Details */}
        <div className="divide-y divide-gray-200">
          <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500">Name</span>

            <span className="text-sm font-medium">{user.name}</span>
          </div>

          <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500">Email</span>

            <span className="text-sm font-medium">{user.email}</span>
          </div>

          <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500">Role</span>

            <span className="text-sm font-medium capitalize">{user.role}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/orders"
            className="rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            My Orders
          </Link>

          <Link
            to="/shop"
            className="rounded-md border border-gray-900 px-5 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
