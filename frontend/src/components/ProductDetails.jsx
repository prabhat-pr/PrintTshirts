// frontend/src/components/ProductDetails.jsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { getProduct } from "../api/product.api.js";
import { useCart } from "../context/useCart.js";

export default function ProductDetails() {
  const { id } = useParams();

  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        const loadedProduct = await getProduct(id);

        if (cancelled) return;

        setError("");
        setProduct(loadedProduct);
        setQuantity(1);
      } catch (err) {
        if (cancelled) return;

        setError(err?.message || "Unable to load product.");
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const cartItem = items.find((item) => item.id === product?.id);

  const isInCart = Boolean(cartItem);
  const isOutOfStock = !product?.stock;

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);

    if (!Number.isFinite(value)) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.min(Math.max(1, value), product.stock));
  };

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;

    try {
      addToCart(product, quantity);

      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err?.message || "Unable to add product to cart.");
    }
  };

  const handleDecrease = () => {
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      removeFromCart(product.id);

      toast.success(`${product.name} removed from cart`);

      return;
    }

    updateQuantity(product.id, cartItem.quantity - 1);
  };

  const handleIncrease = () => {
    if (!cartItem) return;

    if (cartItem.quantity >= product.stock) {
      toast.error("Maximum available quantity reached.");
      return;
    }

    try {
      addToCart(product);
    } catch (err) {
      toast.error(err?.message || "Unable to update quantity.");
    }
  };

  if (error) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-red-500">{error}</p>

          <Link
            to="/shop"
            className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse">
            <div className="h-8 w-24 rounded bg-gray-100" />

            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div className="aspect-square rounded-xl bg-gray-100" />

              <div className="space-y-5">
                <div className="h-8 w-3/4 rounded bg-gray-100" />
                <div className="h-6 w-1/4 rounded bg-gray-100" />
                <div className="h-20 rounded bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-5xl">
        {/* Back Link */}
        <Link
          to="/shop"
          className="text-sm text-gray-500 transition hover:text-black"
        >
          ← Back to Shop
        </Link>

        {/* Product */}
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start">
          {/* Image */}
          <div className="overflow-hidden rounded-xl bg-gray-50">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center text-sm text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Details */}
          <div className="py-2">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              {product.category || "T-Shirt"}
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl font-semibold text-gray-900">
              ₹{Number(product.price).toFixed(2)}
            </p>

            {product.rating != null && (
              <p className="mt-3 text-sm text-gray-500">
                ★ {Number(product.rating).toFixed(1)}
              </p>
            )}

            <div className="my-8 border-t border-gray-200" />

            {product.description && (
              <div>
                <h2 className="text-sm font-medium text-gray-900">
                  Description
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock */}
            <p
              className={`mt-6 text-sm ${
                isOutOfStock ? "text-red-500" : "text-gray-500"
              }`}
            >
              {isOutOfStock
                ? "Out of stock"
                : `${product.stock} items available`}
            </p>

            {/* Cart */}
            {!isOutOfStock && !isInCart && (
              <div className="mt-6">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-900"
                >
                  Quantity
                </label>

                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="mt-2 w-24 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm outline-none transition focus:border-black"
                />

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-black px-6 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Add to Cart
                </button>
              </div>
            )}

            {/* Already in Cart */}
            {!isOutOfStock && isInCart && (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-medium text-gray-900">Quantity</p>

                {/* Quantity Control */}
                <div className="flex h-12 items-center justify-between rounded-lg border border-gray-300">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    aria-label={`Decrease ${product.name} quantity`}
                    className="flex h-full w-16 items-center justify-center text-lg text-gray-700 transition hover:bg-gray-50"
                  >
                    −
                  </button>

                  <span className="text-sm font-medium text-gray-900">
                    {cartItem.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={cartItem.quantity >= product.stock}
                    aria-label={`Increase ${product.name} quantity`}
                    className="flex h-full w-16 items-center justify-center text-lg text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Go to Cart */}
                <Link
                  to="/cart"
                  className="flex h-12 w-full items-center justify-center rounded-lg bg-black text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Go to Cart
                </Link>
              </div>
            )}

            {/* Out of Stock */}
            {isOutOfStock && (
              <button
                type="button"
                disabled
                className="mt-6 h-12 w-full rounded-lg bg-gray-100 text-sm font-medium text-gray-500"
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
