// src/pages/admin/AdminProducts.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts, deleteProduct } from "../../api/product.api.js";

const PRODUCTS_PER_PAGE = 20;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const page = pagination?.page ?? 1;
  const totalProducts = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  const firstProduct =
    totalProducts === 0 ? 0 : (page - 1) * PRODUCTS_PER_PAGE + 1;

  const lastProduct = Math.min(page * PRODUCTS_PER_PAGE, totalProducts);

  // Initial products request
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

  const loadProducts = async (currentPage, currentSearch) => {
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

      setError(err?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const value = searchInput.trim();

    setSearch(value);

    loadProducts(1, value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");

    loadProducts(1, "");
  };

  const goToPage = (nextPage) => {
    if (loading) return;
    if (nextPage < 1) return;
    if (nextPage > totalPages) return;

    loadProducts(nextPage, search);
  };

  const remove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setDeletingId(id);

      await deleteProduct(id);

      const newTotal = Math.max(totalProducts - 1, 0);

      const newTotalPages = Math.max(
        Math.ceil(newTotal / PRODUCTS_PER_PAGE),
        1,
      );

      const nextPage = Math.min(page, newTotalPages);

      await loadProducts(nextPage, search);
    } catch (err) {
      setError(err?.message || "Unable to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 1) {
      return [1];
    }

    const pages = new Set([1, totalPages, page - 1, page, page + 1]);

    return [...pages]
      .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
      .sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  return (
    <main className="min-h-screen bg-white px-4 py-2 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header + Search Toolbar */}
        <div className="flex items-center justify-between gap-6 border-b border-gray-200 pb-5">
          {/* Left: Page Info */}
          <div className="min-w-0 shrink-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Admin
              </p>

              <span className="text-gray-300">/</span>

              <h1 className="text-xl font-semibold tracking-tight text-gray-950 sm:text-2xl">
                Products
              </h1>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Manage your store products.
            </p>
          </div>

          {/* Right: Search + Actions */}
          <div className="flex min-w-0 items-center gap-2">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative w-64 lg:w-80">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="shrink-0 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Search
              </button>

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="shrink-0 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  Clear
                </button>
              )}
            </form>

            <Link
              to="/admin/products/new"
              className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* Search Result Info */}
        {search && !loading && (
          <p className="mt-3 text-sm text-gray-500">
            Search results for{" "}
            <span className="font-medium text-gray-900">"{search}"</span>
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 overflow-hidden rounded-lg border border-gray-200">
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-4 px-4 py-4"
                >
                  <div className="h-12 w-12 shrink-0 rounded-md bg-gray-100" />

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 rounded bg-gray-100" />
                    <div className="h-2 w-24 rounded bg-gray-100" />
                  </div>

                  <div className="hidden h-3 w-20 rounded bg-gray-100 sm:block" />

                  <div className="h-3 w-16 rounded bg-gray-100" />

                  <div className="hidden h-3 w-20 rounded bg-gray-100 sm:block" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <>
            <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-190 text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                      Product
                    </th>

                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                      Price
                    </th>

                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                      Stock
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              loading="lazy"
                              className="h-12 w-12 shrink-0 rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gray-100 text-[10px] text-gray-400">
                              No image
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              ID #{product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-medium text-gray-900">
                        ₹{Number(product.price).toFixed(2)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={
                            product.stock > 0
                              ? "text-gray-700"
                              : "font-medium text-red-500"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-4">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="text-sm font-medium text-gray-600 hover:text-black"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => remove(product.id)}
                            disabled={deletingId === product.id}
                            className="text-sm font-medium text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === product.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-5 flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {firstProduct}
                </span>{" "}
                –{" "}
                <span className="font-medium text-gray-900">{lastProduct}</span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {totalProducts}
                </span>{" "}
                products
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1 || loading}
                    className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {pageNumbers.map((pageNumber, index) => {
                    const previousPage = pageNumbers[index - 1];

                    const showDots =
                      previousPage && pageNumber - previousPage > 1;

                    return (
                      <span key={pageNumber} className="flex items-center">
                        {showDots && (
                          <span className="px-2 text-gray-400">...</span>
                        )}

                        <button
                          type="button"
                          onClick={() => goToPage(pageNumber)}
                          disabled={loading}
                          className={`min-w-9 rounded-md px-3 py-2 text-sm ${
                            pageNumber === page
                              ? "bg-black text-white"
                              : "border border-gray-200 hover:bg-gray-50"
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
                    className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && !error && (
          <div className="py-20 text-center">
            <p className="text-sm text-gray-500">
              {search
                ? `No products found for "${search}".`
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
