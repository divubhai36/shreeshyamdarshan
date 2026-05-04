import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '0.0.0.0';
    
    // Rate Limit: 5 inquiries per hour
    const { allowed } = await checkRateLimit(ip, 'inquiry', 5);
    if (!allowed) {
        return NextResponse.json({ 
            error: "Too many inquiries. Please try again after some time to protect our system." 
        }, { status: 429 });
    }

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
