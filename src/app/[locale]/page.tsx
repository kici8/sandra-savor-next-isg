import { fetchData } from "@/graphql/fetchData";
import { graphql } from "@/graphql/generated/gql";
import { WorksForHomeQuery } from "@/graphql/generated/graphql";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Link from "next/link";
import HomeScene from "./homeComponent/HomeScene";
import { use, useEffect } from "react";

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
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  // const data = await getData(locale);
  const data: WorksForHomeQuery = await fetchData(worksForHome, { locale });
  const t = await getTranslations();

  return (
    <main className="absolute left-0 top-0 h-dvh w-full">
      <HomeScene works={data.works} />
    </main>
  );
}
