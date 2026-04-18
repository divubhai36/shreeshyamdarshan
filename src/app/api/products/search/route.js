import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [], collections: [] });
  }

  try {
    const searchTerm = query; 

    // 1. Search Products
    const products = await prisma.product.findMany({
      where: {
        isVisible: true,
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { productId: { contains: searchTerm, mode: 'insensitive' } },
          { category: { name: { contains: searchTerm, mode: 'insensitive' } } },
          { subCategory: { name: { contains: searchTerm, mode: 'insensitive' } } },
          { innerSubCategory: { name: { contains: searchTerm, mode: 'insensitive' } } },
        ],
      },
      include: {
        category: true,
        subCategory: true,
        innerSubCategory: true,
      },
      take: 20,
    });

    // 2. Search Categories & Subcategories for "Collections"
    const categories = await prisma.category.findMany({
      where: { name: { contains: searchTerm, mode: 'insensitive' } },
      take: 5,
    });

    const subCategories = await prisma.subCategory.findMany({
      where: { name: { contains: searchTerm, mode: 'insensitive' } },
      include: { category: true },
      take: 5,
    });

    // Format collections
    const collections = [
      ...categories.map(c => ({
        id: c.id,
        name: c.name,
        type: 'Collection',
        path: `/collections/${c.slug}`,
        image: c.imageUrl
      })),
      ...subCategories.map(s => ({
        id: s.id,
        name: s.name,
        type: s.category.name,
        path: `/category/${s.category.slug}/${s.slug}`,
        image: s.imageUrl
      }))
    ].slice(0, 10);

    return NextResponse.json({
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        productId: p.productId,
        category: p.category.name,
        section: p.innerSubCategory?.name,
        price: p.price,
        image: p.images[0] || "/hero.png",
      })),
      collections
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
