import { connection, NextResponse } from "next/server";
import { fetchFromApi, type Product } from "@/lib/products";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  await connection();
  const { id } = await context.params;

  try {
    const product = await fetchFromApi<Product>(`/products/${encodeURIComponent(id)}`);
    return NextResponse.json(product);
  } catch (error) {
    console.error(`Unable to load product ${id}:`, error);
    return NextResponse.json(
      { message: "এই পণ্যের তথ্য এখন পাওয়া যাচ্ছে না।" },
      { status: 502 },
    );
  }
}
