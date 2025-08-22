import { fetchData } from "@/graphql/fetchData";
import { WorksForWorkQuery } from "@/graphql/generated/graphql";
import { routing } from "@/i18n/routing";
import { hasLocale, Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { worksForWork, worksForWorkStaticParams } from "./queries";
import { Metadata } from "next";

// Genera tutti i parametri statici per ogni locale e ogni work
export async function generateStaticParams() {
  const allParams: { locale: string; slug: string }[] = [];

  await Promise.all(
    routing.locales.map(async (locale) => {
      const result = await fetchData(worksForWorkStaticParams, { locale });
      if (result?.works?.data) {
        result.works.data.forEach((work) => {
          if (work.attributes?.slug) {
            allParams.push({ locale, slug: work.attributes?.slug });
          }
        });
      }
    }),
  );

  return allParams;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;

  // Fetch the work data
  const data = await fetchData(worksForWork, {
    slug: slug,
    locale: locale,
  });
  const t = await getTranslations("work.metadata");

  const work = data?.works?.data?.[0];

  return {
    title: t("title", { title: work?.attributes?.title || t("untitledWork") }),
    description: work?.attributes?.description || t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("title", {
        title: work?.attributes?.title || t("untitledWork"),
      }),
      description: work?.attributes?.description || t("description"),
      authors: ["Sandra Savorgnani"],
      images:
        work?.attributes?.images?.data
          ?.filter((img) => !!img.attributes?.url)
          .map((img) => ({
            url: img.attributes!.url as string,
            alt: img.attributes?.alternativeText || "",
          })) || [],
    },
  };
}

// Page component
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  // Data fetching
  const { slug, locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    // TODO: remove and handle not found in a better way
    // notFound();
    return (
      <div className="text-center text-red-500">Locale not found: {locale}</div>
    );
  }
  setRequestLocale(locale);

  const data: WorksForWorkQuery = await fetchData(worksForWork, {
    slug: slug,
    locale: locale,
  });

  const t = await getTranslations("work");

  // 404 if no work found
  if (!data || !data.works || data.works?.data.length === 0) {
    // TODO: remove and handle not found in a better way
    // notFound();
    return (
      <div className="text-center text-red-500">
        Work not found for slug: {slug}
      </div>
    );
  }

  // Data extraction
  const work = data.works?.data[0];
  const year = work.attributes?.dateOfCreation
    ? new Date(work.attributes.dateOfCreation).getFullYear()
    : undefined;

  // full width layout with 12 columns and a container for > 2560px screens
  // fast col generation https://www.tailwindgen.com/

  return (
    <div className="mx-auto grid max-w-container2560 grid-cols-4 gap-4 px-4 lg:grid-cols-12 lg:grid-rows-[auto,1fr]">
      {/* 
        // TODO: rewrite the layout to use sticky positioning for title and info
        // TITLE AND DESCRIPTION
      */}
      <div className="col-span-4 col-start-1 row-start-1 lg:col-span-5">
        <h1 className="mb-4 break-all font-aujournuit text-8xl leading-none">
          {work.attributes?.title}
        </h1>
        <p className="text-sm lg:col-span-5">{work.attributes?.description}</p>
      </div>

      {/* INFO 
          // TODO: add more info like technique, category.
      */}
      <div className="col-span-4 row-start-3 py-8 lg:col-span-5 lg:row-start-2">
        <div className="grid grid-cols-5 gap-4 border-b border-blue-900 py-2">
          <span className="col-span-3 text-sm font-medium">
            {t("info.title")}
          </span>
        </div>
        {year && <InfoRow title={t("info.year")} value={year} />}
        {work.attributes?.widthInCm && (
          <InfoRow
            title={t("info.width")}
            value={`${work.attributes.widthInCm} cm`}
          />
        )}
        {work.attributes?.heightInCm && (
          <InfoRow
            title={t("info.height")}
            value={`${work.attributes.heightInCm} cm`}
          />
        )}
      </div>

      {/* 
        // IMAGES CONTAINER
      */}
      <div className="col-span-4 row-start-2 flex flex-col gap-4 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
        {work.attributes?.images.data.map((image) =>
          image.attributes?.url ? (
            <Image
              key={image.id}
              src={image.attributes?.url}
              width={720}
              height={720}
              alt={image.attributes?.alternativeText || ""}
              className="w-full"
            />
          ) : null,
        )}
      </div>
    </div>
  );
}

const InfoRow = ({
  title,
  value,
}: {
  title: React.ReactNode;
  value: React.ReactNode;
}) => (
  <dl className="grid grid-cols-5 gap-4 border-b border-light-color py-2 text-sm">
    <dt className="col-span-2 block">{title}</dt>
    <dd className="col-span-3 block font-medium">{value}</dd>
  </dl>
);
