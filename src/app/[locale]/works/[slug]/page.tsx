import { fetchData } from "@/graphql/fetchData";
import {
  WorksForWorkQuery,
  WorksForWorkStaticParamsQuery,
} from "@/graphql/generated/graphql";
import Image from "next/image";
import { notFound } from "next/navigation";
import { worksForWork, worksForWorkStaticParams } from "./queries";
import { setStaticParamsLocale } from "next-international/server";
import { getStaticParams } from "../../../../../locales/server";

// Genera tutti i parametri statici per ogni locale e ogni work
export async function generateStaticParams() {
  const locales = getStaticParams();
  const allParams: { locale: string; slug: string }[] = [];

  for (const { locale } of locales) {
    const data = await fetchData(worksForWorkStaticParams, { locale });
    if (data?.works?.data) {
      data.works.data.forEach((work: any) => {
        allParams.push({ locale, slug: work.attributes.slug });
      });
    }
  }

  return allParams;
}

// Page component
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  // Data fetching
  const { slug, locale } = await params;
  setStaticParamsLocale(locale);

  const data: WorksForWorkQuery = await fetchData(worksForWork, {
    slug: slug,
    locale: locale,
  });

  // 404 if no work found
  if (!data || !data.works || data.works?.data.length === 0) {
    notFound();
  }

  const work = data.works?.data[0];

  const year = work.attributes?.dateOfCreation
    ? new Date(work.attributes.dateOfCreation).getFullYear()
    : undefined;

  // full width layout with 12 columns and a container for > 2560px screens
  // fast col generation https://www.tailwindgen.com/

  return (
    <div className="mx-auto grid max-w-container2560 grid-cols-4 gap-4 px-4 lg:grid-cols-12 lg:grid-rows-[auto,1fr]">
      {/* 
        // TODO: rewrite the layout to use sticky positioning for title and info
        // TITLE AND DESCRIPTION
      */}
      <div className="col-span-4 col-start-1 row-start-1 lg:col-span-5">
        <h1 className="mb-4 break-all font-aujournuit text-8xl leading-none">
          {work.attributes?.title}
        </h1>
        <p className="text-sm lg:col-span-5">{work.attributes?.description}</p>
      </div>

      {/* INFO */}
      <div className="col-span-4 row-start-3 py-8 lg:col-span-5 lg:row-start-2">
        <div className="grid grid-cols-5 gap-4 border-b border-blue-900 py-2">
          <span className="col-span-3 text-sm font-medium">Informazioni</span>
        </div>
        {year && <InfoRow title="Anno" value={year} />}
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
