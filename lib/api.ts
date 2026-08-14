import { fetchHandler } from "@/lib/handlers/fetch";
import { defaultLocale } from "@/constants/locales";
import { getBaseUrl, getBaseUrlForServer, getPath } from "@/lib/utils";
import { getStories, getStory } from "@/lib/storyblok";
import { PLACEMENTS_MAIN, PLACEMENTS_FOOTER } from "@/constants/storyblok";
import { getProductVariants } from "./products";

// Use getBaseUrlForServer for server-side API calls (requires absolute URL)
const API_BASE_URL = `${getBaseUrlForServer()}/api` || "http://localhost:3000/api";

export const api = {
  cms: {
    navigation: (lang: Language) => fetchHandler(`${API_BASE_URL}/cms/navigation?lang=${lang || defaultLocale}`),

    page: async (lang: Language, route?: string[], relations?: string[]) => {
      const path = getPath(lang, route);
      const { success, data, status } = await getStory(
        path,
        lang,
        [...PLACEMENTS_MAIN, ...PLACEMENTS_FOOTER].map((placement) => `${placement}.contents`),
        [`/${path}`]
      );
      return { success, data, status };
    },

    stories: async ({
      language,
      by_uuids_ordered,
      content_type,
      by_slugs,
      starts_with,
      with_tag,
      page,
      per_page,
      relations,
    }: FetchStoriesParams) => {
      const { success, data, status } = await getStories({
        language: language,
        by_uuids_ordered,
        content_type,
        by_slugs,
        starts_with,
        with_tag,
        page,
        per_page,
        relations,
      });
      return { success, data, status };
    },

    footer: (lang: Language) => fetchHandler(`${API_BASE_URL}/cms/footer?lang=${lang || defaultLocale}`),

    resolve_relations: (slug: string, relations: string) =>
      fetchHandler(`${API_BASE_URL}/cms/resolve-relations?slug=${slug}&relations=${relations}`),

     // Direct Storyblok query — no HTTP loopback through the public domain/CDN
    product: (lang: Language, id: string) => getProductVariants(lang || defaultLocale, id),
  },
};
