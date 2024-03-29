import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

// https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration
// Url example:
// https://<your-site.com>/api/revalidate?secret=<token>
// https://sandra-savor-next-isg.vercel.app/api/works?secret=1234

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const parsedRequest = await request.json();

  if (secret !== process.env.MY_SECRET_TOKEN) {
    return Response.json({ message: `Invalid token` }, { status: 400 });
  }

  // TODO: try to use tag
  if (parsedRequest.model === "work") {
    // revalidateTag("works");
    revalidatePath(`/${parsedRequest.entry.locale}`);
    revalidatePath(
      `/${parsedRequest.entry.locale}/works/${parsedRequest.entry.slug}`,
    );
  }

  return Response.json({ revalidated: true, now: Date.now() });
}

// This is an example of the payload (entry) I get from the webhook
// {
//     "event": "entry.update",
//     "createdAt": "2024-01-05T15:24:53.599Z",
//     "model": "work",
//     "uid": "api::work.work",
//     "entry": {
//       "id": 2,
//       "title": "Garden",
//       "createdAt": "2023-12-19T14:07:24.731Z",
//       "updatedAt": "2024-01-05T15:24:52.335Z",
//       "publishedAt": "2023-12-19T14:26:05.322Z",
//       "locale": "en",
//       "description": "Watercolor cycle on the theme of the garden. Green fronds set in fairy-tale images.",
//       "dateOfCreation": "2011-01-15",
//       "slug": "garden",
//       "widthInCm": null,
//       "heightInCm": null
//     }
//   }
