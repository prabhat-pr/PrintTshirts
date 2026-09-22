// src/components/ProductCard.jsx

import { Link } from "react-router-dom";
import { toast } from "sonner";

import { useCart } from "../context/useCart.js";

export default function ProductCard({ product }) {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const isOutOfStock = !product.stock;

  const cartItem = items.find((item) => item.id === product.id);

  const isInCart = Boolean(cartItem);

  const handleAddToCart = () => {
    try {
      addToCart(product);

      if (!isInCart) {
        toast.success(`${product.name} added to cart`);
      }
    } catch (err) {
      toast.error(err?.message || "Unable to add product to cart.");
    }
  };

  const handleDecrease = () => {
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      removeFromCart(product.id);
      return;
    }

    updateQuantity(product.id, cartItem.quantity - 1);
  };

  const handleIncrease = () => {
    if (!cartItem) return;
    if (cartItem.quantity >= product.stock) return;

    addToCart(product);
  };

  return (
    <article className="flex h-55 overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Image */}
      <Link
        to={`/products/${product.id}`}
        className="h-full w-32 shrink-0 overflow-hidden bg-gray-50 sm:w-40"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
            {product.category || "T-Shirt"}
          </p>

          <h3 className="mt-1 truncate text-sm font-medium text-gray-900">
            <Link
              to={`/products/${product.id}`}
              className="transition hover:text-gray-600"
            >
              {product.name}
            </Link>
          </h3>

          <p className="mt-2 text-base font-semibold text-gray-900">
            ₹{Number(product.price).toFixed(2)}
          </p>

          <p
            className={`mt-1 text-xs ${
              isOutOfStock ? "text-red-500" : "text-gray-400"
            }`}
          >
            {isOutOfStock ? "Out of stock" : `${product.stock} available`}
          </p>
        </div>

        {/* Cart Actions */}
        {isOutOfStock ? (
          <span className="text-xs font-medium text-red-500">Out of Stock</span>
        ) : !isInCart ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className="h-10 w-full rounded-md bg-black px-3 text-xs font-medium text-white transition hover:bg-gray-800"
          >
            Add to Cart
          </button>
        ) : (
          <div className="space-y-2">
            {/* Quantity */}
            <div className="flex h-10 items-center justify-between rounded-md border border-gray-300">
              <button
                type="button"
                onClick={handleDecrease}
                aria-label={`Decrease ${product.name} quantity`}
                className="flex h-full w-12 items-center justify-center text-base text-gray-700 transition hover:bg-gray-50"
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
                className="flex h-full w-12 items-center justify-center text-base text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                +
              </button>
            </div>

            {/* Go to Cart */}
            <Link
              to="/cart"
              className="flex h-10 w-full items-center justify-center rounded-md bg-black text-xs font-medium text-white transition hover:bg-gray-800"
            >
              Go to Cart
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
