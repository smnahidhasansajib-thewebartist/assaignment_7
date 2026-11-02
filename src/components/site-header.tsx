"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import type { Category, Product } from "@/lib/products";
import { formatBengaliNumber } from "@/lib/products";

export function SiteHeader({ today }: { today: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();
  useEffect(() => {
    fetch("/api/categories")
      .then(async (response) => {
        if (!response.ok) throw new Error("ক্যাটাগরি লোড করা যায়নি");
        setCategories((await response.json()) as Category[]);
      })
      .catch((error: unknown) => console.error("Category navigation failed:", error));
    fetch("/api/products")
      .then(async (response) => {
        if (!response.ok) throw new Error("পণ্যের দাম লোড করা যায়নি");
        setProducts((await response.json()) as Product[]);
      })
      .catch((error: unknown) => console.error("Price ticker failed:", error));
  }, []);

  async function handleSignOut() {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error(result.error.message ?? "সাইন আউট করা যায়নি");
        return;
      }
      toast.success("আপনি সাইন আউট করেছেন");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign-out failed:", error);
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  const tickerProducts = products.slice(0, 12);

  return (
    <header className="site-header">
      <div className="header-main container">
        <Link className="brand" href="/" aria-label="বাজার দর হোম">
          <span className="brand__mark" aria-hidden="true">🛒</span>
          <span className="brand__text">
            <strong>বাজার দর</strong>
            <small suppressHydrationWarning>{today}</small>
          </span>
        </Link>
        <div className="header-actions">
          {session?.user ? (
            <>
              <Link className="button button--quiet header-profile" href="/profile">
                {session.user.name || "আমার প্রোফাইল"}
              </Link>
              <button className="button button--outline" onClick={handleSignOut} type="button">
                সাইন আউট
              </button>
            </>
          ) : (
            <>
              <Link className="button button--quiet" href="/signin">সাইন ইন</Link>
              <Link className="button button--primary header-signup" href="/signup">সাইন আপ</Link>
            </>
          )}
        </div>
        <button
          aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          aria-expanded={menuOpen}
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      <div className="nav-row">
        <nav className={`main-nav container ${menuOpen ? "main-nav--open" : ""}`} aria-label="প্রধান নেভিগেশন">
          <Link className={pathname === "/" ? "nav-link nav-link--active" : "nav-link"} href="/" onClick={() => setMenuOpen(false)}>
            সব পণ্য
          </Link>
          {categories.map((category) => (
            <Link
              className={
                pathname === `/category/${category.slug}`
                  ? "nav-link nav-link--active"
                  : "nav-link"
              }
              href={`/category/${category.slug}`}
              key={category.id}
              onClick={() => setMenuOpen(false)}
            >
              <span aria-hidden="true">{category.icon}</span> {category.nameBn}
            </Link>
          ))}
        </nav>
      </div>
      <div className="ticker" aria-label="আজকের পণ্যের দাম">
        <div className="ticker__track">
          {[...tickerProducts, ...tickerProducts].map((product, index) => (
            <span className="ticker__item" key={`${product.id}-${index}`}>
              <span aria-hidden="true">{product.image}</span>
              <strong>{product.nameBn}</strong>
              <span>{formatBengaliNumber(product.today)} টাকা</span>
              <span className={`ticker__change ticker__change--${product.change.dir}`}>
                {product.change.dir === "up" ? "▲" : product.change.dir === "down" ? "▼" : "—"}
                {formatBengaliNumber(Math.abs(product.change.pct), 1)}%
              </span>
            </span>
          ))}
          {tickerProducts.length === 0 && (
            <span className="ticker__item">আজকের বাজারদর দেখুন — প্রতিদিন হালনাগাদ</span>
          )}
        </div>
      </div>
    </header>
  );
}
