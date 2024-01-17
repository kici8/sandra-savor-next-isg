import { notFound } from "next/navigation";

// Generate static paths based on works slug
export async function generateStaticParams({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const works = await fetch(
    `https://strapi-production-027c9.up.railway.app/api/works?locale=${lang}`,
  ).then((res) => res.json());

  return works.data.map((work: any) => ({
    slug: work.attributes.slug,
  }));
}

// Generate static props
async function fetchWork({ slug, lang }: { slug: string; lang: string }) {
  const filteredWorks = await fetch(
    `https://strapi-production-027c9.up.railway.app/api/works?filters[slug][$eq]=${slug}&populate=images&locale=${lang}`,
  ).then((res) => res.json());
  return filteredWorks.data[0];
}

// Page component
export default async function Page({
  params,
}: {
  params: { slug: string; lang: string };
}) {
  // Data fetching
  const work = await fetchWork({ slug: params.slug, lang: params.lang });

  // 404 if no work found
  if (!work) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col p-24">
      <h1 className="text-3xl font-bold">{work.attributes.title}</h1>
      <p className="text-xl">{work.attributes.description}</p>
      {work.attributes.images.data.map((image: any) => (
        <picture key={image.id} className="width-100 my-3">
          <img
            src={image.attributes.formats.large.url}
            alt={image.attributes.alternativeText}
          />
        </picture>
      ))}
    </div>
  );
}
