import { Nullable } from "./model/Nullable.interface";
import { INavigation } from "@/models/widgets/INavigation";
import { api } from "@/lib/api";
import { safeJsonParse } from "@/lib/utils";

type Story = {
  uuid: string;
  name?: string;
  slug?: string;
  content?: any;
};

const getStoriesByUuids = async (uuids: string[], lang: Language): Promise<Story[] | null> => {
  if (!uuids.length) return [];
  const { success, data } = await api.cms.stories({
    by_uuids_ordered: uuids.join(","),
    language: lang,
  });
  return success && Array.isArray(data) ? (data as Story[]) : null;
};

const itemUuids = (story: Story): string[] => {
  return Array.isArray(story?.content?.items) ? story.content.items.filter((x: any) => typeof x === "string") : [];
};

const hrefFromCode = (code: unknown): string => {
  if (typeof code !== "string" || !code.trim()) return "";
  return safeJsonParse(code)?.href || "";
};

type HeaderWidget = {
  contents?: Array<string | { uuid?: string }>;
  layout_variant?: Array<{ viewtype?: string }>;
};

const hasContent = (widget: HeaderWidget): boolean =>
  Array.isArray(widget?.contents) &&
  widget.contents.some(
    (x) =>
      (typeof x === "string" && x.trim().length > 0) ||
      (typeof x === "object" && typeof x?.uuid === "string" && x.uuid.trim().length > 0)
  );

const isNavigationWidget = (widget: HeaderWidget): boolean =>
  Array.isArray(widget?.layout_variant) ? widget.layout_variant.some((v) => v?.viewtype === "Navigation") : true;

const NavigationAdapter = async (widgets: any, lang: Language) => {
  const source: HeaderWidget[] = (Array.isArray(widgets) ? widgets : [widgets]).filter(
    (w): w is HeaderWidget => Boolean(w) && hasContent(w) && isNavigationWidget(w)
  );

  const topUuids = Array.from(
    new Set(
      source.flatMap((w) =>
        (w.contents ?? [])
          .map((x) => (typeof x === "string" ? x : x?.uuid))
          .filter((id): id is string => typeof id === "string" && id.length > 0)
      )
    )
  );

  if (!topUuids.length) return [];

  const topStories = await getStoriesByUuids(topUuids, lang);
  if (!topStories) return null;

  const navData = await Promise.all(
    topStories.map(async (top) => {
      const isProducts = top?.content?.collection_title === "Products";
      const isCollections = top?.content?.collection_title === "Collections";

      const secondStories = (await getStoriesByUuids(itemUuids(top), lang)) ?? [];

      // Batch-resolve teaser_targets target UUIDs for collections to get correct slugs
      const targetUuidMap = new Map<string, string>();
      if (isCollections) {
        const targetUuids = secondStories
          .map((s) => s?.content?.teaser_targets?.[0]?.target?.[0])
          .filter((id): id is string => typeof id === "string" && id.length > 0);
        const uniqueTargetUuids = [...new Set(targetUuids)];
        const targetStories = (await getStoriesByUuids(uniqueTargetUuids, lang)) ?? [];
        for (const story of targetStories) {
          if (story?.uuid && story?.slug) {
            targetUuidMap.set(story.uuid, story.slug);
          }
        }
      }

      const children = await Promise.all(
        secondStories.map(async (second) => {
          const thirdStories = (await getStoriesByUuids(itemUuids(second), lang)) ?? [];
          const teaserText = second?.content?.teaser_text;

          const hasValidTeaserText = typeof teaserText?.type === "string" && Array.isArray(teaserText?.content);

          const targetUuid = second?.content?.teaser_targets?.[0]?.target?.[0];
          const targetSlug = typeof targetUuid === "string" ? targetUuidMap.get(targetUuid) : undefined;

          return {
            header: isCollections
              ? second?.content?.teaser_title || second?.content?.collection_title || ""
              : second?.content?.collection_title || second?.content?.page_title || "",
            image: second?.content?.media?.[0]?.filename,
            ctaLabel: second?.content?.teaser_targets?.[0]?.target_text || undefined,
            ctaIcon: second?.content?.teaser_icon?.[0]?.filename || undefined,
            description: hasValidTeaserText
              ? {
                  doc: {
                    type: teaserText.type,
                    content: teaserText.content,
                  },
                }
              : undefined,
            href: isCollections
              ? (targetSlug ? `/collections/${targetSlug}` : (second?.slug ? `/collections/${second.slug}` : ""))
              : (second?.slug && !isProducts ? `/${second.slug}` : ""),
            children: thirdStories.length
              ? thirdStories.map((third) => ({
                  label: third?.content?.teaser_title || third?.name || "",
                  href: isProducts
                    ? hrefFromCode(third?.content?.local_settings?.code)
                    : isCollections ? `/collections/${third.slug}` :third?.slug
                      ? `/${third.slug}`
                      : "",
                }))
              : undefined,
          };
        })
      );

      return {
        label: top?.content?.collection_title || "",
        href: hrefFromCode(top?.content?.local_settings?.code),
        children: children.length ? children : undefined,
      };
    })
  );

  return navData;
};

export default NavigationAdapter;
