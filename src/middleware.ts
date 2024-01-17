import { NextRequest, NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages, i18nCookieName } from "./app/i18n/settings";

acceptLanguage.languages(languages);

export function middleware(request: NextRequest) {
  // Get the language from the cookie or the Accept-Language header
  let languageToSet;
  const cookie = request.cookies.get(i18nCookieName);
  if (cookie) languageToSet = acceptLanguage.get(cookie.value);
  if (!languageToSet)
    languageToSet = acceptLanguage.get(request.headers.get("Accept-Language"));
  if (!languageToSet) languageToSet = fallbackLng;

  // Check if the path has a valid locale
  const { pathname } = request.nextUrl;
  const pathnameHasValidLocale = languages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // If the path doesn't have a valid local and is not an internal path
  // redirect to the home with the language set
  if (
    !pathnameHasValidLocale &&
    !request.nextUrl.pathname.startsWith("/_next")
  ) {
    request.nextUrl.pathname = `/${languageToSet}`;
    return Response.redirect(request.nextUrl);
  }

  // Set the language cookie
  if (request.headers.has("referer")) {
    const newLocal = request.headers.get("referer");

    if (newLocal) {
      const refererUrl = new URL(newLocal);
      const lngInReferer = languages.find((l) =>
        refererUrl.pathname.startsWith(`/${l}`),
      );
      const response = NextResponse.next();

      if (lngInReferer) response.cookies.set(i18nCookieName, lngInReferer);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // matcher: '/:lng*'
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
