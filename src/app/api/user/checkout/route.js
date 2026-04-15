import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import prisma from "@/lib/prisma";
import { roundToTwo } from "@/lib/utils";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_session")?.value;
    const session = await decrypt(token);

    if (!session || session.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { items, totalAmount } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cannot process empty registry" }, { status: 400 });
    }

    // Calculate original total from items
    const originalTotal = roundToTwo(items.reduce((acc, it) => acc + (it.originalPrice || it.price) * it.quantity, 0));

    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Get current count to determine next sequence
      const orderCount = await tx.order.count();
      const nextSequence = orderCount + 1;

      // 2. Format Date (DDMMYY)
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const yy = String(now.getFullYear()).slice(-2);
      const dateStr = `${dd}${mm}${yy}`;

      const finalOrderNumber = `SSD-${dateStr}-${nextSequence}`;

      const order = await tx.order.create({
        data: {
          orderNumber: finalOrderNumber,
          wholesalerId: session.userId,
          totalAmount: roundToTwo(totalAmount),
          originalTotal: roundToTwo(originalTotal),
          status: "PENDING",
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: roundToTwo(item.price),
              originalPrice: roundToTwo(item.originalPrice || item.price),
              variantName: item.variantName,
            })),
          },
        },
        include: { wholesaler: true }
      });
      return order;
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("🚨 CHECKOUT ERROR:", error);
    return NextResponse.json({ error: "Failed to process fulfillment request" }, { status: 500 });
  }
}
