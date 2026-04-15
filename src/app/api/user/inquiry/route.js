import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const data = await req.json();
    
    if (!data.name || !data.mobile) {
      return NextResponse.json({ error: "Name and Mobile are required" }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        mobile: data.mobile,
        city: data.city || null,
        state: data.state || null,
        product: data.product || null,
        pieces: data.pieces?.toString() || null,
        type: data.type || "GENERAL"
      }
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("🚨 INQUIRY ERROR:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
