import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@shreeshyamdarshan.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin@ssd@123";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    let user = await prisma.adminUser.findUnique({ where: { email } });

    // Auto-seed first admin
    if (!user) {
      if (email === adminEmail) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        user = await prisma.adminUser.create({
          data: {
            email,
            password: hashedPassword,
            name: "Site Admin"
          }
        });
      } else {
        return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
    }

    // Assign JWT Token to cookies
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const sessionToken = await encrypt({ id: user.id, email: user.email });

    cookies().set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expires,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ ok: true, message: "Logged in successfully" }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
