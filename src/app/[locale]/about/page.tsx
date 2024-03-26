import dynamic from "next/dynamic";

// Dynamic import
// Make sure to set ssr to false to prevent server-side rendering
// This is useful for components that rely on the window object
const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
});

// Page component
export default async function Page({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  return (
    <div className="relative h-screen bg-red-400">
      <Scene />
    </div>
  );
}
