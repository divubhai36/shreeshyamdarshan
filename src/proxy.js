import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

export default async function proxy(req) {
  const path = req.nextUrl.pathname;
  
  if (path.startsWith("/admin") && path !== "/admin/login") {
    const token = req.cookies.get("admin_session")?.value;
    if (!token || !(await decrypt(token))) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  const userProtectedPaths = ["/my-account", "/saved-products", "/checkout", "/orders"];
  if (userProtectedPaths.some(p => path.startsWith(p))) {
    const token = req.cookies.get("user_session")?.value;
    if (!token || !(await decrypt(token))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  
  return NextResponse.next();
}

export { proxy as middleware };

export const config = {
  matcher: ["/admin/:path*", "/my-account/:path*", "/saved-products/:path*", "/checkout/:path*", "/orders/:path*"],
};
