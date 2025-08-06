import { fetchData } from "@/graphql/fetchData";
import { graphql } from "@/graphql/generated/gql";
import { WorksForHomeQuery } from "@/graphql/generated/graphql";
import HomeScene from "./homeComponent/HomeScene";
import { setStaticParamsLocale } from "next-international/server";

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
  setStaticParamsLocale(locale);

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
