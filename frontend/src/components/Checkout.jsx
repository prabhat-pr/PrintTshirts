// src/pages/Checkout.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createOrder } from "../api/order.api.js";
import { useCart } from "../context/useCart.js";

export default function Checkout() {
  const { items, total, clearCart } = useCart();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
    paymentMethod: "cod",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createOrder({
        ...form,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      clearCart();

      navigate("/orders");
    } catch (err) {
      setError(err?.message || "Unable to place your order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <main className="min-h-screen bg-white px-6 py-10 text-gray-900">
        <div className="mx-auto max-w-4xl">
          <div className="border-b border-gray-200 pb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              PrintT
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Checkout
            </h1>
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

  const inputClass =
    "w-full border-b border-gray-300 bg-transparent px-1 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black";

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            PrintT
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your delivery details to place your order.
          </p>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <form onSubmit={submit}>
            <div className="space-y-8">
              {/* Shipping */}
              <section>
                <div className="mb-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                    Delivery
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Shipping Information
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <input
                    name="shippingName"
                    type="text"
                    placeholder="Full name"
                    value={form.shippingName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />

                  <input
                    name="shippingPhone"
                    type="tel"
                    placeholder="Phone number"
                    value={form.shippingPhone}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />

                  <textarea
                    name="shippingAddress"
                    placeholder="Shipping address"
                    value={form.shippingAddress}
                    onChange={handleChange}
                    required
                    rows={3}
                    className={`${inputClass} resize-none sm:col-span-2`}
                  />

                  <input
                    name="shippingCity"
                    type="text"
                    placeholder="City"
                    value={form.shippingCity}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />

                  <input
                    name="shippingState"
                    type="text"
                    placeholder="State"
                    value={form.shippingState}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />

                  <input
                    name="shippingPostalCode"
                    type="text"
                    inputMode="numeric"
                    placeholder="Postal code"
                    value={form.shippingPostalCode}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </section>

              {/* Payment */}
              <section className="border-t border-gray-200 pt-8">
                <div className="mb-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                    Payment
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">Payment Method</h2>
                </div>

                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 bg-white px-1 py-3 text-sm outline-none transition focus:border-black"
                >
                  <option value="cod">Cash on Delivery</option>

                  <option value="online">Online</option>
                </select>
              </section>

              {/* Error */}
              {error && (
                <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </form>

          {/* Order Summary */}
          <aside className="h-fit border border-gray-200 p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              Summary
            </p>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.name}</p>

                    <p className="mt-1 text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm">
                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-5">
              <span className="text-sm text-gray-500">Total</span>

              <span className="text-lg font-semibold">
                ₹{Number(total).toFixed(2)}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
