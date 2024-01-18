import { fetchData } from "@/graphql/fetchData";
import { notFound } from "next/navigation";
import { worksForWork, worksForWorkStaticParams } from "./queries";
import {
  WorksForWorkQuery,
  WorksForWorkStaticParamsQuery,
} from "@/graphql/generated/graphql";

// Generate static paths based on works slug
export async function generateStaticParams({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const data: WorksForWorkStaticParamsQuery = await fetchData(
    worksForWorkStaticParams,
    { locale },
  );
  const staticParams = data.works?.data.map((work: any) => ({
    slug: work.attributes.slug,
  }));
  return staticParams ?? [];
}

// Page component
export default async function Page({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  // Data fetching
  const data: WorksForWorkQuery = await fetchData(worksForWork, {
    slug: params.slug,
    locale: params.locale,
  });

  const work = data.works?.data[0];

  // 404 if no work found
  if (!work) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col p-24">
      <h1 className="text-3xl font-bold">{work.attributes?.title}</h1>
      <p className="text-xl">{work.attributes?.description}</p>
      {work.attributes?.images.data.map((image) => (
        <picture key={image.id} className="width-100 my-3">
          <img
            src={image.attributes?.url}
            alt={image.attributes?.alternativeText ?? ""}
          />
        </picture>
      ))}
    </div>
  );
}
