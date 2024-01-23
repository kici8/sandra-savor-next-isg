import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { locales } from "@/i18n";
import { unstable_setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Logo from "@/components/Logo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// Generate static paths based on locale params
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}) {
  unstable_setRequestLocale(locale);

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-orange-50 text-gray-900 dark:bg-black dark:text-orange-50`}
      >
        <header className="flex h-20 items-center px-4">
          <nav className="flex flex-1">
            <ul className="relative flex flex-grow items-center justify-between">
              <li>
                <Link className="" href={`/${locale}`}>
                  Sandra Savorgnani
                </Link>
              </li>
              <li className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link href={`/${locale}`}>
                  <Logo />
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`}>About</Link>
              </li>
            </ul>
          </nav>
        </header>

        {children}
        <footer>
          <div className="flex gap-3">
            {locales.map((language) => (
              <Link key={language} href={`/${language}`}>
                {language === locale ? <strong>{language}</strong> : language}
              </Link>
            ))}
          </div>
        </footer>
      </body>
    </html>
  );
}
