// src/pages/Cart.jsx

import { Link } from "react-router-dom";
import { useCart } from "../context/useCart.js";

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart } = useCart();

  if (!items.length) {
    return (
      <main className="min-h-screen bg-white px-6 py-10 text-gray-900">
        <div className="mx-auto max-w-4xl">
          <div className="border-b border-gray-200 pb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              PrintT
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Cart</h1>
          </div>

          <div className="py-20 text-center">
            <p className="text-sm text-gray-500">Your cart is empty.</p>

            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            PrintT
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Cart</h1>

          <p className="mt-2 text-sm text-gray-500">
            Review your items before checkout.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Items */}
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold">
                    {item.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    ₹{Number(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300">
                    <button
                      type="button"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-9 w-9 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(
                          item.id,
                          Math.min(
                            Math.max(Number(event.target.value) || 1, 1),
                            item.stock,
                          ),
                        )
                      }
                      className="h-9 w-12 border-x border-gray-300 bg-white text-center text-sm outline-none"
                    />

                    <button
                      type="button"
                      disabled={item.quantity >= item.stock}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-9 w-9 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-500 transition hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Summary */}
          <aside className="h-fit border border-gray-200 p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              Summary
            </p>

            <div className="mt-5 flex items-center justify-between border-b border-gray-200 pb-5">
              <span className="text-sm text-gray-500">Total</span>

              <span className="text-lg font-semibold">
                ₹{Number(total).toFixed(2)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="mt-5 flex w-full items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Checkout
            </Link>

            <Link
              to="/shop"
              className="mt-3 flex w-full items-center justify-center rounded-md border border-gray-900 px-5 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
