import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [categories, subCategories, products] = await Promise.all([
      prisma.category.count(),
      prisma.subCategory.count(),
      prisma.product.count(),
    ]);

    return NextResponse.json({
      categories,
      subCategories,
      products,
      reviews: 12, // Placeholder
    }, { status: 200 });
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
