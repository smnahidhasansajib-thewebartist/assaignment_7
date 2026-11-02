export type MarketPrice = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
  markets: MarketPrice[];
};

export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export const API_BASES = [
  process.env.MAIN_API_URL ?? "https://openapi.programming-hero.com/api/bazardor",
  process.env.BASE_URL_1 ?? "https://api.api-store.workers.dev/api/bazardor",
  process.env.BASE_URL_2 ?? "https://api.abcz.workers.dev/api/bazardor",
];

export async function fetchFromApi<T>(path: string): Promise<T> {
  const errors: string[] = [];

  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}${path}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        errors.push(`${base}: HTTP ${response.status}`);
        continue;
      }

      return (await response.json()) as T;
    } catch (error) {
      errors.push(`${base}: ${error instanceof Error ? error.message : "Network error"}`);
    }
  }

  throw new Error(`All product APIs failed. ${errors.join("; ")}`);
}

export function formatBengaliNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits }).format(value);
}

export function formatUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    l: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
    packet: "প্রতি প্যাকেট",
  };
  return units[unit.toLowerCase()] ?? `প্রতি ${unit}`;
}

export function getPriceRange(product: Product) {
  const prices = product.markets.flatMap(({ min, max }) => [min, max]);
  return {
    min: prices.length ? Math.min(...prices) : product.today,
    max: prices.length ? Math.max(...prices) : product.today,
    average: prices.length
      ? prices.reduce((sum, price) => sum + price, 0) / prices.length
      : product.today,
  };
}
