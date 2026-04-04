import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  
  if (path.startsWith("/admin") && path !== "/admin/login") {
    const token = req.cookies.get("admin_session")?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    
    const parsed = await decrypt(token);
    
    if (!parsed) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
