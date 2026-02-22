import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // If no token, the 'authorized' callback below handles it.
    if (!token) return;

    const isFarmer = token.role === "farmer";
    const setupDone = token.isSetupComplete;

    // If a farmer is on the Home page and hasn't done setup, push them to setup!
    if (path === "/" && isFarmer && !setupDone) {
      return NextResponse.redirect(new URL("/farmer-setup", req.url));
    }

    // 1. Guard against non-farmers entering any farmer zones
    if (
      (path.startsWith("/farmer-dashboard") ||
        path.startsWith("/farmer-setup")) &&
      !isFarmer
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // RULE 2: Protect Dashboard from unfinished setup
    if (path.startsWith("/farmer-dashboard") && isFarmer && !setupDone) {
      return NextResponse.redirect(new URL("/farmer-setup", req.url));
    }

    // RULE 3: Protect Dashboard from non-farmers
    if (path.startsWith("/farmer-dashboard") && !isFarmer) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // RULE 4: If setup is already done, don't let them back into /farmer-setup
    if (path.startsWith("/farmer-setup") && isFarmer && setupDone) {
      return NextResponse.redirect(new URL("/farmer-dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  // We MUST include "/" so the middleware can intercept Farmers hitting the home page
  matcher: ["/farmer-dashboard/:path*", "/farmer-setup/:path*"],
};
