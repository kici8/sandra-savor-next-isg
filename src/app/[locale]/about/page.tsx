// Page component
export default async function Page({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div className="flex max-w-96 flex-col items-center gap-2">
        <h1 className="text-center text-xl font-bold">Che bello incontrarsi</h1>
        <p className="text-center text-sm">
          {params.locale === "it"
            ? "Sono Sandra, un'artista e illustratrice con casa nelle vicinanze di Venezia. Creo immagini e storie con acquerello e collage."
            : "I’m Sandra, illustrator and visual artist from Venice. I create quiet and vibrant stories with watercolor and collage."}
        </p>
      </div>
    </div>
  );
}
