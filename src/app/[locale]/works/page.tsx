import { fetchData } from "@/graphql/fetchData";
import { graphql } from "@/graphql/generated/gql";
import { WorksForWorksQuery } from "@/graphql/generated/graphql";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const worksForWorks = graphql(/* GraphQL */ `
  query worksForWorks($locale: I18NLocaleCode) {
    works(locale: $locale) {
      data {
        id
        attributes {
          slug
          title
          description
          images {
            data {
              id
              attributes {
                url
                previewUrl
                alternativeText
                formats
              }
            }
          }
        }
      }
    }
  }
`);

export async function generateMetadata({
  params,
}: {
  params: { locale: "en" | "it" };
}): Promise<Metadata> {
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "works.metadata" });

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

export default async function Work({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  // const data = await getData(locale);
  const data: WorksForWorksQuery = await fetchData(worksForWorks, {
    locale,
  });

  if (!locale) {
    return (
      <div className="text-center text-red-500">Locale not found: {locale}</div>
    );
  }

  // TODO:
  // Handle errors or loading states
  // If no works are found??
  if (!data || !data.works) {
    return <div className="text-center">No works found</div>;
  }

  return (
    <div className="mx-auto grid max-w-container2560 grid-cols-4 gap-4 px-4 lg:grid-cols-12">
      {data.works.data.map((work) => {
        const image = work.attributes?.images.data[0]?.attributes;
        if (!image || !work.attributes?.slug) return null;
        return (
          <Link
            href={`/${locale}/works/${work.attributes.slug}`}
            key={work.id}
            className="col-span-2 aspect-[3/4]"
          >
            <Image
              key={work.id}
              src={image.url}
              alt={image.alternativeText || work.attributes.title || ""}
              width={320}
              height={320}
              className="h-full w-full object-cover"
            />
          </Link>
        );
      })}
    </div>
  );
}
