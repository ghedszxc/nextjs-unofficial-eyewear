import { getStoryblokRoot } from "@/constants/storyblok";
import handleError from "@/lib/handlers/error";
import { requestStoryblokCacheFlush } from "@/lib/storyblok";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import StoryblokClient from "storyblok-js-client";

// Helper function to check if content type should trigger direct revalidation
const isRevalidatable = (type: string | undefined) => {
  return ["page", "category", "product"].includes(type || "");
};

export async function GET(req: NextRequest) {
  const story_id = Number(req.nextUrl.searchParams.get("story_id"));

  if (!story_id) return handleError(new Error("story_id is required"), "api") as APIErrorResponse;

  const PERSONAL_ACCESS_TOKEN = process.env.STORYBLOK_MANAGEMENT_API_ACCESS_TOKEN;
  const SPACE_ID = process.env.SPACE_ID;
  const Storyblok = new StoryblokClient({ oauthToken: PERSONAL_ACCESS_TOKEN });

  const fetchStory = async (id: any) => {
    const { data } = await Storyblok.get(`spaces/${SPACE_ID}/stories/`, {
      version: "published",
      by_ids: id,
    });
    return data?.stories[0];
  };

  const fetchLinkedStories = async (uuid: string) => {
    // @ts-expect-error
    const { data } = await Storyblok.get(`spaces/${SPACE_ID}/stories/`, {
      reference_search: uuid,
      version: "published",
    });
    // @ts-expect-error
    return data?.stories;
  };

  const findReferencingPages = async (uuid: string) => {
    const visited = new Set<string>();
    const pages = new Map<string, any>();

    const traverse = async (uuid: string) => {
      const refs = await fetchLinkedStories(uuid);
      for (const ref of refs) {
        const content_type = ref?.content_type;
        const refId = ref?.uuid;

        if (visited.has(refId)) continue;
        visited.add(refId);

        if (isRevalidatable(content_type)) {
          pages.set(refId, ref);
        } else {
          await traverse(refId);
        }
      }
    };

    await traverse(uuid);
    return Array.from(pages.values());
  };

  try {
    // A publish changes the space cache version (cv). Await the flush BEFORE
    // revalidating tags — otherwise the re-rendered page fetches under the
    // old cv and re-caches stale content for the full revalidate window.
    await requestStoryblokCacheFlush();

    const story = await fetchStory(story_id);

    if (isRevalidatable(story?.content_type)) {
      // Revalidate the story directly
      revalidateTag(`${story?.full_slug?.replace(getStoryblokRoot(), "")}`);
      return NextResponse.json({
        message: "Pages revalidated",
        count: 1,
        page: `${story?.full_slug?.replace(getStoryblokRoot(), "")}`,
        revalidatedAt: new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" }),
      });
    } else {
      // Revalidate all pages that reference this story
      const pages = await findReferencingPages(story?.uuid);
      pages.forEach((page) => {
        revalidateTag(`${page?.full_slug?.replace(getStoryblokRoot(), "")}`);
      });

      const formattedPages = pages.map((page) => ({
        id: page?.uuid,
        title: page?.name,
        full_slug: `${page?.full_slug?.replace(getStoryblokRoot(), "")}`,
        revalidatedAt: new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" }),
      }));

      return NextResponse.json({
        message: "Pages revalidated",
        count: formattedPages.length,
        pages: formattedPages,
      });
    }
  } catch (err) {
    return NextResponse.json({ message: "Revalidation failed", error: err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { story_id } = await req.json();

  const PERSONAL_ACCESS_TOKEN = process.env.STORYBLOK_MANAGEMENT_API_ACCESS_TOKEN;
  const SPACE_ID = process.env.SPACE_ID;
  const Storyblok = new StoryblokClient({ oauthToken: PERSONAL_ACCESS_TOKEN });

  const fetchStory = async (id: any) => {
    const { data } = await Storyblok.get(`spaces/${SPACE_ID}/stories/`, {
      version: "published",
      by_ids: id,
    });
    return data?.stories[0];
  };

  const fetchLinkedStories = async (uuid: string) => {
    // @ts-expect-error
    const { data } = await Storyblok.get(`spaces/${SPACE_ID}/stories/`, {
      reference_search: uuid,
      version: "published",
    });
    // @ts-expect-error
    return data?.stories;
  };

  const findReferencingPages = async (uuid: string) => {
    const visited = new Set<string>();
    const pages = new Map<string, any>();

    const traverse = async (uuid: string) => {
      const refs = await fetchLinkedStories(uuid);
      for (const ref of refs) {
        const content_type = ref?.content_type;
        const refId = ref?.uuid;

        if (visited.has(refId)) continue;
        visited.add(refId);

        if (isRevalidatable(content_type)) {
          pages.set(refId, ref);
        } else {
          await traverse(refId);
        }
      }
    };

    await traverse(uuid);
    return Array.from(pages.values());
  };

  try {
    // A publish changes the space cache version (cv). Await the flush BEFORE
    // revalidating tags — otherwise the re-rendered page fetches under the
    // old cv and re-caches stale content for the full revalidate window.
    await requestStoryblokCacheFlush();

    const story = await fetchStory(story_id);

    if (isRevalidatable(story?.content_type)) {
      revalidateTag(`${story?.full_slug?.replace(getStoryblokRoot(), "")}`);
      return NextResponse.json({
        message: "Pages revalidated",
        count: 1,
        page: `${story?.full_slug?.replace(getStoryblokRoot(), "")}`,
        revalidatedAt: new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" }),
      });
    } else {
      const pages = await findReferencingPages(story?.uuid);
      pages.forEach((page) => {
        revalidateTag(`${page?.full_slug?.replace(getStoryblokRoot(), "")}`);
      });

      const formattedPages = pages.map((page) => ({
        id: page?.uuid,
        title: page?.name,
        full_slug: `${page?.full_slug?.replace(getStoryblokRoot(), "")}`,
        revalidatedAt: new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" }),
      }));

      return NextResponse.json({
        message: "Pages revalidated",
        count: formattedPages.length,
        pages: formattedPages,
      });
    }
  } catch (err) {
    return NextResponse.json({ message: "Revalidation failed", error: err }, { status: 500 });
  }
}
