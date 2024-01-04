import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

// https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration
// Url example:
// https://<your-site.com>/api/revalidate?secret=<token>
// https://sandra-savor-next-isg.vercel.app/works/api?secret=1234

export async function POST(request: NextRequest) {
  // TODO: with params I can get the path for the single work
  // TODO: how to handle the translation?
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.MY_SECRET_TOKEN) {
    return Response.json({ message: `Invalid token` }, { status: 400 });
  }

  // TODO: Path or Tag
  revalidatePath("/");
  return Response.json({ revalidated: true, now: Date.now() });

  //   // Check for secret to confirm this is a valid request
  //   if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
  //     return res.status(401).json({ message: "Invalid token" });
  //   }
  //   try {
  //     // this should be the actual path not a rewritten path
  //     // e.g. for "/blog/[slug]" this should be "/blog/post-1"
  //     await res.revalidate("/");
  //     return res.json({ revalidated: true });
  //   } catch (err) {
  //     // If there was an error, Next.js will continue
  //     // to show the last successfully generated page
  //     return res.status(500).send("Error revalidating");
  //   }
}
