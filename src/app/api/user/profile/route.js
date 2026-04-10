import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_session")?.value;
    const session = await decrypt(token);

    if (!session || session.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { name, companyName, address, password, confirmPassword } = await req.json();

    const updateData = {
      name,
      companyName,
      address,
    };

    if (password) {
      if (password !== confirmPassword) {
        return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
      updateData.plainPassword = password; // Also sync for admin view if needed
    }

    const updatedUser = await prisma.wholesaler.update({
      where: { id: session.userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("🚨 PROFILE UPDATE FAILED:", error);
    return NextResponse.json({ error: "Failed to update profile info" }, { status: 500 });
  }
}
