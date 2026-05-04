import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import prisma from "@/lib/prisma";
import { roundToTwo } from "@/lib/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_session")?.value;
    const session = await decrypt(token);

    if (!session || session.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { wholesalerId: session.userId },
      include: { product: true },
    });

    // Map to include product info and flattened quantity/variant
    const mappedCart = cartItems.map(item => ({
      ...item.product,
      id: item.productId,
      quantity: item.quantity,
      variantName: item.variantName === "BASE" ? null : item.variantName,
      price: item.price, 
      originalPrice: item.originalPrice || item.price,
      image: item.product.images[0] || "/images/hero.webp"
    }));

    return NextResponse.json({ success: true, cart: mappedCart });
  } catch (error) {
    console.error("🚨 USER CART FETCH FAILED:", error);
    return NextResponse.json({ error: "Failed to retrieve cart" }, { status: 500 });
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

    const body = await req.json();
    const { productId, quantity, variantName, price, originalPrice, action } = body;
    const vName = variantName || "BASE";
    const numPrice = roundToTwo(price) || 0;
    const numOriginalPrice = originalPrice ? roundToTwo(originalPrice) : null;
    const numQuantity = parseInt(quantity) || 0;

    // Handle "BULK_ADD" action from multiple variant selection
    if (action === "BULK_ADD") {
      const { items } = body;
      for (const item of items) {
        const itemPrice = roundToTwo(item.price) || 0;
        const itemOriginalPrice = item.originalPrice ? roundToTwo(item.originalPrice) : null;
        const itemQty = parseInt(item.quantity) || 0;

        await prisma.cartItem.upsert({
          where: {
            wholesalerId_productId_variantName: {
              wholesalerId: session.userId,
              productId: item.productId,
              variantName: item.variantName || "BASE",
            },
          },
          update: {
            quantity: { increment: itemQty },
            price: itemPrice,
            originalPrice: itemOriginalPrice
          },
          create: {
            wholesalerId: session.userId,
            productId: item.productId,
            quantity: itemQty,
            variantName: item.variantName || "BASE",
            price: itemPrice,
            originalPrice: itemOriginalPrice
          },
        });
      }
      return NextResponse.json({ success: true, message: "Bulk items added" });
    }

    // Handle "CLEAR_CART" action
    if (action === "CLEAR_CART") {
      await prisma.cartItem.deleteMany({
        where: { wholesalerId: session.userId }
      });
      return NextResponse.json({ success: true, message: "Cart cleared" });
    }

    if (!productId && action !== "CLEAR_CART") {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // If quantity is 0 or less, remove the item
    if (numQuantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: {
          wholesalerId: session.userId,
          productId: productId,
          variantName: vName,
        }
      });
      return NextResponse.json({ success: true, message: "Item removed" });
    }

    // Upsert logic for adding/updating (This is for absolute quantity updates)
    await prisma.cartItem.upsert({
      where: {
        wholesalerId_productId_variantName: {
          wholesalerId: session.userId,
          productId: productId,
          variantName: vName,
        },
      },
      update: {
        quantity: numQuantity,
        price: numPrice,
        originalPrice: numOriginalPrice
      },
      create: {
        wholesalerId: session.userId,
        productId: productId,
        quantity: numQuantity,
        variantName: vName,
        price: numPrice,
        originalPrice: numOriginalPrice
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🚨 USER CART UPDATE FAILED:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
