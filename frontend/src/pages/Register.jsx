// src/pages/Register.jsx

import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/useAuth.js";

export default function Register() {
  const { register, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function change(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function submit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      await register({
        name,
        email,
        password: form.password,
      });
    } catch (err) {
      setError(
        err?.message || "Unable to create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-2 text-slate-900">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center">
        <section className="w-full">
          {/* Brand */}
          <div className="mb-4 text-center">
            <h1 className=" text-3xl font-bold tracking-tight text-slate-950">
              Create an account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Join PrintT and start shopping
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={submit}
            noValidate
            className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={change}
                autoComplete="name"
                required
                disabled={isSubmitting}
                className="
                  w-full rounded-xl border border-slate-200
                  bg-slate-50 px-4 py-3.5 text-sm
                  text-slate-900 outline-none transition
                  placeholder:text-slate-400
                  hover:border-slate-300
                  focus:border-indigo-500
                  focus:bg-white
                  focus:ring-4 focus:ring-indigo-500/10
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              />
            </div>

            {/* Email */}
            <div className="mt-6">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={change}
                autoComplete="email"
                inputMode="email"
                required
                disabled={isSubmitting}
                className="
                  w-full rounded-xl border border-slate-200
                  bg-slate-50 px-4 py-3.5 text-sm
                  text-slate-900 outline-none transition
                  placeholder:text-slate-400
                  hover:border-slate-300
                  focus:border-indigo-500
                  focus:bg-white
                  focus:ring-4 focus:ring-indigo-500/10
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              />
            </div>

            {/* Password */}
            <div className="mt-6">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={change}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={isSubmitting}
                  className="
                    w-full rounded-xl border border-slate-200
                    bg-slate-50 px-4 py-3.5 pr-16 text-sm
                    text-slate-900 outline-none transition
                    placeholder:text-slate-400
                    hover:border-slate-300
                    focus:border-indigo-500
                    focus:bg-white
                    focus:ring-4 focus:ring-indigo-500/10
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={isSubmitting}
                  className="
                    absolute right-3 top-1/2
                    -translate-y-1/2 rounded-lg
                    px-2 py-1 text-xs font-semibold
                    text-slate-400 transition
                    hover:bg-slate-100 hover:text-slate-700
                    disabled:opacity-50
                  "
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Minimum 6 characters
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                mt-7 flex w-full items-center justify-center gap-2
                rounded-xl bg-slate-950 px-4 py-3.5
                text-sm font-semibold text-white
                transition duration-200
                hover:bg-slate-800
                focus:outline-none focus:ring-4 focus:ring-slate-900/10
                disabled:cursor-not-allowed
                disabled:bg-slate-300
              "
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="
                  font-semibold text-slate-900
                  underline decoration-slate-300
                  underline-offset-4 transition
                  hover:text-indigo-600
                  hover:decoration-indigo-300
                "
              >
                Sign in
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
