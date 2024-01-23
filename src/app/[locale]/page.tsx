import { fetchData } from "@/graphql/fetchData";
import { graphql } from "@/graphql/generated/gql";
import { WorksForHomeQuery } from "@/graphql/generated/graphql";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Link from "next/link";

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
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-5xl font-bold">{t("home.title")}</h1>
      {data.works?.data.map((work) => (
        <Link
          key={work.id}
          className="flex flex-col py-3"
          href={`${locale}/works/${work.attributes?.slug}`}
        >
          <picture className="width-100 my-3">
            <img
              src={work.attributes?.images.data[0].attributes?.url}
              alt={
                work.attributes?.images.data[0].attributes?.alternativeText ??
                ""
              }
            />
          </picture>
          <h2 className="text-center text-6xl font-bold">
            {work.attributes?.title}
          </h2>
          {/* <p className="text-xl">{work.attributes?.description}</p> */}
        </Link>
      ))}
    </main>
  );
}
