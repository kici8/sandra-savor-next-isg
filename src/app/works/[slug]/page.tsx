import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const works = await fetch(
    "https://strapi-production-027c9.up.railway.app/api/works"
  ).then((res) => res.json());

  // TODO: add
  return works.data.map((work: any) => ({
    slug: work.attributes.slug,
  }));
}

async function fetchWork(slug: string) {
  const filteredWorks = await fetch(
    `https://strapi-production-027c9.up.railway.app/api/works?filters[slug][$eq]=${slug}&populate=images`
  ).then((res) => res.json());
  return filteredWorks.data[0];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const work = await fetchWork(params.slug);

  if (!work) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col p-24">
      <h1 className="text-3xl font-bold">{work.attributes.title}</h1>
      <p className="text-xl">{work.attributes.description}</p>
      {work.attributes.images.data.map((image: any) => (
        <picture key={image.id} className="my-3 width-100">
          <img
            src={image.attributes.formats.large.url}
            alt={image.attributes.alternativeText}
          />
        </picture>
      ))}
    </div>
  );
}
