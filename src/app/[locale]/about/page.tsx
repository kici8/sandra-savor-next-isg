import { setStaticParamsLocale } from "next-international/server";
import { getScopedI18n } from "../../../../locales/server";

// Page component
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  // TODO: move these texts to the strapi backOffice
  const t = await getScopedI18n("about");

  return (
    <div className="mx-auto grid max-w-container2560 grid-cols-4 gap-4 px-4 lg:grid-cols-12">
      <div className="col-span-4 flex flex-col items-center gap-4 lg:col-span-6 lg:col-start-4">
        <h1
          className="mb-4 text-center font-aujournuit text-6xl leading-none"
          dangerouslySetInnerHTML={{ __html: t("title") }}
        />
        <p
          className="text-center text-sm"
          dangerouslySetInnerHTML={{ __html: t("description") }}
        />
        <div className="w-[calc(100%-2rem)] px-4 py-8">
          <InfoRow title={t("info.servicesLabel")} value={t("info.services")} />
          <InfoRow title={t("info.locationLabel")} value={t("info.location")} />
          <InfoRow
            title={t("info.emailLabel")}
            value={`<a href="mailto:info@savorgnanisandra.it" target=”_blank”>info@savorgnanisandra.it</a>`}
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
  <dl className="grid grid-cols-6 gap-4 border-b border-blue-900 py-2 text-sm">
    <dt className="col-span-2 block">{title}</dt>
    <dd
      className="col-span-4 block font-medium"
      dangerouslySetInnerHTML={{
        __html: value,
      }}
    ></dd>
  </dl>
);
