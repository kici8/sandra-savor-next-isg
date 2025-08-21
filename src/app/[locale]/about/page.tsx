import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import AboutScene from "./AboutScene";
import { Suspense, useRef } from "react";

// TODO: no need to use async if no data fetching is needed
// TODO: Or move these texts to the strapi backOffice
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div className="mx-auto grid max-w-container2560 grid-cols-4 gap-4 px-4 lg:grid-cols-12">
      <div className="col-span-4 flex flex-col items-center lg:col-span-6 lg:col-start-4">
        <div className="relative w-full pb-16 pt-32">
          <h1
            className="pointer-events-none relative z-10 text-center font-aujournuit text-7xl leading-[0.8]"
            dangerouslySetInnerHTML={{ __html: t("title") }}
          />
          <div className="absolute top-0 h-full w-full">
            <AboutScene />
          </div>
        </div>

        <p
          className="relative z-10 -mt-4 text-center text-sm"
          dangerouslySetInnerHTML={{ __html: t("description") }}
        />
        <div className="py-16">
          <InfoRow title={t("info.servicesLabel")} value={t("info.services")} />
          <InfoRow title={t("info.locationLabel")} value={t("info.location")} />
          <InfoRow
            title={t("info.emailLabel")}
            value={`<a href="mailto:info@savorgnanisandra.it" target=”_blank” class="break-all">info@savorgnanisandra.it</a>`}
          />
          <InfoRow
            title={t("info.socialLabel")}
            value={`<a href="https://www.instagram.com/sandra.savorgnani/" target=”_blank”>Instagram</a>`}
          />
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({
  title,
  value,
}: {
  title: React.ReactNode;
  value: string;
}) => (
  <dl className="grid grid-cols-6 gap-4 border-b border-light-color py-2 text-sm">
    <dt className="col-span-2 block">{title}</dt>
    <dd
      className="col-span-4 block font-medium"
      dangerouslySetInnerHTML={{
        __html: value,
      }}
    ></dd>
  </dl>
);
