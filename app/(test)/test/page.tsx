import HeroSection from "@/widgets/HeroSection";
import FeaturedPair from "@/widgets/FeaturedPair";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";
import CampaignBanner from "@/widgets/CampaignBanner";
import CampaignCollection from "@/widgets/CampaignCollection";
import CenterImage from "@/widgets/CenterImage";
import Navigation from "@/widgets/Navigation";
import Footer from "@/widgets/Footer";

const Page = () => {
  return (
    <>
      <HeroSection
        title1="HELLO."
        title2="NICE TO SEE YOU."
        body={{
          doc: {
            type: "doc" as StoryblokRichTextNodeTypes,
            content: [
              {
                type: "paragraph" as StoryblokRichTextNodeTypes,
                attrs: {
                  dir: "ltr",
                },
                content: [
                  {
                    text: "Unofficial is an invitation for self expression.",
                    // @ts-ignore
                    type: "text",
                  },
                ],
              },
            ],
          },
        }}
        visual={{
          desktop: {
            url: "/images/hero-section-image-d.png",
            alt: "Visual Image Type 1",
            type: "image",
          },
          mobile: {
            url: "/images/hero-section-image-m.png",
            alt: "Visual Image Type 1",
            type: "image",
          },
        }}
        link={{
          type: "anchor",
          href: "#",
          text: "DISCOVER STYLES",
        }}
        icon={{ url: "/icons/arrow-down.svg", alt: "Arrow down" }}
        isVideo={false}
      />
      <FeaturedPair
        swap={false}
        cards={[
          {
            image: {
              desktop: {
                url: "/images/featured-pair-1-d.png",
                alt: "Featured Pair 1",
              },
              mobile: {
                url: "/images/featured-pair-1-m.png",
                alt: "Featured Pair 1",
              },
            },
            icon: {
              url: "/icons/arrow-right.svg",
              alt: "Arrow right",
            },
            link: {
              url: "#",
              text: "OPTICS",
            },
            subtitle: "MEN",
            position: "left",
          },
          {
            image: {
              desktop: {
                url: "/images/featured-pair-2.png",
                alt: "Featured Pair 2",
              },
            },
            icon: {
              url: "/icons/arrow-right.svg",
              alt: "Arrow right",
            },
            link: {
              url: "#",
              text: "SUN",
            },
            subtitle: "MEN & WOMEN",
            position: "right",
          },
        ]}
      />
      <CenterImage
        image={{
          url: "/images/center-image.png",
          alt: "Center Image",
        }}
        link={{
          url: "#",
          text: "STYLE NAME",
        }}
        text="FOR WHO"
        icon={{ url: "/icons/arrow-right.svg", alt: "Arrow right" }}
      />
      <FeaturedPair
        swap
        cards={[
          {
            image: {
              desktop: {
                url: "/images/featured-pair-1-d.png",
                alt: "Featured Pair 1",
              },
              mobile: {
                url: "/images/featured-pair-1-m.png",
                alt: "Featured Pair 1",
              },
            },
            icon: {
              url: "/icons/arrow-right.svg",
              alt: "Arrow right",
            },
            link: {
              url: "#",
              text: "OPTICS",
            },
            subtitle: "MEN",
            position: "left",
          },
          {
            image: {
              desktop: {
                url: "/images/featured-pair-2.png",
                alt: "Featured Pair 2",
              },
            },
            icon: {
              url: "/icons/arrow-right.svg",
              alt: "Arrow right",
            },
            link: {
              url: "#",
              text: "SUN",
            },
            subtitle: "MEN & WOMEN",
            position: "right",
          },
        ]}
      />
      <CampaignBanner
        title="LATEST CAMPAIGN"
        body={{
          doc: {
            type: "doc" as StoryblokRichTextNodeTypes,
            content: [
              {
                type: "paragraph" as StoryblokRichTextNodeTypes,
                attrs: {
                  dir: "ltr",
                },
                content: [
                  {
                    text: "Unofficial is an invitation for self expression.",
                    // @ts-ignore
                    type: "text",
                  },
                ],
              },
            ],
          },
        }}
        image={{
          desktop: {
            url: "/images/campaign-banner-d.png",
            alt: "Campaign Banner Desktop",
          },
          mobile: {
            url: "/images/campaign-banner-m.png",
            alt: "Campaign Banner Mobile",
          },
        }}
        cta={{
          text: "VIEW CAMPAIGN",
          href: "#",
        }}
      />
      <CampaignCollection
        campaigns={[
          {
            image: {
              url: "/images/campaign-card-1.png",
              alt: "Campaign 1",
            },
            name: "CAMPAIGN 1",
            cta: {
              text: "DISCOVER MORE",
              href: "#",
            },
            icon: {
              url: "/icons/arrow-right.svg",
              alt: "Arrow right",
            },
          },
          {
            image: {
              url: "/images/campaign-card-2.png",
              alt: "Campaign 2",
            },
            name: "CAMPAIGN 2",
            cta: {
              text: "DISCOVER MORE",
              href: "#",
            },
            icon: {
              url: "/icons/arrow-right.svg",
              alt: "Arrow right",
            },
          },
          {
            image: {
              url: "/images/campaign-card-3.png",
              alt: "Campaign 3",
            },
            name: "CAMPAIGN 3",
            cta: {
              text: "DISCOVER MORE",
              href: "#",
            },
            icon: {
              url: "/icons/arrow-right.svg",
              alt: "Arrow right",
            },
          },
        ]}
      />
    </>
  );
};
export default Page;
