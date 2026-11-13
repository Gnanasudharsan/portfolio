import { NextResponse, type NextRequest } from "next/server";
import { PROJECT_SLUGS } from "@/data/project-slugs";

const known = new Set<string>(PROJECT_SLUGS);

/** Unknown case-study slugs get a real 404 status instead of a streamed soft 404. */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !known.has(slug)) {
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/work/:slug",
};
