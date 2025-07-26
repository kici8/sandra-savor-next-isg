import { fetchData } from "@/graphql/fetchData";
import { graphql } from "@/graphql/generated/gql";
import { WorksForHomeQuery } from "@/graphql/generated/graphql";
import { filterFalsyValues } from "@/helper/filterFalsyValues";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Link from "next/link";
import HomeScene from "./homeComponent/HomeScene";

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
      <HomeScene imagesUrl={imagesUrl} />
      <div className="absolute left-12 top-1/2 flex -translate-y-1/2 transform flex-col gap-1">
        {data.works?.data.map((work) => (
          <Link
            key={work.id}
            className="hover:underline"
            href={`${locale}/works/${work.attributes?.slug}`}
          >
            <h2 className="text-sm font-bold">{work.attributes?.title}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
