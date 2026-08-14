import { Factory } from "./Factory";
import { Nullable } from "@/adapter/model/Nullable.interface";
import { IAdapter } from "@/adapter/model/Adapter";
import { CategoryBannerAdapter } from "@/adapter/CategoryBanner";
import { FAQAdapter } from "@/adapter/FAQ";
import { ProductGridAdapter } from "@/adapter/ProductGrid";
import { HomeHeroBannerAdapter } from "@/adapter/HomeHeroBanner";
import { HomeCenteredTextAdapter } from "@/adapter/HomeCenteredText";
import { HomeSocialBannerAdapter } from "@/adapter/HomeSocialBanner";
import { HomeWTBAdapter } from "@/adapter/HomeWTB";
import { AboutHeroBannerAdapter } from "@/adapter/AboutHeroBanner";
import { AboutInfoAdapter } from "@/adapter/AboutInfo";
import { StoreLocatorAdapter } from "@/adapter/StoreLocator";
import { HeroSectionAdapter } from "@/adapter/HeroSection";
import { FeaturedPairAdapter } from "@/adapter/FeaturedPair";
import { CenterImageAdapter } from "@/adapter/CenterImage";
import { CampaignBannerAdapter } from "@/adapter/CampaignBanner";
import { CampaignCollectionAdapter } from "@/adapter/CampaignCollection";
import { GenericHeaderBannerAdapter } from "@/adapter/GenericHeaderBanner";
import { ThreeColumnSectionAdapter } from "@/adapter/ThreeColumnSection";
import { FooterAdapter } from "@/adapter/Footer";
import { FaqBannerAdapter } from "@/adapter/FaqBanner";
import { FaqTabAdapter } from "@/adapter/FaqTab";
import { FaqAccordionAdapter } from "@/adapter/FaqAccordion";
import { SectionHeaderAdapter } from "@/adapter/SectionHeader";
import { CenteredBannerAdapter } from "@/adapter/CenteredBanner";
import { TwoColumnImageAdapter } from "@/adapter/TwoColumnImage";
import { ProductSuggestionAdapter } from "@/adapter/ProductSuggestion";
import { BannerCareTipsAdapter } from "@/adapter/BannerCareTips";
import { TabCareTipsAdapter } from "@/adapter/TabCareTips";
import { StoreListAdapter } from "@/adapter/StoreList";
import { CardSliderAdapter } from "@/adapter/CardSlider";
import { TwoColumnSectionAdapter } from "@/adapter/TwoColumnSection";
import { TwoColumnTextAndMediaAdapter } from "@/adapter/TwoColumnTextAndMedia";
import { TwoColumnTextAdapter } from "@/adapter/TwoColumnText";
import { ProductPillSliderAdapter } from "@/adapter/ProductPillSlider";

// Adapters
export class WidgetParamAdapterFactory extends Factory<string, Nullable<IAdapter>> {
  instance: (comparator: string) => Nullable<IAdapter> = (comparator) => {
    switch (comparator) {
      case "CategoryBanner":
        return new CategoryBannerAdapter();
      case "ProductGrid":
        return new ProductGridAdapter();
      case "FAQ":
        return new FAQAdapter();
      case "HomeHeroBanner":
        return new HomeHeroBannerAdapter();
      case "HomeCenteredText":
        return new HomeCenteredTextAdapter();
      case "HomeSocialBanner":
        return new HomeSocialBannerAdapter();
      case "HomeWTB":
        return new HomeWTBAdapter();
      case "AboutHeroBanner":
        return new AboutHeroBannerAdapter();
      case "AboutInfo":
        return new AboutInfoAdapter();
      case "StoreLocator":
        return new StoreLocatorAdapter();
      case "HeroSection":
        return new HeroSectionAdapter();
      case "FeaturedPair":
        return new FeaturedPairAdapter();
      case "CenterImage":
        return new CenterImageAdapter();
      case "CampaignBanner":
        return new CampaignBannerAdapter();
      case "CampaignCollection":
        return new CampaignCollectionAdapter();
      case "GenericHeaderBanner":
        return new GenericHeaderBannerAdapter();
      case "ThreeColumnSection":
        return new ThreeColumnSectionAdapter();
      case "Footer":
        return new FooterAdapter();
      case "FaqBanner":
        return new FaqBannerAdapter();
      case "FaqTab":
        return new FaqTabAdapter();
      case "FaqAccordion":
        return new FaqAccordionAdapter();
      case "SectionHeader":
        return new SectionHeaderAdapter();
      case "CenteredBanner":
        return new CenteredBannerAdapter();
      case "TwoColumnImage":
        return new TwoColumnImageAdapter();
      case "ProductSuggestion":
        return new ProductSuggestionAdapter();
      case "BannerCareTips":
        return new BannerCareTipsAdapter();
      case "TabCareTips":
        return new TabCareTipsAdapter();
      case "StoreList":
        return new StoreListAdapter();
      case "CardSlider":
        return new CardSliderAdapter();
      case "TwoColumnSection":
        return new TwoColumnSectionAdapter();
      case "TwoColumnTextAndMedia":
        return new TwoColumnTextAndMediaAdapter();
      case "TwoColumnText":
        return new TwoColumnTextAdapter();
      case "ProductPillSlider":
        return new ProductPillSliderAdapter();
      default:
        return null;
    }
  };
}
