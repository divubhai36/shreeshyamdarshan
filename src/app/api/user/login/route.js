import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/session";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '0.0.0.0';
    
    // Rate Limit: 10 login attempts per hour
    const { allowed } = await checkRateLimit(ip, 'login', 10);
    if (!allowed) {
        return NextResponse.json({ 
            error: "Too many login attempts. Please try again later for security reasons." 
        }, { status: 429 });
    }

    const { phone, password } = await req.json();

    const user = await prisma.wholesaler.findUnique({
      where: { phone },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid credentials or account inactive" },
        { status: 401 }
      );
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
      const sessionData = {
        userId: user.id,
        phone: user.phone,
        name: user.name,
        role: "USER",
        expires,
      };

      const session = await encrypt(sessionData);

      const cookieStore = await cookies();
      
      // Secure session (httpOnly)
      cookieStore.set("user_session", session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      // UI visibility cookie (NOT httpOnly)
      cookieStore.set("ssd_wholesale_logged", "true", {
        expires,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return NextResponse.json({ success: true, user: { id: user.id, name: user.name, phone: user.phone, email: user.email } });
    }

    return NextResponse.json(
      { error: "Invalid phone or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("🚨 USER LOGIN FAILED:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
