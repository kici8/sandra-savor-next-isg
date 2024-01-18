import { gql } from "@/__generated__";
import { getClient } from "@/lib/client";
import {
  useQuery,
  useSuspenseQuery,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { notFound } from "next/navigation";

// Generate static paths based on works slug
export async function generateStaticParams({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const works = await fetch(
    `https://strapi-production-027c9.up.railway.app/api/works?locale=${locale}`,
  ).then((res) => res.json());

  return works.data.map((work: any) => ({
    slug: work.attributes.slug,
  }));
}

// QUERY
const GET_WORK = gql(`
  query GetWork() {
    works(filters: {
      slug: {
        eq: "garden"
      }, locale: "en"
    }) 
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
            }
          }
        }
      }
    }


  }

`);

// query {
//   works(filters: { slug: { eq: "garden" } }, locale: "en") {
//     data {
//       id
//       attributes {
//         slug
//         title
//         description
//         images {
//           data {
//             id
//             attributes {
//               url
//               previewUrl
//             }
//           }
//         }
//       }
//     }
//   }
// }

// Generate static props
// async function fetchWork({ slug, locale }: { slug: string; locale: string }) {
//   const filteredWorks = await fetch(
//     `https://strapi-production-027c9.up.railway.app/api/works?filters[slug][$eq]=${slug}&populate=images&locale=${locale}`,
//   ).then((res) => res.json());
//   return filteredWorks.data[0];
// }

// Page component
export default async function Page({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  // Data fetching
  // const work = await fetchWork({ slug: params.slug, locale: params.locale });
  const { data } = await getClient().query({
    query: GET_WORK,
    variables: { slug: params.slug },
  });

  console.log(data.works.data[0]);

  const work = data.works.data[0];
  // 404 if no work found
  if (!work) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col p-24">
      <h1 className="text-3xl font-bold">{work.attributes.title}</h1>
      <p className="text-xl">{work.attributes.description}</p>
      {/* {work.attributes.images.data.map((image: any) => (
        <picture key={image.id} className="width-100 my-3">
          <img
            src={image.attributes.formats.large.url}
            alt={image.attributes.alternativeText}
          />
        </picture>
      ))} */}
    </div>
  );
}
