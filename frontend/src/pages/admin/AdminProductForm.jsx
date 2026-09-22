// src/pages/admin/AdminProductForm.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createProduct,
  getProduct,
  updateProduct,
  uploadProductImage,
} from "../../api/product.api.js";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    rating: "4.9",
    stock: "0",
    featured: false,
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    getProduct(id)
      .then((product) => {
        setForm({
          name: product.name || "",
          price: product.price ?? "",
          category: product.category || "",
          description: product.description || "",
          rating: product.rating ?? "4.9",
          stock: product.stock ?? "0",
          featured: Boolean(product.featured),
        });
      })
      .catch((err) => {
        setError(err?.message || "Unable to load product.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      setError("");
    }
  }

  function handleImageChange(event) {
    setImage(event.target.files?.[0] || null);
  }

  async function submit(event) {
    event.preventDefault();

    if (saving) return;

    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (Number(form.price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (Number(form.stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      if (id) {
        await updateProduct(id, {
          ...form,
          name: form.name.trim(),
          price: Number(form.price),
          rating: Number(form.rating),
          stock: Number(form.stock),
        });

        if (image) {
          await uploadProductImage(id, image);
        }
      } else {
        const data = new FormData();

        data.append("name", form.name.trim());
        data.append("price", Number(form.price));
        data.append("category", form.category);
        data.append("description", form.description);
        data.append("rating", Number(form.rating));
        data.append("stock", Number(form.stock));
        data.append("featured", form.featured);

        if (image) {
          data.append("image", image);
        }

        await createProduct(data);
      }

      navigate("/admin/products");
    } catch (err) {
      setError(err?.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-white px-6 py-10">
        <div className="mx-auto max-w-2xl animate-pulse">
          <div className="h-8 w-40 rounded bg-gray-100" />

          <div className="mt-8 space-y-5">
            <div className="h-11 rounded bg-gray-100" />
            <div className="h-11 rounded bg-gray-100" />
            <div className="h-11 rounded bg-gray-100" />
            <div className="h-32 rounded bg-gray-100" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            Products
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {id ? "Edit Product" : "New Product"}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {id
              ? "Update the product information below."
              : "Add a new product to your store."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="mt-8 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Product Name
            </label>

            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Classic Black T-Shirt"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          {/* Price + Stock */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium">
                Price
              </label>

              <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-black">
                <span className="flex items-center border-r border-gray-200 px-3 text-sm text-gray-500">
                  ₹
                </span>

                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="499"
                  required
                  className="w-full px-3 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="stock" className="mb-2 block text-sm font-medium">
                Stock
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>
          </div>

          {/* Category + Rating */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Graphic T-Shirt"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="rating"
                className="mb-2 block text-sm font-medium"
              >
                Rating
              </label>

              <input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the T-shirt..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          {/* Featured */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />

            <span className="text-sm">Show this product as featured</span>
          </label>

          {/* Image */}
          <div>
            <label htmlFor="image" className="mb-2 block text-sm font-medium">
              Product Image
            </label>

            <input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="block w-full rounded-lg border border-gray-300 px-3 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium"
            />

            {image && (
              <p className="mt-2 text-xs text-gray-500">
                Selected: {image.name}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {saving ? "Saving..." : id ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
