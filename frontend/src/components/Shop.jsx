import { useEffect, useState } from "react";
import { getProducts } from "../api/product.api.js";
import ProductCard from "./ProductCard.jsx";

const PRODUCTS_PER_PAGE = 20;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const page = pagination?.page ?? 1;
  const totalProducts = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  const loadProducts = async (currentPage = 1, currentSearch = "") => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts({
        page: currentPage,
        limit: PRODUCTS_PER_PAGE,
        search: currentSearch,
      });

      setProducts(data?.products ?? []);
      setPagination(data?.pagination ?? null);
    } catch (err) {
      setProducts([]);
      setPagination(null);
      setError(err?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        const data = await getProducts({
          page: 1,
          limit: PRODUCTS_PER_PAGE,
          search: "",
        });

        if (cancelled) return;

        setProducts(data?.products ?? []);
        setPagination(data?.pagination ?? null);
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

  const handleSearch = (event) => {
    const value = event.target.value;

    setSearch(value);
    loadProducts(1, value);
  };

  const goToPage = (nextPage) => {
    if (loading) return;
    if (nextPage < 1 || nextPage > totalPages) return;

    loadProducts(nextPage, search);
  };

  const clearSearch = () => {
    setSearch("");
    loadProducts(1, "");
  };

  return (
    <main className="min-h-screen bg-white px-6 py-2 text-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-gray-200 pb-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              PrintT
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Shop</h1>

            <p className="mt-2 text-sm text-gray-500">
              Find your next favorite T-shirt.
            </p>
          </div>

          {/* Search */}
          <div className="w-full sm:w-64">
            <label htmlFor="search" className="sr-only">
              Search T-shirts
            </label>

            <input
              id="search"
              type="search"
              value={search}
              onChange={handleSearch}
              placeholder="Search T-shirts"
              className="w-full border-b border-gray-300 bg-transparent px-1 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:border-black"
            />
          </div>
        </div>

        {/* Error */}
        {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse overflow-hidden rounded-lg border border-gray-200"
              >
                <div className="h-40 w-32 shrink-0 bg-gray-100" />

                <div className="flex flex-1 flex-col justify-center gap-3 p-4">
                  <div className="h-2 w-16 rounded bg-gray-100" />
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-4 w-14 rounded bg-gray-100" />
                  <div className="h-8 w-full rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-2 flex flex-col gap-4 border-t border-gray-200 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * PRODUCTS_PER_PAGE + 1} –{" "}
                {Math.min(page * PRODUCTS_PER_PAGE, totalProducts)} of{" "}
                {totalProducts} products
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1 || loading}
                    className="border border-gray-200 px-3 py-2 text-sm transition hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ←
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter(
                      (pageNumber) =>
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        Math.abs(pageNumber - page) <= 1,
                    )
                    .map((pageNumber, index, visiblePages) => {
                      const previousPage = visiblePages[index - 1];

                      const showEllipsis =
                        previousPage && pageNumber - previousPage > 1;

                      return (
                        <span
                          key={pageNumber}
                          className="flex items-center gap-1"
                        >
                          {showEllipsis && (
                            <span className="px-2 text-gray-400">…</span>
                          )}

                          <button
                            type="button"
                            onClick={() => goToPage(pageNumber)}
                            disabled={loading}
                            className={`min-w-9 border px-3 py-2 text-sm transition ${
                              pageNumber === page
                                ? "border-black bg-black text-white"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        </span>
                      );
                    })}

                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages || loading}
                    className="border border-gray-200 px-3 py-2 text-sm transition hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-gray-500">
              {search
                ? `No T-shirts found for "${search}".`
                : "No products available."}
            </p>

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="mt-4 text-sm font-medium text-black underline underline-offset-4"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
