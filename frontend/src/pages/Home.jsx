import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Heart,
  Mail,
  Menu,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  User,
  X,
} from "lucide-react";

const API_URL = "https://printtshirts-dmq3.onrender.com/api/products";

function formatPrice(price) {
  const value = Number(price);

  if (!Number.isFinite(value)) {
    return "₹—";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function ProductVisual({ product }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-zinc-100">
      <div className="absolute inset-0 bg-linear-to-br from-zinc-100 via-zinc-200 to-zinc-400" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-[70%] w-[62%] items-center justify-center rounded-[38%] bg-black shadow-2xl transition duration-500 group-hover:scale-105">
          <div className="px-4 text-center text-white">
            <p className="text-2xl font-black tracking-tight">PRINT</p>

            <div className="mx-auto mt-2 h-px w-10 bg-zinc-600" />

            <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.28em] text-zinc-400">
              TSHIRTS
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-5 max-w-3/4">
        <div className="rounded-xl bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400">
            Collection
          </p>

          <p className="mt-1 truncate text-xs font-bold text-zinc-900">
            {product.name || "Premium T-Shirt"}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10">
      <div className="relative aspect-4/5 overflow-hidden">
        <ProductVisual product={product} />

        <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-sm">
          New
        </div>

        <button
          type="button"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => setLiked((value) => !value)}
          className={`absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 ${
            liked ? "text-red-500" : "text-zinc-800"
          }`}
        >
          <Heart
            size={18}
            strokeWidth={1.8}
            fill={liked ? "currentColor" : "none"}
          />
        </button>

        <div className="absolute right-4 bottom-4 left-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-zinc-800"
          >
            Add to cart
            <ShoppingBag size={17} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-bold text-zinc-950">
              {product.name || "Premium T-Shirt"}
            </h3>

            <div className="mt-2 flex items-center gap-1">
              <div className="flex gap-0.5 text-zinc-900">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={12}
                    strokeWidth={1.8}
                    fill="currentColor"
                  />
                ))}
              </div>

              <span className="ml-1 text-xs text-zinc-400">4.9</span>
            </div>
          </div>

          <p className="shrink-0 font-black text-zinc-950">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </article>
  );
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
      <div className="aspect-4/5 animate-pulse bg-zinc-200" />

      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200" />
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-4 px-5 py-8 sm:px-8 lg:px-10">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-zinc-100">
        <Icon size={21} strokeWidth={1.7} />
      </div>

      <div>
        <h3 className="font-bold text-zinc-950">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        return response.json();
      })
      .then((data) => {
        if (!mounted) return;

        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((requestError) => {
        console.error("Product request failed:", requestError);

        if (!mounted) return;

        setError("We couldn't load the products.");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-zinc-950">
      {/* ANNOUNCEMENT */}

      <div className="bg-black px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white sm:text-[11px]">
        Free shipping on orders above ₹999
      </div>

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f6f2]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="text-xl font-black tracking-tight sm:text-2xl">
            Print
            <span className="text-zinc-400">Tshirts</span>
          </a>

          <nav className="hidden items-center gap-9 md:flex">
            <a
              href="#shop"
              className="text-sm font-semibold transition hover:text-zinc-500"
            >
              Shop
            </a>

            <a
              href="#why-us"
              className="text-sm font-semibold transition hover:text-zinc-500"
            >
              Why us
            </a>

            <a
              href="#about"
              className="text-sm font-semibold transition hover:text-zinc-500"
            >
              About
            </a>

            <a
              href="#contact"
              className="text-sm font-semibold transition hover:text-zinc-500"
            >
              Contact
            </a>
          </nav>

          <div className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              aria-label="Search"
              className="flex size-10 items-center justify-center rounded-full transition hover:bg-black/5"
            >
              <Search size={19} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              aria-label="Account"
              className="flex size-10 items-center justify-center rounded-full transition hover:bg-black/5"
            >
              <User size={19} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              aria-label="Shopping cart"
              className="ml-2 flex size-10 items-center justify-center rounded-full bg-black text-white transition hover:scale-105"
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
            </button>
          </div>

          <button
            type="button"
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu((value) => !value)}
            className="flex size-10 items-center justify-center rounded-full bg-black text-white md:hidden"
          >
            {mobileMenu ? (
              <X size={19} strokeWidth={1.8} />
            ) : (
              <Menu size={20} strokeWidth={1.8} />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}

        {mobileMenu && (
          <div className="border-t border-black/5 bg-[#f7f6f2] px-5 py-6 md:hidden">
            <nav className="flex flex-col gap-5">
              <a
                href="#shop"
                onClick={() => setMobileMenu(false)}
                className="text-lg font-semibold"
              >
                Shop
              </a>

              <a
                href="#why-us"
                onClick={() => setMobileMenu(false)}
                className="text-lg font-semibold"
              >
                Why us
              </a>

              <a
                href="#about"
                onClick={() => setMobileMenu(false)}
                className="text-lg font-semibold"
              >
                About
              </a>

              <a
                href="#contact"
                onClick={() => setMobileMenu(false)}
                className="text-lg font-semibold"
              >
                Contact
              </a>
            </nav>

            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-black/5 pt-5">
              <button
                type="button"
                className="flex h-11 items-center justify-center rounded-xl bg-white"
              >
                <Search size={17} />
              </button>

              <button
                type="button"
                className="flex h-11 items-center justify-center rounded-xl bg-white"
              >
                <User size={17} />
              </button>

              <button
                type="button"
                className="flex h-11 items-center justify-center rounded-xl bg-black text-white"
              >
                <ShoppingBag size={17} />
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* HERO */}

        <section className="overflow-hidden bg-[#e9e6df]">
          <div className="mx-auto grid min-h-170 max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-20">
            <div className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em]">
                <Sparkles size={14} strokeWidth={1.8} />
                Premium printed tees
              </div>

              <h1 className="max-w-3xl text-6xl font-black leading-[0.88] tracking-tight sm:text-7xl lg:text-8xl">
                Wear
                <br />
                your
                <br />
                <span className="italic text-zinc-500">personality.</span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">
                Comfortable, expressive t-shirts made for people who want their
                everyday style to stand out.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#shop"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-black px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800"
                >
                  Shop collection
                  <ArrowRight size={17} strokeWidth={1.8} />
                </a>

                <a
                  href="#about"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/50 px-7 py-4 text-sm font-bold transition hover:bg-white"
                >
                  Our story
                </a>
              </div>

              <div className="mt-12 flex gap-8 border-t border-black/10 pt-7 sm:gap-12">
                <div>
                  <p className="text-2xl font-black">4.9</p>

                  <div className="mt-1 flex gap-0.5">
                    {Array.from({
                      length: 5,
                    }).map((_, index) => (
                      <Star
                        key={index}
                        size={12}
                        strokeWidth={1.8}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-2xl font-black">₹399+</p>

                  <p className="mt-1 text-xs text-zinc-500">Starting price</p>
                </div>

                <div>
                  <p className="text-2xl font-black">100%</p>

                  <p className="mt-1 text-xs text-zinc-500">Style focused</p>
                </div>
              </div>
            </div>

            {/* HERO VISUAL */}

            <div className="relative mx-auto h-125 w-full max-w-125">
              <div className="absolute top-8 right-2 h-102.5 w-75 rotate-6 rounded-[3rem] bg-black sm:right-8 sm:w-87.5" />

              <div className="absolute top-0 left-2 flex h-102.5 w-75 -rotate-6 items-center justify-center overflow-hidden rounded-[3rem] bg-zinc-200 shadow-2xl sm:left-8 sm:w-87.5">
                <div className="absolute inset-0 bg-linear-to-br from-zinc-100 via-zinc-300 to-zinc-500" />

                <div className="relative flex h-[68%] w-[58%] items-center justify-center rounded-[35%] bg-black shadow-2xl">
                  <div className="text-center text-white">
                    <p className="text-3xl font-black tracking-tight">PRINT</p>

                    <div className="mx-auto mt-2 h-px w-12 bg-zinc-600" />

                    <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.35em] text-zinc-400">
                      Your style
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-5 left-0 rounded-2xl bg-white px-5 py-4 shadow-xl">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  Latest drop
                </p>

                <p className="mt-1 text-sm font-bold">New season essentials</p>
              </div>

              <div className="absolute top-16 right-0 flex size-16 items-center justify-center rounded-full bg-black text-white shadow-xl">
                <Sparkles size={24} strokeWidth={1.6} />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}

        <section id="why-us" className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-7xl divide-y divide-zinc-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <FeatureCard
              icon={ShieldCheck}
              title="Quality focused"
              description="Made with comfort and everyday wear in mind."
            />

            <FeatureCard
              icon={Truck}
              title="Fast delivery"
              description="Get your favourite designs delivered to your door."
            />

            <FeatureCard
              icon={RefreshCcw}
              title="Easy returns"
              description="Simple returns when something isn't right."
            />
          </div>
        </section>

        {/* SHOP */}

        <section id="shop" className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                  The collection
                </p>

                <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                  Freshly printed.
                </h2>
              </div>

              {!loading && !error && products.length > 0 && (
                <span className="text-sm text-zinc-500">
                  {products.length}{" "}
                  {products.length === 1 ? "product" : "products"}
                </span>
              )}
            </div>

            {/* LOADING */}

            {loading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({
                  length: 4,
                }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            )}

            {/* ERROR */}

            {!loading && error && (
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-zinc-100">
                  <RefreshCcw size={24} strokeWidth={1.7} />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Products couldn't be loaded
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  Please check your connection and try again.
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
                >
                  Try again
                  <RefreshCcw size={16} strokeWidth={1.8} />
                </button>
              </div>
            )}

            {/* EMPTY */}

            {!loading && !error && products.length === 0 && (
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-zinc-100">
                  <ShoppingBag size={25} strokeWidth={1.7} />
                </div>

                <h3 className="mt-5 text-xl font-bold">No products yet</h3>

                <p className="mt-2 text-sm text-zinc-500">
                  Our first collection will be available soon.
                </p>
              </div>
            )}

            {/* PRODUCTS */}

            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}

        <section className="bg-black px-5 py-28 text-white sm:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/10">
              <Sparkles size={21} strokeWidth={1.6} />
            </div>

            <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              More than a t-shirt
            </p>

            <h2 className="mt-6 text-5xl font-black leading-[0.92] tracking-tight sm:text-7xl">
              Your clothes should
              <br />
              <span className="text-zinc-600">say something.</span>
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              We believe the best everyday clothing is comfortable, expressive
              and unmistakably yours.
            </p>

            <a
              href="#shop"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold text-black transition hover:scale-105"
            >
              Find your next tee
              <ArrowRight size={17} strokeWidth={1.8} />
            </a>
          </div>
        </section>

        {/* ABOUT */}

        <section id="about" className="bg-[#f7f6f2] px-5 py-24 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                About PrintTshirts
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                Simple clothes.
                <br />
                Strong identity.
              </h2>
            </div>

            <div>
              <p className="text-base leading-8 text-zinc-600">
                PrintTshirts is built around one simple idea: everyday clothing
                should be comfortable, affordable and expressive.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Comfort-first designs",
                  "Expressive prints",
                  "Everyday pricing",
                  "Made for your style",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-white p-4"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-white">
                      <Check size={14} strokeWidth={2.5} />
                    </div>

                    <span className="text-sm font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}

        <section className="px-5 pb-24 sm:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-4xl bg-[#e4e1d9] px-6 py-16 text-center sm:px-12">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-black text-white">
              <Mail size={21} strokeWidth={1.6} />
            </div>

            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Be first to know.
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-zinc-500">
              Get notified about new designs, fresh drops and special offers.
            </p>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row"
            >
              <label htmlFor="email" className="sr-only">
                Email address
              </label>

              <input
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-5 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black"
              />

              <button
                type="submit"
                className="rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-800"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}

      <footer id="contact" className="bg-white px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-12 md:flex-row">
            <div className="max-w-sm">
              <a href="#" className="text-2xl font-black tracking-tight">
                Print
                <span className="text-zinc-400">Tshirts</span>
              </a>

              <p className="mt-4 text-sm leading-6 text-zinc-500">
                Premium printed t-shirts for people who wear their ideas.
              </p>

              <div className="mt-6">
                <a
                  href="#contact"
                  aria-label="Contact"
                  className="flex size-10 items-center justify-center rounded-full bg-zinc-100 transition hover:bg-black hover:text-white"
                >
                  <Mail size={17} strokeWidth={1.8} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-16 gap-y-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-bold">Shop</h3>

                <div className="mt-4 space-y-3 text-sm text-zinc-500">
                  <a href="#shop" className="block transition hover:text-black">
                    All products
                  </a>

                  <a href="#shop" className="block transition hover:text-black">
                    New arrivals
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold">Company</h3>

                <div className="mt-4 space-y-3 text-sm text-zinc-500">
                  <a
                    href="#about"
                    className="block transition hover:text-black"
                  >
                    About us
                  </a>

                  <a
                    href="#contact"
                    className="block transition hover:text-black"
                  >
                    Contact
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold">Help</h3>

                <div className="mt-4 space-y-3 text-sm text-zinc-500">
                  <a href="#" className="block transition hover:text-black">
                    Shipping
                  </a>

                  <a href="#" className="block transition hover:text-black">
                    Returns
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-400 sm:flex-row">
            <p>
              © {new Date().getFullYear()} PrintTshirts. All rights reserved.
            </p>

            <p>Built for everyday expression.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
