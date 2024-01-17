import Link from "next/link";
import { useTranslation } from "../i18n";

async function getData(lang: string) {
  const res = await fetch(
    `https://strapi-production-027c9.up.railway.app/api/works?locale=${lang}`,
    {
      next: {
        // Use tags to invalidate cache with revalidateTag method
        tags: ["works"],
      },
    },
  );

  // if (!res.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   throw new Error("Failed to fetch data");
  // }
  if (!res.ok) {
    return undefined;
  }

  return res.json();
}

export default async function Home({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const data = await getData(lang);
  const { t } = await useTranslation(lang, "home");

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-5xl font-bold">{t("home:title")}</h1>
      <p className="text-3xl">{t("home:description")}</p>
      {data.data.map((work: any) => (
        <Link
          key={work.id}
          className="flex flex-col py-3"
          href={`${lang}/works/${work.attributes.slug}`}
        >
          <h2 className="text-3xl font-bold">{work.attributes.title}</h2>
          <p className="text-xl">{work.attributes.description}</p>
        </Link>
      ))}
    </main>
  );
}
