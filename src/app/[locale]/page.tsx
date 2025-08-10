import { fetchData } from "@/graphql/fetchData";
import { graphql } from "@/graphql/generated/gql";
import { WorksForHomeQuery } from "@/graphql/generated/graphql";
import HomeScene from "./homeComponent/HomeScene";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const worksForHome = graphql(/* GraphQL */ `
  query worksForHome($locale: I18NLocaleCode) {
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

export default async function Home({
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
  const data: WorksForHomeQuery = await fetchData(worksForHome, { locale });

  // TODO:
  // Handle errors or loading states
  // If no works are found??
  if (!data || !data.works) {
    return <div className="text-center">No works found</div>;
  }

  return (
    <main className="absolute left-0 top-0 h-dvh w-full">
      <HomeScene works={data.works} />
    </main>
  );
}
