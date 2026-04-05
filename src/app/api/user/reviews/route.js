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

    const review = await prisma.review.findUnique({
      where: { wholesalerId: session.userId },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("🚨 USER REVIEW FETCH FAILED:", error);
    return NextResponse.json({ error: "Failed to retrieve review" }, { status: 500 });
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

    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 });
    }

    // Check if review already exists
    const existing = await prisma.review.findUnique({
      where: { wholesalerId: session.userId },
    });

    if (existing) {
      return NextResponse.json({ error: "One review per wholesaler allowed" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        wholesalerId: session.userId,
        rating: parseInt(rating),
        comment,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("🚨 USER REVIEW SUBMISSION FAILED:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
