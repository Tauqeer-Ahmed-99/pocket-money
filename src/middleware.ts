import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/register(.*)",
  "/forgot-password(.*)",
  "/api/payment/(.*)",
  "/payment(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    console.log("URL:", req.nextUrl.pathname);
    console.log("Public route?", isPublicRoute(req));

    // Skip middleware entirely for payment callbacks
    if (req.nextUrl.pathname.startsWith("/api/payment/")) {
      return;
    }

    // Only protect routes that are NOT public
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  }
  // { debug: true }
);

export const config = {
  matcher: [
    // Exclude payment API routes from middleware matching
    "/((?!_next|api/payment|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Include other API routes but exclude payment ones
    "/(api(?!/payment)|trpc)(.*)",
  ],
};
