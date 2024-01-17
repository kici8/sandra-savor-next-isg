import { Inter } from "next/font/google";
import "./globals.css";
import { dir } from "i18next";
import Link from "next/link";
import { languages } from "../i18n/settings";

const inter = Inter({ subsets: ["latin"] });

// Generate static paths based on lang params
export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) {
  return (
    <html lang={lang} dir={dir(lang)}>
      <body className={inter.className}>
        <nav className="flex justify-between gap-3 px-24 py-3">
          <Link href={`/${lang}`}>Go Home</Link>
          <div className="flex gap-3">
            {languages.map((language) => (
              <Link key={language} href={`/${language}`}>
                {language === lang ? <strong>{language}</strong> : language}
              </Link>
            ))}
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
