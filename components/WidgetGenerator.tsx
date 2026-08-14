import dynamic from "next/dynamic";
import { IWidgetModel } from "@/adapter/model/IWidget";
import { WidgetParamAdapterFactory } from "@/factory/WidgetParamAdapterFactory";
import React from "react";

const Widgets = {
  CategoryBanner: dynamic(() => import("@/widgets/CategoryBanner")),
  ProductGrid: dynamic(() => import("@/widgets/ProductGrid")),
  FAQ: dynamic(() => import("@/widgets/FAQ")),
  HomeHeroBanner: dynamic(() => import("@/widgets/HomeHeroBanner")),
  HomeCenteredText: dynamic(() => import("@/widgets/HomeCenteredText")),
  HomeSocialBanner: dynamic(() => import("@/widgets/HomeSocialBanner")),
  HomeWTB: dynamic(() => import("@/widgets/HomeWTB")),
  AboutHeroBanner: dynamic(() => import("@/widgets/AboutHeroBanner")),
  AboutInfo: dynamic(() => import("@/widgets/AboutInfo")),
  StoreLocator: dynamic(() => import("@/widgets/StoreLocator")),
  HeroSection: dynamic(() => import("@/widgets/HeroSection")),
  FeaturedPair: dynamic(() => import("@/widgets/FeaturedPair")),
  CenterImage: dynamic(() => import("@/widgets/CenterImage")),
  CampaignBanner: dynamic(() => import("@/widgets/CampaignBanner")),
  CampaignCollection: dynamic(() => import("@/widgets/CampaignCollection")),
  FaqBanner: dynamic(() => import("@/widgets/FaqBanner")),
  FaqTab: dynamic(() => import("@/widgets/FaqTab")),
  FaqAccordion: dynamic(() => import("@/widgets/FaqAccordion")),
  SectionHeader: dynamic(() => import("@/widgets/SectionHeader")),
  CenteredBanner: dynamic(() => import("@/widgets/CenteredBanner")),
  TwoColumnImage: dynamic(() => import("@/widgets/TwoColumnImage")),
  ProductSuggestion: dynamic(() => import("@/widgets/ProductSuggestion")),
  GenericHeaderBanner: dynamic(() => import("@/widgets/GenericHeaderBanner")),
  ThreeColumnSection: dynamic(() => import("@/widgets/ThreeColumnSection")),
  BannerCareTips: dynamic(() => import("@/widgets/BannerCareTips")),
  TabCareTips: dynamic(() => import("@/widgets/TabCareTips")),
  StoreList: dynamic(() => import("@/widgets/StoreList")),
  CardSlider: dynamic(() => import("@/widgets/CardSlider")),
  TwoColumnSection: dynamic(() => import("@/widgets/TwoColumnSection")),
  TwoColumnTextAndMedia: dynamic(() => import("@/widgets/TwoColumnTextAndMedia")),
  TwoColumnText: dynamic(() => import("@/widgets/TwoColumnText")),
  ProductPillSlider: dynamic(() => import("@/widgets/ProductPillSlider")),
};

const WidgetGenerator: React.FC<IWidgetModel> = async ({ widgetName, widgetValue, lang }) => {
  const adapter = new WidgetParamAdapterFactory().instance(widgetName);
  const adaptedValues = adapter ? await adapter.adapt(widgetValue, lang) : null;
  const widgetKey = widgetName as keyof typeof Widgets;
  const DynamicWidget = Widgets[widgetKey];

  if (DynamicWidget) {
    (DynamicWidget as React.ComponentType<unknown>).displayName = widgetName;
    return <DynamicWidget {...adaptedValues} />;
  } else {
    return null;
  }
};

export default WidgetGenerator;
