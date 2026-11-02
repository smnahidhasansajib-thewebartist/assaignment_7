import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { NotFoundState, ProductDetailPage } from "@/components/catalog-pages";
import { fetchFromApi, type Product } from "@/lib/products";

export default async function ProductRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let products: Product[];
  try {
    products = await fetchFromApi<Product[]>("/products");
  } catch (error) {
    console.error(`Unable to verify product route (${slug}):`, error);
    return (
      <section className="section">
        <div className="container">
          <div className="state-card" role="alert">
            <span className="state-card__icon">🌐</span>
            <h1>পণ্যের তথ্য লোড করা যায়নি</h1>
            <p>কিছুক্ষণ পরে আবার চেষ্টা করুন।</p>
            <Link className="button button--primary" href="/">হোম পেজে ফিরে যান</Link>
          </div>
        </div>
      </section>
    );
  }

  if (!products.some((product) => product.slug === slug)) {
    return <NotFoundState />;
  }

  return (
    <AuthGuard>
      <ProductDetailPage slug={slug} />
    </AuthGuard>
  );
}
