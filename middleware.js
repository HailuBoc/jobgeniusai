import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkConfigured } from "@/lib/clerk";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
]);

const CLERK_CLOCK_SKEW_IN_MS = 15_000;
const CLERK_RECOVERY_COOKIES = [
  "__session",
  "__client_uat",
  "__clerk_db_jwt",
  "__clerk_handshake",
  "__clerk_redirect_count",
];

const isRecoverableClerkError = (error) => {
  const message = String(error?.message || error || "");

  return (
    message.includes("token-iat-in-the-future") ||
    message.includes("Clock skew detected") ||
    message.includes("infinite redirect loop")
  );
};

const clearClerkCookies = (response) => {
  CLERK_RECOVERY_COOKIES.forEach((name) => {
    response.cookies.delete(name);
  });
};

const clerk = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return NextResponse.next();
}, { clockSkewInMs: CLERK_CLOCK_SKEW_IN_MS });

export default function middleware(req, evt) {
  if (!isClerkConfigured) {
    return NextResponse.next();
  }

  try {
    return clerk(req, evt);
  } catch (error) {
    if (isRecoverableClerkError(error)) {
      const response = NextResponse.next();
      clearClerkCookies(response);
      return response;
    }

    throw error;
  }
}

export const config = {
  matcher: [
    "/service-worker.js",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
