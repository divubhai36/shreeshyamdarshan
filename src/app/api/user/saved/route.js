import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_session")?.value;
    const session = await decrypt(token);

    if (!session || session.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const savedProducts = await prisma.savedProduct.findMany({
      where: { wholesalerId: session.userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    // Map the products to match the frontend expectations (e.g., adding singular 'image' property)
    const mappedSaved = savedProducts.map(s => ({
      ...s.product,
      id: s.product.id,
      image: s.product.images[0] || "/hero.png",
      variantName: s.variantName === "BASE" ? null : s.variantName
    }));

    return NextResponse.json({ success: true, saved: mappedSaved });
  } catch (error) {
    console.error("🚨 USER SAVED PRODUCTS FETCH FAILED:", error);
    return NextResponse.json({ error: "Failed to retrieve saved products" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_session")?.value;
    const session = await decrypt(token);

    if (!session || session.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { productId, variantName, action, items } = await req.json();
    const vName = variantName || "BASE";

    // Handle BULK SAVE
    if (action === "BULK_SAVE" && Array.isArray(items)) {
      for (const item of items) {
        await prisma.savedProduct.upsert({
          where: {
            wholesalerId_productId_variantName: {
              wholesalerId: session.userId,
              productId: item.productId,
              variantName: item.variantName || "BASE",
            },
          },
          update: {}, // No updates needed if already exists
          create: {
            wholesalerId: session.userId,
            productId: item.productId,
            variantName: item.variantName || "BASE",
          },
        });
      }
      return NextResponse.json({ success: true, message: "Bulk items saved" });
    }

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Toggle logic
    const existing = await prisma.savedProduct.findUnique({
      where: {
        wholesalerId_productId_variantName: {
          wholesalerId: session.userId,
          productId: productId,
          variantName: vName,
        },
      },
    });

    if (existing) {
      await prisma.savedProduct.delete({
        where: {
          id: existing.id,
        },
      });
      return NextResponse.json({ success: true, action: "removed" });
    } else {
      await prisma.savedProduct.create({
        data: {
          wholesalerId: session.userId,
          productId: productId,
          variantName: vName,
        },
      });
      return NextResponse.json({ success: true, action: "added" });
    }
  } catch (error) {
    console.error("🚨 USER SAVED PRODUCTS TOGGLE FAILED:", error);
    return NextResponse.json({ error: "Failed to toggle saved product" }, { status: 500 });
  }
}
