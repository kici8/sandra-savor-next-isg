import { fetchData } from "@/graphql/fetchData";
import {
  WorksForWorkQuery,
  WorksForWorkStaticParamsQuery,
} from "@/graphql/generated/graphql";
import Image from "next/image";
import { notFound } from "next/navigation";
import { worksForWork, worksForWorkStaticParams } from "./queries";

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

  // full width layout with 12 columns and no container
  // use clamp to adjust size elements based on screen size
  // how to set uo the layout with 12 columns and no container in tailwindcss?
  // fast col generation https://www.tailwindgen.com/

  return (
    <div className="grid grid-cols-4 gap-4 px-4 lg:grid-cols-12 lg:grid-rows-[auto,1fr]">
      {/* 
        // INFO CONTAINER 
        // A sticky container that will always be on the left side of the screen
        // It will contain the title, the description and the details of the work
      */}
      <div className="col-span-4 col-start-1 row-start-1 lg:col-span-5">
        <h1 className="font-aujournuit mb-4 break-all text-8xl leading-none">
          {work.attributes?.title}
        </h1>
        <p className="text-sm lg:col-span-5">{work.attributes?.description}</p>
      </div>

      {/* INFO */}
      <div className="col-span-4 row-start-3 py-8 lg:col-span-5 lg:row-start-2">
        <div className="grid grid-cols-5 gap-4 border-b border-blue-900 py-2">
          <span className="col-span-3 text-sm font-medium">Informazioni</span>
        </div>
        {work.attributes?.dateOfCreation && (
          <InfoRow title="Anno" value={`${work.attributes.dateOfCreation}`} />
        )}
        {work.attributes?.widthInCm && (
          <InfoRow title="width" value={`${work.attributes.widthInCm} cm`} />
        )}
        {work.attributes?.heightInCm && (
          <InfoRow title="Height" value={`${work.attributes.heightInCm} cm`} />
        )}
      </div>

      {/* 
        // IMAGES CONTAINER
      */}
      <div className="col-span-4 row-start-2 flex flex-col gap-4 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
        {work.attributes?.images.data.map((image) =>
          image.attributes?.url ? (
            <Image
              key={image.id}
              src={image.attributes?.url}
              width={720}
              height={720}
              alt={image.attributes?.alternativeText || ""}
              className="w-full"
            />
          ) : null,
        )}
      </div>
    </div>
  );
}

const InfoRow = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="grid grid-cols-5 gap-4 border-b border-blue-900 py-2 text-sm">
    <span className="col-span-2">{title}:</span>
    <span className="col-span-3 font-medium">{value}</span>
  </div>
);
