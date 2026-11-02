"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, MapPin, TrendingDown, TrendingUp } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import {
  formatBengaliNumber,
  formatUnit,
  getPriceRange,
  type Category,
  type Product,
} from "@/lib/products";

type LoadState = "loading" | "ready" | "error";

function ProductSkeletons({ count = 8 }: { count?: number }) {
  return (
    <div aria-label="পণ্য লোড হচ্ছে" className="product-grid">
      {Array.from({ length: count }, (_, index) => (
        <div aria-hidden="true" className="skeleton-card" key={index}>
          <div className="skeleton skeleton__art" />
          <div className="skeleton skeleton__line skeleton__line--short" />
          <div className="skeleton skeleton__line" />
          <div className="skeleton skeleton__line skeleton__line--medium" />
        </div>
      ))}
    </div>
  );
}

function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="state-card" role="alert">
      <span className="state-card__icon">🌐</span>
      <h3>তথ্য লোড করা যায়নি</h3>
      <p>ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।</p>
      <button className="button button--primary" onClick={onRetry} type="button">
        আবার চেষ্টা করুন
      </button>
    </div>
  );
}

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    let active = true;
    fetch("/api/products")
      .then(async (response) => {
        if (!response.ok) throw new Error("Products request failed");
        return (await response.json()) as Product[];
      })
      .then((data) => {
        if (!active) return;
        setProducts(data);
        setState("ready");
      })
      .catch((error: unknown) => {
        console.error("Home product request failed:", error);
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, [requestNumber]);

  function retryProducts() {
    setState("loading");
    setRequestNumber((number) => number + 1);
  }

  const risers = useMemo(
    () =>
      products
        .filter((product) => product.change.dir === "up")
        .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
        .slice(0, 6),
    [products],
  );
  const fallers = useMemo(
    () =>
      products
        .filter((product) => product.change.dir === "down")
        .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
        .slice(0, 6),
    [products],
  );

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="eyebrow"><span className="eyebrow__dot" /> আজকের বাজার, এক নজরে</span>
            <h1>বাজারের সঠিক দাম,<br /><span>আপনার হাতেই।</span></h1>
            <p>
              প্রতিদিনের প্রয়োজনীয় পণ্যের হালনাগাদ দাম জানুন। কাছের বাজারের সঙ্গে
              তুলনা করুন, কেনাকাটায় থাকুন এক ধাপ এগিয়ে।
            </p>
            <div className="hero__actions">
              <a className="button button--primary button--large" href="#সব-পণ্য">
                সব পণ্যের দাম দেখুন <span aria-hidden="true">↓</span>
              </a>
              <span className="hero__trust"><span>✓</span> প্রতিদিন হালনাগাদ তথ্য</span>
            </div>
            <div className="hero__stats">
              <div><strong>{state === "ready" ? formatBengaliNumber(products.length) : "—"}</strong><span>টি পণ্য</span></div>
              <span className="hero__stats-divider" />
              <div><strong>{state === "ready" ? formatBengaliNumber(new Set(products.map((product) => product.category)).size) : "—"}</strong><span>টি ক্যাটাগরি</span></div>
              <span className="hero__stats-divider" />
              <div><strong>প্রতিদিন</strong><span>নতুন বাজারদর</span></div>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__image-wrap">
              <Image
                alt="তাজা শাকসবজি ও নিত্যপ্রয়োজনীয় বাজারের পণ্য"
                className="hero__image"
                height={560}
                priority
                src="/bazar-hero.png"
                width={620}
              />
            </div>
            <div className="floating-price">
              <span className="floating-price__icon">🥬</span>
              <span><small>আজকের বাজার</small><strong>দাম জানুন, সাশ্রয় করুন</strong></span>
              <span className="floating-price__arrow">↗</span>
            </div>
            <div className="hero__sparkle hero__sparkle--one">✳</div>
            <div className="hero__sparkle hero__sparkle--two">✳</div>
          </div>
        </div>
      </section>

      <section className="section section--movement">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">দামের ওঠানামা</span>
              <h2><TrendingUp aria-hidden="true" className="heading-icon heading-icon--up" /> আজ দাম বেড়েছে</h2>
              <p>গতকালের তুলনায় যেসব পণ্যের দাম বেড়েছে</p>
            </div>
            <span className="section-count section-count--up">▲ {state === "ready" ? formatBengaliNumber(risers.length) : "—"} পণ্য</span>
          </div>
          {state === "loading" ? <ProductSkeletons count={3} /> : null}
          {state === "error" ? <LoadError onRetry={retryProducts} /> : null}
          {state === "ready" && risers.length > 0 ? <ProductGrid products={risers} /> : null}
          {state === "ready" && risers.length === 0 ? <p className="inline-empty">আজ কোনো পণ্যের দাম বাড়েনি।</p> : null}
        </div>
      </section>

      <section className="section section--movement section--soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">আপনার সাশ্রয়</span>
              <h2><TrendingDown aria-hidden="true" className="heading-icon heading-icon--down" /> আজ দাম কমেছে</h2>
              <p>গতকালের তুলনায় যেসব পণ্যের দাম কমেছে</p>
            </div>
            <span className="section-count section-count--down">▼ {state === "ready" ? formatBengaliNumber(fallers.length) : "—"} পণ্য</span>
          </div>
          {state === "loading" ? <ProductSkeletons count={3} /> : null}
          {state === "error" ? <LoadError onRetry={retryProducts} /> : null}
          {state === "ready" && fallers.length > 0 ? <ProductGrid products={fallers} /> : null}
          {state === "ready" && fallers.length === 0 ? <p className="inline-empty">আজ কোনো পণ্যের দাম কমেনি।</p> : null}
        </div>
      </section>

      <section className="section all-products" id="সব-পণ্য">
        <div className="container">
          <div className="section-heading section-heading--all">
            <div>
              <span className="section-kicker">আজকের সম্পূর্ণ তালিকা</span>
              <h2>সব পণ্যের দাম</h2>
              <p>আপনার নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক জায়গায়</p>
            </div>
            {state === "ready" && <span className="section-count">{formatBengaliNumber(products.length)} টি পণ্য</span>}
          </div>
          {state === "loading" ? <ProductSkeletons /> : null}
          {state === "error" ? <LoadError onRetry={retryProducts} /> : null}
          {state === "ready" && products.length > 0 ? <ProductGrid products={products} /> : null}
          {state === "ready" && products.length === 0 ? (
            <div className="state-card"><span className="state-card__icon">🧺</span><h3>এখনো কোনো পণ্য নেই</h3><p>পণ্যের তালিকা পরে আবার দেখুন।</p></div>
          ) : null}
        </div>
      </section>
    </>
  );
}

