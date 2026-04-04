import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await decrypt(token);
    if (!session || !session.email) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { newPassword } = await request.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.adminUser.update({
      where: { email: session.email },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ ok: true, message: "Password updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
