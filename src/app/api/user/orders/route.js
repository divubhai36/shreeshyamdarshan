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

    const orders = await prisma.order.findMany({
      where: { wholesalerId: session.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("🚨 USER ORDERS FETCH FAILED:", error);
    return NextResponse.json({ error: "Failed to retrieve order history" }, { status: 500 });
  }
}
