import { fetchData } from "@/graphql/fetchData";
import { graphql } from "@/graphql/generated/gql";
import { WorksForHomeQuery } from "@/graphql/generated/graphql";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Link from "next/link";
import HomeScene from "./homeComponent/HomeScene";
import { url } from "inspector";
import { filterFalsyValues } from "@/helper/filterFalsyValues";

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

  console.log(data);
  const imagesUrl = filterFalsyValues(
    data.works?.data.map(
      (work) => work.attributes?.images.data[0].attributes?.formats.small.url,
    ) ?? [],
  );

  return (
    <main className="absolute left-0 top-0 h-dvh w-full">
      {/* <h1 className="text-5xl font-bold">{t("home.title")}</h1> */}
      {/* <p>Ciao!</p>
      <p>
        Sono Sandra, un'artista e illustratrice freelance con casa nelle
        vicinanze di Venezia.
      </p> */}

      {/* {data.works?.data.map((work) => (
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
        </Link>
      ))} */}
      <HomeScene imagesUrl={[...imagesUrl]} />
    </main>
  );
}
