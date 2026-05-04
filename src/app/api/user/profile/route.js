import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt, encrypt } from "@/lib/session";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/user/profile - Validate session and get profile
export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_session")?.value;
    const session = await decrypt(token);

    if (!session || session.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.wholesaler.findUnique({
      where: { id: session.userId },
      select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          companyName: true,
          address: true,
          isActive: true
      }
    });

    if (!user || !user.isActive) {
        return NextResponse.json({ error: "User not found or inactive" }, { status: 401 });
    }

    // SESSION REVALIDATION (Refresh Token logic)
    // Extend session for another 24 hours
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newSessionData = { ...session, expires };
    const newSessionToken = await encrypt(newSessionData);

    const response = NextResponse.json({ success: true, user });

    // Set refreshed cookies
    response.cookies.set("user_session", newSessionToken, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    response.cookies.set("ssd_wholesale_logged", "true", {
        expires,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    return response;
  } catch (error) {
    console.error("🚨 PROFILE FETCH FAILED:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
