import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/useAuth.js";
import { ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      const message = "Please enter your email and password.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      const result = await login({
        email: cleanEmail,
        password,
      });

      toast.success(`Welcome back, ${result.user?.name || "there"}!`);
    } catch (err) {
      const message =
        err?.message || "Unable to log in. Please check your credentials.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);

    if (error) {
      setError("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-2 text-slate-900">
      <div className="mx-auto flex min-h-0 max-w-md items-center">
        <section className="w-full">
          {/* Brand */}
          <div className="mb-6 text-center">
            <h1 className="mt-10 text-3xl font-bold tracking-tight text-slate-950">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={submit}
            noValidate
            className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8"
          >
            {/* Email */}
            <div>
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
                value={email}
                onChange={handleChange(setEmail)}
                autoComplete="email"
                inputMode="email"
                required
                disabled={loading}
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
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleChange(setPassword)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
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
                  disabled={loading}
                  className="
                    absolute right-3 top-1/2
                    -translate-y-1/2 rounded-lg
                    px-2 py-1 text-xs font-semibold
                    text-slate-400 transition
                    hover:bg-slate-100 hover:text-slate-700
                  "
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
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
              disabled={loading}
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
              {loading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Register */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-slate-900 underline underline-offset-4 transition hover:text-indigo-600"
              >
                Create an account
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
