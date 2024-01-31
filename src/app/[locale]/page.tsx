import ParallaxSurface from "@/components/ParallaxSurface";
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

  // Tailwind default breakpoints and container sizes
  // None	width: 100%;
  // sm (640px)	max-width: 640px;
  // md (768px)	max-width: 768px;
  // lg (1024px)	max-width: 1024px;
  // xl (1280px)	max-width: 1280px;
  // 2xl (1536px)	max-width: 1536px;

  // const getMaxVwWidthFromColumns = ({
  //   numberOfColumns,
  // }: {
  //   numberOfColumns: number;
  // }): string => {
  //   const viewPortWidth = 1440;
  //   const remRatio = 16;
  //   const columnWidth = 94;
  //   const gutterWidth = 24;
  //   const pxResult =
  //     numberOfColumns * columnWidth + (numberOfColumns + 1) * gutterWidth;
  //   const vwResult = (pxResult * 100) / viewPortWidth;
  //   const minResult = (pxResult * remRatio) / gutterWidth / remRatio;
  //   const result = `max(${Math.round(vwResult * 1000) / 1000}vw,${Math.round(minResult * 1000) / 1000}rem)`;
  //   return result;
  // };

  // for (let i = 0; i <= 12; i++) {
  //   console.log(
  //     `"vw-${i}":"${getMaxVwWidthFromColumns({ numberOfColumns: i })}",`,
  //   );
  // }

  return (
    <main className="overflow-x-hidden">
      <div className={`mx-vw-1 min-h-screen`}>
        <div className="gap-vw-1 pb-vw-2 pt-vw-1 grid grid-cols-[5fr,4fr]">
          <div className="w-full">
            <div className="relative w-full">
              <div className="aspect-[4/6] w-full">
                <ParallaxSurface
                  className="h-full w-full"
                  startPosition={-48}
                  endPosition={96}
                >
                  <picture className="block h-full w-full">
                    <img
                      src={
                        data.works?.data[2].attributes?.images.data[0]
                          .attributes?.url
                      }
                      alt=""
                      className="block h-full w-full object-cover"
                    />
                  </picture>
                </ParallaxSurface>
              </div>
              <div className="-left-vw-3 -bottom-vw-1 absolute aspect-[1] w-full">
                <ParallaxSurface
                  className="h-full w-full"
                  startPosition={0}
                  endPosition={-144}
                >
                  <picture className="block h-full w-full">
                    <img
                      src={
                        data.works?.data[1].attributes?.images.data[2]
                          .attributes?.url
                      }
                      alt=""
                      className="block h-full w-full object-cover"
                    />
                  </picture>
                </ParallaxSurface>
              </div>
            </div>
          </div>

          {/* TODO: fare classi tailwind per il testo in vw */}
          <div className="gap-vw-2 flex flex-col">
            <div className="min-h-vw-2 text-balance text-[max(1.389vw,1rem)]">
              <p>Ciao!</p>
              <p>
                Sono Sandra, un&apos;artista e illustratrice freelance con casa
                nelle vicinanze di Venezia.
              </p>
            </div>
            <div className="relative">
              <div className="w-vw-3 -mt-vw-0 aspect-[3/5]">
                <ParallaxSurface
                  className="h-full w-full"
                  startPosition={-48}
                  endPosition={0}
                >
                  <picture className="h-full w-full">
                    <img
                      src={
                        data.works?.data[1].attributes?.images.data[0]
                          .attributes?.url
                      }
                      alt=""
                      className="block h-full w-full object-cover"
                    />
                  </picture>
                </ParallaxSurface>
              </div>

              <div className="-right-vw-2 -top-vw-1 absolute aspect-[1] w-full">
                <ParallaxSurface
                  startPosition={0}
                  endPosition={-144}
                  className="h-full w-full"
                >
                  <picture className="h-full w-full">
                    <img
                      src={
                        data.works?.data[0].attributes?.images.data[0]
                          .attributes?.url
                      }
                      alt=""
                      className="block h-full w-full object-cover"
                    />
                  </picture>
                </ParallaxSurface>
              </div>
            </div>
          </div>
        </div>

        {data.works?.data.map((work) => (
          <Link
            key={work.id}
            className="flex flex-col py-3"
            href={`${locale}/works/${work.attributes?.slug}`}
          >
            <picture className="my-3 w-full">
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
        ))}
      </div>
    </main>
  );
}
