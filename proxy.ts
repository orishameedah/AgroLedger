import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Guard against non-farmers entering the dashboard
    // We use lowercase "farmer" to match your DB exactly
    if (path.startsWith("/farmer-dashboard") && token?.role !== "farmer") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/farmer-setup") && token?.role !== "farmer") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 2. Guard against farmers who haven't finished setup
    if (path.startsWith("/farmer-dashboard") && !token?.isSetupComplete) {
      return NextResponse.redirect(new URL("/farmer-setup", req.url));
    }

    // 3. Prevent loop: If setup is complete, keep them out of /setup-farm
    if (path.startsWith("/farmer-setup") && token?.isSetupComplete) {
      return NextResponse.redirect(new URL("/farmer-dashboard", req.url));
    }
  },
  {
    callbacks: {
      //authorized: ({ token }) => !!token, // This handles the basic "is logged in" check
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/farmer-dashboard/:path*", "/farmer-setup/:path*"],
};
