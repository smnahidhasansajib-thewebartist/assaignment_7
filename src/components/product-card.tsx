import Link from "next/link";
import {
  formatBengaliNumber,
  formatUnit,
  type Product,
} from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const direction = product.change.dir;
  const changeLabel =
    direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

  return (
    <Link className="product-card" href={`/product/${product.slug}`} prefetch={false}>
      <div className="product-card__top">
        <span className="product-card__emoji" aria-hidden="true">
          {product.image || product.categoryIcon}
        </span>
        <span className={`change-badge change-badge--${direction}`}>
          {changeLabel} {formatBengaliNumber(Math.abs(product.change.pct), 1)}%
        </span>
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.categoryNameBn}</span>
        <h3>{product.nameBn}</h3>
        <p className="product-card__unit">{formatUnit(product.unit)}</p>
        <div className="product-card__price">
          <span>আজকের দাম</span>
          <strong>{formatBengaliNumber(product.today)} টাকা</strong>
        </div>
      </div>
      <span className="product-card__link" aria-hidden="true">
        বিস্তারিত দেখুন <span>↗</span>
      </span>
    </Link>
  );
}
