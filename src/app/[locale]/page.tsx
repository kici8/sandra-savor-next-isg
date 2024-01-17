import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Link from "next/link";

async function getData(locale: string) {
  const res = await fetch(
    `https://strapi-production-027c9.up.railway.app/api/works?locale=${locale}`,
    {
      next: {
        // Use tags to invalidate cache with revalidateTag method
        tags: ["works"],
      },
    },
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  const data = await getData(locale);
  const t = await getTranslations();

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-5xl font-bold">{t("home.title")}</h1>
      {data.data.map((work: any) => (
        <Link
          key={work.id}
          className="flex flex-col py-3"
          href={`${locale}/works/${work.attributes.slug}`}
        >
          <h2 className="text-3xl font-bold">{work.attributes.title}</h2>
          <p className="text-xl">{work.attributes.description}</p>
        </Link>
      ))}
    </main>
  );
}
