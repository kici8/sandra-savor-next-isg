import { setStaticParamsLocale } from "next-international/server";
import { getI18n } from "../../../../locales/server";

// Page component
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  // TODO: move these texts to the strapi backOffice
  const t = await getI18n();

  return (
    <div className="">
      <div className="flex max-w-96 flex-col items-center gap-2">
        <h1 className="text-center text-xl font-bold">{t("about.title")}</h1>
        <p className="text-center text-sm">{t("about.description")}</p>
      </div>
    </div>
  );
}
