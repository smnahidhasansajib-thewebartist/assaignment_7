import { connection, NextResponse } from "next/server";
import { fetchFromApi, type Category } from "@/lib/products";

export async function GET() {
  await connection();
  try {
    const categories = await fetchFromApi<Category[]>("/categories");
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Unable to load product categories:", error);
    return NextResponse.json(
      { message: "ক্যাটাগরির তথ্য এখন পাওয়া যাচ্ছে না।" },
      { status: 502 },
    );
  }
}
