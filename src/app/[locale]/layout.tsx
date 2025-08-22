import Logo from "@/components/Logo";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "../globals.css";
import { hasLocale, Locale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Sipario from "@/components/Sipario";

// TODO: add license for the fonts
// Font display
const aujournuit = localFont({
  src: "../../../public/fonts/Aujournuit-Condensed.woff2",
  variable: "--font-aujournuit",
  display: "swap",
});

// TODO: add license for the fonts
// Font main
const ronzino = localFont({
  src: [
    {
      path: "../../../public/fonts/Ronzino-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Ronzino-Oblique.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../../public/fonts/Ronzino-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Ronzino-MediumOblique.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../../public/fonts/Ronzino-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Ronzino-BoldOblique.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-ronzino",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      // TODO: add images and...
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("layout");

  // Preloader
  // https://stackoverflow.com/questions/54158994/react-suspense-lazy-delay

  return (
    <html lang={locale}>
      <body
        className={`${aujournuit.variable} ${ronzino.variable} min-h-full bg-light-bg font-ronzino text-light-color dark:bg-black dark:text-orange-50`}
      >
        <NextIntlClientProvider>
          <header className="fixed z-30 mx-auto flex min-h-12 w-full max-w-container2560 shrink-0 items-center bg-green-400 px-4 py-2 opacity-60">
            <nav className="isolate flex flex-1 text-sm font-medium mix-blend-difference">
              <ul className="flex flex-grow items-center gap-4">
                <li className="mr-auto flex items-center gap-4">
                  <Link
                    href={`/${locale}`}
                    className="flex items-center gap-3 leading-none"
                    aria-label="Sandra savorgnani home"
                  >
                    Sandra Savorgnani
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/works`}>{t("header.works")}</Link>
                </li>
                <li>
                  <Link href={`/${locale}/about`}>{t("header.info")}</Link>
                </li>
              </ul>
            </nav>
          </header>
          <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
            <Sipario />
          </div>
          <div className="relative z-10 min-h-dvh">{children}</div>
          {/* FOOTER */}
          <footer className="fixed bottom-0 z-30 flex min-h-12 w-full max-w-container2560 shrink-0 flex-col items-center justify-center bg-purple-400 px-4 py-2 opacity-60 lg:flex-row lg:justify-between">
            <Link
              href={`/${locale}`}
              className="mb-2 flex items-center lg:mb-0"
            >
              <Logo />
            </Link>
            {/* FIXME: create these pages */}
            {/* <div className="flex items-center gap-2 text-sm">
              <Link href={`/${locale}/legal`}>{t("footer.legal")}</Link>|
              <Link href={`/${locale}/privacy`}>{t("footer.privacy")}</Link>|
              <Link href={`/${locale}/credit`}>{t("footer.credit")}</Link>
            </div> */}
            {/* <div className="flex gap-3">
            {locales.map((language) => (
              <Link key={language} href={`/${language}`}>
                {language === locale ? <strong>{language}</strong> : language}
              </Link>
            ))}
          </div> */}
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
