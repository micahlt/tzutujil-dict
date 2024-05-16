import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let locales = ["en", "es"];

// Get the preferred locale, similar to the above or using a library
function getLocale(request) {
  const overrideLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (overrideLocale) {
    console.log("Overriding locale", overrideLocale);
    return overrideLocale;
  }

  let headers = { "accept-language": request.headers.get("accept-language") };
  let languages = new Negotiator({ headers }).languages();
  let defaultLocale = "en";

  return match(languages, locales, defaultLocale);
}

export function middleware(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some((locale) => {
    return pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`;
  });

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
