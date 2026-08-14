import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IFooter } from "@/models/widgets/IFooter";
import { api } from "@/lib/api";
import { safeJsonParse } from "@/lib/utils";

const getStoriesByUuids = async (uuids: string[], lang: Language): Promise<any[] | null> => {
  if (!uuids.length) return [];
  const { success, data } = await api.cms.stories({
    by_uuids_ordered: uuids.join(","),
    language: lang,
  });

  return success && Array.isArray(data) ? data : null;
};

const findPlacement = (widgets: any[], componentName: string) =>
  widgets?.find((w: any) => w?.component === componentName);

export class FooterAdapter extends Adapter<any[], Promise<Nullable<IFooter>>> {
  adapt = async (source: any[], lang?: Language): Promise<Nullable<IFooter>> => {
    if (!Array.isArray(source) || source.length === 0) return null;

    // --- Tagline (from footer_newsletter or similar placement) ---
    const newsletterWidget = findPlacement(source, "footer_newsletter");
    const tagline =
      newsletterWidget?.contents?.[0]?.content?.teaser_title1 ||
      "UNOFFICIAL IS AN EYEWEAR BRAND THAT BELIEVES IN \nEMBRACING EVERY SIDE OF YOURSELF. \nTHE UNEXPECTED YOU.";

    // --- Social ---
    const newsletterOverlay = findPlacement(source, "footer_newsletter_overlay");
    const socialContent = newsletterOverlay?.contents?.[0]?.content ?? {};
    const socialSettings = safeJsonParse(socialContent?.local_settings?.code);

    const social = {
      icon: socialSettings?.icon || "/icons/instagram.svg",
      title: socialSettings?.title || "STAY IN TOUCH",
      hashtag: socialSettings?.hashtag || "#REFRAMETHEORDINARY",
      href: socialSettings?.href || "https://www.instagram.com/unofficial.eyewear/",
    };

    // --- Navigation Links ---
    const navWidget = findPlacement(source, "footer_navigation");
    const navUuids: string[] = (navWidget?.contents?.[0]?.content?.items ?? [])
      .map((c: any) => c)
      .filter((id: unknown): id is string => typeof id === "string" && id.length > 0);

    const navStories = await getStoriesByUuids(navUuids, lang!);
    const navigationLinks = (navStories ?? []).map((story: any) => ({
      text: story?.content?.teaser_title || story?.name || "",
      href: story?.content?.url || "",
      isExternal: story?.content?.open_in_new_tab || false,
    }));

    // --- Copyright ---
    const copyrightWidget = findPlacement(source, "footer_copyright");
    const copyrightContent = copyrightWidget?.contents?.[0]?.content ?? {};
    const copyright =
      copyrightContent?.teaser_title1 ||
      "Copyright ⓒ 2026 GrandVision Retail Holding B.V. All rights reserved.\nUNOFFICIAL and the UNOFFICIAL logo are registered trademarks of GrandVision Retail Holding B.V.";
    // --- Logo ---
    const logo = {
      src: "/icons/unf-logo-footer-d.svg",
      alt: "Unofficial Logo",
    };

    return {
      tagline,
      social,
      navigationLinks,
      copyright,
      logo,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