export function CategoryPage({ slug }: { slug: string }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [sort, setSort] = useState("default");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadCategory() {
      setState("loading");
      setNotFound(false);
      try {
        const categoryResponse = await fetch("/api/categories");
        if (!categoryResponse.ok) throw new Error("Categories request failed");
        const categories = (await categoryResponse.json()) as Category[];
        const foundCategory = categories.find((item) => item.slug === slug);
        if (!foundCategory) {
          if (active) {
            setCategory(null);
            setNotFound(true);
            setState("ready");
          }
          return;
        }

        const productsResponse = await fetch(`/api/products?category=${encodeURIComponent(slug)}`);
        if (!productsResponse.ok) throw new Error("Category products request failed");
        const categoryProducts = (await productsResponse.json()) as Product[];
        if (active) {
          setCategory(foundCategory);
          setProducts(categoryProducts);
          setState("ready");
        }
      } catch (error) {
        console.error(`Category page failed to load (${slug}):`, error);
        if (active) setState("error");
      }
    }
    void loadCategory();
    return () => {
      active = false;
    };
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const result = [...products];
    if (sort === "ascending") result.sort((a, b) => a.today - b.today);
    if (sort === "descending") result.sort((a, b) => b.today - a.today);
    return result;
  }, [products, sort]);

  if (state === "ready" && notFound) return <NotFoundState />;

  return (
    <section className="section category-page">
      <div className="container">
        <div className="category-banner">
          <div className="category-banner__icon">{category?.icon ?? "🧺"}</div>
          <div>
            <span className="section-kicker">ক্যাটাগরি</span>
            <h1>{category?.nameBn ?? "বাজারের পণ্য"}</h1>
            <p>এই ক্যাটাগরির হালনাগাদ বাজারদর এক নজরে দেখুন।</p>
          </div>
          <div className="category-banner__decoration" aria-hidden="true">✳</div>
        </div>

        <div className="category-toolbar">
          <div>
            <h2>{category?.nameBn ?? "পণ্য তালিকা"}</h2>
            {state === "ready" && <span>{formatBengaliNumber(products.length)} টি পণ্য</span>}
          </div>
          <label className="sort-control">
            <span>সাজান:</span>
            <span className="sort-control__select">
              <select aria-label="পণ্যের দাম অনুযায়ী সাজান" onChange={(event) => setSort(event.target.value)} value={sort}>
                <option value="default">ডিফল্ট</option>
                <option value="ascending">দাম: কম থেকে বেশি</option>
                <option value="descending">দাম: বেশি থেকে কম</option>
              </select>
              <ChevronDown aria-hidden="true" size={16} />
            </span>
          </label>
        </div>

        {state === "loading" ? <ProductSkeletons /> : null}
        {state === "error" ? <LoadError onRetry={() => window.location.reload()} /> : null}
        {state === "ready" && sortedProducts.length > 0 ? <ProductGrid products={sortedProducts} /> : null}
        {state === "ready" && sortedProducts.length === 0 && !notFound ? (
          <div className="state-card">
            <span className="state-card__icon">🧺</span>
            <h3>এই ক্যাটাগরিতে পণ্য নেই</h3>
            <p>অন্য ক্যাটাগরি দেখুন অথবা হোম পেজে ফিরে যান।</p>
            <Link className="button button--primary" href="/">হোম পেজে ফিরে যান</Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ProductDetailPage({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadProduct() {
      try {
        const listResponse = await fetch("/api/products");
        if (!listResponse.ok) throw new Error("Products request failed");
        const list = (await listResponse.json()) as Product[];
        const match = list.find((item) => item.slug === slug);
        if (!match) {
          if (active) {
            setNotFound(true);
            setState("ready");
          }
          return;
        }

        const detailResponse = await fetch(`/api/products/${encodeURIComponent(String(match.id))}`);
        if (!detailResponse.ok) throw new Error("Product detail request failed");
        const detail = (await detailResponse.json()) as Product;
        if (active) {
          setProduct(detail);
          setState("ready");
        }
      } catch (error) {
        console.error(`Unable to load product detail (${slug}):`, error);
        if (active) setState("error");
      }
    }
    void loadProduct();
    return () => {
      active = false;
    };
  }, [slug]);

  if (notFound && state === "ready") return <NotFoundState />;

  if (state === "loading") {
    return <section className="section"><div className="container"><ProductSkeletons count={1} /></div></section>;
  }
  if (state === "error" || !product) {
    return <section className="section"><div className="container"><LoadError onRetry={() => window.location.reload()} /></div></section>;
  }

  const range = getPriceRange(product);

  return (
    <section className="section detail-page">
      <div className="container">
        <Link className="back-link" href="/">← সব পণ্যে ফিরে যান</Link>
        <div className="detail-summary">
          <div className="detail-summary__emoji">{product.image}</div>
          <div className="detail-summary__copy">
            <div className="tag-row">
              <span className="category-tag">{product.categoryIcon} {product.categoryNameBn}</span>
              <span className="category-tag category-tag--unit">{formatUnit(product.unit)}</span>
            </div>
            <h1>{product.nameBn}</h1>
            <p>আজকের বাজারদর: {formatBengaliNumber(product.today)} টাকা {formatUnit(product.unit)}। বাজারভেদে দামের পার্থক্য থাকতে পারে।</p>
            <span className={`change-badge change-badge--${product.change.dir}`}>
              {product.change.dir === "up" ? "▲" : product.change.dir === "down" ? "▼" : "—"}
              {" "}{formatBengaliNumber(Math.abs(product.change.pct), 1)}% গতকালের তুলনায়
            </span>
          </div>
        </div>

        <div className="price-summary">
          <div><span>সর্বনিম্ন দাম</span><strong>{formatBengaliNumber(range.min)} <small>টাকা</small></strong></div>
          <div><span>সর্বোচ্চ দাম</span><strong>{formatBengaliNumber(range.max)} <small>টাকা</small></strong></div>
          <div><span>গড় বাজারদর</span><strong>{formatBengaliNumber(range.average, 1)} <small>টাকা</small></strong></div>
        </div>

        <div className="market-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">বাজারের তুলনামূলক চিত্র</span>
              <h2>বাজারভিত্তিক আজকের দাম</h2>
              <p>বিভিন্ন বাজার থেকে সংগৃহীত সর্বনিম্ন ও সর্বোচ্চ দাম</p>
            </div>
            <span className="market-updated"><span className="live-dot" /> আজকের তথ্য</span>
          </div>
          <div className="market-list">
            {product.markets.map((market) => (
              <article className="market-row" key={`${market.market}-${market.division}`}>
                <div className="market-row__name"><span className="market-pin"><MapPin size={17} /></span><span><strong>{market.market}</strong><small>{market.division}</small></span></div>
                <span className="market-row__range">
                  <small>দামের সীমা</small>
                  <strong>{formatBengaliNumber(market.min)}–{formatBengaliNumber(market.max)} টাকা</strong>
                </span>
              </article>
            ))}
          </div>
          <p className="detail-disclaimer">দাম বাজার ও সময়ভেদে পরিবর্তিত হতে পারে। কেনার আগে স্থানীয় বাজারে যাচাই করে নিন।</p>
        </div>
      </div>
    </section>
  );
}

export function NotFoundState() {
  return (
    <section className="section not-found">
      <div className="container">
        <div className="state-card">
          <span className="state-card__icon">🔎</span>
          <span className="section-kicker">৪০৪ — পৃষ্ঠা পাওয়া যায়নি</span>
          <h1>আপনি যে পৃষ্ঠাটি খুঁজছেন, সেটি নেই</h1>
          <p>লিংকটি ভুল হতে পারে, অথবা পৃষ্ঠাটি সরিয়ে ফেলা হয়েছে।</p>
          <Link className="button button--primary" href="/">হোম পেজে ফিরে যান</Link>
        </div>
      </div>
    </section>
  );
}
