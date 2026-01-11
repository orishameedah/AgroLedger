import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. If a Buyer tries to enter Farmer pages -> Send to Buyer Marketplace
    if (path.startsWith("/farmer") && token?.role !== "farmer") {
      return NextResponse.redirect(new URL("/marketplace", req.url));
    }

    // 2. If a Farmer is logged in but hasn't done setup -> Force them to Setup Page
    // (Except when they are ALREADY on the setup page to avoid a loop)
    if (
      token?.role === "farmer" &&
      !token?.isSetupComplete &&
      path === "/farmer-dashboard"
    ) {
      return NextResponse.redirect(new URL("/farmer-setup", req.url));
    }
  },
  {
    callbacks: {
      // Authorized only if there is a token (user is logged in)
      authorized: ({ token }) => !!token,
    },
  }
);

// 3. Matcher: This defines which routes the "Security Guard" watches
export const config = {
  matcher: [
    "/farmer-setup/:path*",
    "/farmer-dashboard/:path*",
    "/marketplace/:path*",
  ],
};
