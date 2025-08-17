"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransitionRouter } from "next-view-transitions";
import Logo from "./Logo";
import Link from "next/link";

export default function RootLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const t = useTranslations("layout");

  const routing = useTransitionRouter();

  function slideInOut() {
    // Test with the all page element
    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: "translateX(0)",
        },
        {
          opacity: 0.2,
          transform: "translateY(-35%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root-layout)",
      },
    );

    document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root-layout)",
      },
    );
  }

  return (
    <div
      className="flex flex-1 flex-col"
      style={{ viewTransitionName: "root-layout" }}
    >
      <header className="relative z-30 mx-auto flex h-16 w-full max-w-container2560 shrink-0 items-center px-4 py-2">
        <nav className="flex flex-1 font-medium ">
          <ul className="relative flex flex-grow items-center gap-4">
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
              <Link
                href={`/${locale}/works`}
                onClick={(e) => {
                  e.preventDefault();
                  routing.push(`/${locale}/works`, {
                    onTransitionReady: slideInOut,
                  });
                }}
              >
                {t("header.works")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/about`}>{t("header.info")}</Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className="flex-1 shrink-0">{children}</div>

      <footer className="relative flex min-h-16 w-full max-w-container2560 shrink-0 flex-col items-center justify-center px-4 py-2 lg:flex-row lg:justify-between">
        <Link href={`/${locale}`} className="mb-2 flex items-center lg:mb-0">
          <Logo />
        </Link>
        {/* FIXME: create these pages */}
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/${locale}/legal`}>{t("footer.legal")}</Link>|
          <Link href={`/${locale}/privacy`}>{t("footer.privacy")}</Link>|
          <Link href={`/${locale}/credit`}>{t("footer.credit")}</Link>
        </div>
      </footer>
    </div>
  );
}
