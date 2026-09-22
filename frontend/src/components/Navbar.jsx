import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "../context/useAuth.js";
import { useCart } from "../context/useCart.js";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    toast.success("Logged out successfully");
  };

  const closeMobile = () => setMobileOpen(false);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      {/* ================= Main Header ================= */}
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-2 sm:px-2 lg:px-2">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobile}
          className="shrink-0 text-[22px] font-extrabold tracking-tight text-gray-950"
        >
          Print<span className="text-indigo-600">T</span>
        </Link>

        {/* ================= Desktop Navigation ================= */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>

          {user && (
            <NavLink to="/orders" className={navLinkClass}>
              My Orders
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  isActive
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                }`
              }
            >
              Admin Panel
            </NavLink>
          )}
        </div>

        {/* ================= Right Side ================= */}
        <div className="flex items-center gap-1">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center rounded-xl p-2.5 text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
            aria-label={`Cart with ${itemCount} items`}
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 7h12l1 13H5L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>

            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                {itemCount}
              </span>
            )}

            <span className="ml-2 hidden text-sm font-semibold sm:inline">
              Cart
            </span>
          </Link>

          {/* Desktop Auth */}
          <div className="ml-2 hidden items-center gap-1 md:flex">
            {user ? (
              <>
                <Link
                  to="/account"
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-indigo-600"
                >
                  Account
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-indigo-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="ml-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* ================= Mobile Menu Button ================= */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ================= Mobile Menu ================= */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3">
            {/* Main Links */}
            <div className="space-y-1">
              <NavLink
                to="/"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/shop"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Shop
              </NavLink>

              {user && (
                <NavLink
                  to="/orders"
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl px-4 py-3 text-sm font-semibold ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  My Orders
                </NavLink>
              )}

              {user && (
                <NavLink
                  to="/account"
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl px-4 py-3 text-sm font-semibold ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  Account
                </NavLink>
              )}

              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl px-4 py-3 text-sm font-semibold ${
                      isActive
                        ? "bg-red-50 text-red-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  Admin Panel
                </NavLink>
              )}
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-gray-100" />

            {/* Mobile Auth */}
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
