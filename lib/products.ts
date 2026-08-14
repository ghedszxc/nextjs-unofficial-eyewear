import { productCatalogs } from "@/constants/productPrefixQuery";
import handleError from "@/lib/handlers/error";
import { getStoryblokApi, refreshCacheIfStale, toStoryblokRequestError } from "@/lib/storyblok";
import { StoryblokClient } from "@storyblok/react/rsc";

/**
 * Fetches a product and its variants directly from Storyblok.
 *
 * Used by both the PDP page render and the /api/fetchProduct route. The page
 * calls this directly instead of fetching its own API over HTTP — the old
 * loopback went out through the public domain (CloudFront) and back into the
 * same cluster, which added latency and timed out under load.
 */
export const getProductVariants = async (lang: Language, id: string): Promise<ActionResponse<any>> => {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT as string;
  const mode = process.env.NEXT_PUBLIC_MODE as "preview" | "public";
  const productNameSegment = productCatalogs[0]?.productNameSegment;

  try {
    const storyblokApi: StoryblokClient = getStoryblokApi!();
    await refreshCacheIfStale();

    const version = mode === "preview" ? "draft" : "published";

    const { data } = await storyblokApi.getStories({
      content_type: "product",
      by_slugs: `grandvision/unofficial/${env}/${lang}/${productNameSegment}/${id.split("-")[0]}-*`,
      version,
    });

    const isVariantExisting = data?.stories?.find((story) => story?.name === id.replace("-", " ").toUpperCase());

    return { success: true, data: !isVariantExisting ? [] : data };
  } catch (error) {
    return handleError(toStoryblokRequestError(error)) as ErrorResponse;
  }
};
