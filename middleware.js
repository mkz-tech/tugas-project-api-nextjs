
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/users") || pathname.startsWith("/api/items")) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized", code: 401 }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role;

      const res = NextResponse.next({
        request: {
          headers: new Headers({
            ...Object.fromEntries(request.headers),
            "x-user-id": String(payload.id),
            "x-user-email": String(payload.email),
            "x-user-role": String(role),
          }),
        },
      });

      if (pathname.startsWith("/api/users") && role !== "Admin") {
        return NextResponse.json({ success: false, error: "Forbidden", code: 403 }, { status: 403 });
      }
      if (pathname.startsWith("/api/items") && request.method === "DELETE" && role !== "Admin") {
        return NextResponse.json({ success: false, error: "Forbidden", code: 403 }, { status: 403 });
      }

      return res;
    } catch (error) {
      return NextResponse.json({ success: false, error: "Unauthorized", code: 401 }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/users/:path*", "/api/items/:path*", "/api/auth/:path*"],
};
