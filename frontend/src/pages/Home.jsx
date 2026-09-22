import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/product.api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        const data = await getProducts({
          page: 1,
          limit: 20,
        });

        if (cancelled) return;

        setProducts(data?.products ?? []);
      } catch (err) {
        if (cancelled) return;

        setError(err?.message || "Unable to load products.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const featured = products.filter((product) => product.featured);

  const displayProducts = (featured.length ? featured : products).slice(0, 8);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center sm:py-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
            PrintT
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Wear Your Style.
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
            Quality printed T-shirts designed for everyday life.
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-2 py-2">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              Collection
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Featured Products
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-sm text-gray-500 transition hover:text-black"
          >
            View all →
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex h-40 animate-pulse overflow-hidden rounded-lg border border-gray-100"
              >
                <div className="w-32 shrink-0 bg-gray-100" />

                <div className="flex flex-1 flex-col justify-center gap-3 p-4">
                  <div className="h-2 w-16 rounded bg-gray-100" />
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-4 w-14 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        {!loading && !error && displayProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && displayProducts.length === 0 && (
          <p className="py-16 text-center text-sm text-gray-500">
            No products available.
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Simple. Comfortable. You.
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            Explore our complete collection of printed T-shirts.
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-md border border-gray-900 px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            Browse Collection
          </Link>
        </div>
      </section>
    </main>
  );
}
