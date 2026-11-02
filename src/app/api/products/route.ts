import { connection, NextResponse } from "next/server";
import { fetchFromApi, type Product } from "@/lib/products";

export async function GET(request: Request) {
  await connection();
  const category = new URL(request.url).searchParams.get("category");

  try {
    const path = category ? `/products?category=${encodeURIComponent(category)}` : "/products";
    const products = await fetchFromApi<Product[]>(path);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Unable to load products:", error);
    return NextResponse.json(
      { message: "পণ্যের তথ্য এখন পাওয়া যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।" },
      { status: 502 },
    );
  }
}
