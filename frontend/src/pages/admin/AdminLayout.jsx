// src/pages/admin/AdminLayout.jsx

import { Link, NavLink, Outlet } from "react-router-dom";

import {
  Squares2X2Icon,
  CubeIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: Squares2X2Icon,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: CubeIcon,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingBagIcon,
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: UsersIcon,
  },
];

export default function AdminLayout() {
  return (
    <section className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto flex max-w-full flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 border-b border-gray-200 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
          <div className="px-5 py-6">
            {/* Brand */}
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center text-base font-bold tracking-tight text-gray-950"
            >
              PrintT
              <span className="ml-1 text-indigo-600">Admin</span>
            </Link>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Management
            </p>

            {/* Navigation */}
            <nav className="mt-8 flex gap-5 overflow-x-auto pb-1 md:flex-col md:gap-1 md:overflow-visible md:pb-0">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="group relative flex shrink-0 items-center gap-3 py-2.5 text-sm transition"
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active indicator */}
                        <span
                          className={`absolute -left-5 hidden h-6 w-0.5 rounded-full bg-indigo-600 md:block ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        />

                        {/* Icon */}
                        <Icon
                          className={`h-5 w-5 shrink-0 transition ${
                            isActive
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-gray-700"
                          }`}
                        />

                        {/* Label */}
                        <span
                          className={
                            isActive
                              ? "font-semibold text-indigo-600"
                              : "text-gray-500 group-hover:text-gray-900"
                          }
                        >
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </section>
  );
}
