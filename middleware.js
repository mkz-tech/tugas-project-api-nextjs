import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // izinkan auth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // melindungi /api/users -> Hanya Admin
  if (pathname.startsWith("/api/users")) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized", code: 401 }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== "Admin") {
        return NextResponse.json({ success: false, error: "Forbidden", code: 403 }, { status: 403 });
      }
      // melampirkan headers
      return NextResponse.next({
        request: {
          headers: new Headers({
            ...Object.fromEntries(request.headers),
            "x-user-id": String(payload.id),
            "x-user-email": String(payload.email),
            "x-user-role": String(payload.role),
          }),
        },
      });
    } catch (error) {
      return NextResponse.json({ success: false, error: "Unauthorized", code: 401 }, { status: 401 });
    }
  }

  // melindungi /api/students (Admin atau User)
  if (pathname.startsWith("/api/students")) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized", code: 401 }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // melampirkan headers untuk handlers
      const res = NextResponse.next({
        request: {
          headers: new Headers({
            ...Object.fromEntries(request.headers),
            "x-user-id": String(payload.id),
            "x-user-email": String(payload.email),
            "x-user-role": String(payload.role),
          }),
        },
      });

      // DELETE hanya admin 
      return res;
    } catch (error) {
      return NextResponse.json({ success: false, error: "Unauthorized", code: 401 }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/users/:path*", "/api/students/:path*", "/api/auth/:path*"],
};