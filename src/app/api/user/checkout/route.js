import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import prisma from "@/lib/prisma";

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

    // Generate unique order number
    const orderNumber = `SSD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          wholesalerId: session.userId,
          totalAmount,
          status: "PENDING",
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
      return order;
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("🚨 CHECKOUT ERROR:", error);
    return NextResponse.json({ error: "Failed to process fulfillment request" }, { status: 500 });
  }
}
