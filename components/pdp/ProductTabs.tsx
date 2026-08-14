"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichText from "../RichText";
import { ProductDetailsTab } from "./ProductDetailsTab";
import { TAB_CONTENT_CARE_CLASSES, TAB_LIST_CLASSES, TAB_TRIGGER_CLASSES, TABS_CONTAINER_CLASSES } from "./constants";

interface DetailItem {
  label: string;
  value: string;
}

interface Tab {
  id: string;
  label: string;
  content: "description" | "details" | "care";
}

interface ProductTabsProps {
  description?: any;
  details?: DetailItem[];
  care?: any;
}

/**
 * Tab configuration
 * Defines available tabs, their labels, and content types
 * Easy to extend or modify without changing component logic
 */
const TAB_CONFIGURATION: Tab[] = [
  {
    id: "description",
    label: "Description",
    content: "description",
  },
  {
    id: "details",
    label: "Details",
    content: "details",
  },
  {
    id: "care",
    label: "Care",
    content: "care",
  },
];

/**
 * Filters tabs based on available content
 */
function getAvailableTabs(config: Tab[], availableContent: Record<string, any>): Tab[] {
  return config.filter((tab) => {
    if (tab.content === "description") return !!availableContent.description;
    if (tab.content === "details") return !!availableContent.details?.length;
    if (tab.content === "care") return !!availableContent.care;
    return true;
  });
}

export function ProductTabs({ description, details, care }: ProductTabsProps) {
  const availableTabs = getAvailableTabs(TAB_CONFIGURATION, {
    description,
    details,
    care,
  });

  if (!availableTabs.length) return null;

  return (
    <Tabs defaultValue={availableTabs[0]?.id} className={TABS_CONTAINER_CLASSES}>
      {/* Tab Triggers */}
      <TabsList className={TAB_LIST_CLASSES}>
        {availableTabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className={TAB_TRIGGER_CLASSES}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab Contents */}
      {description && (
        <TabsContent value="description">
          <RichText
            doc={{
              type: description.type,
              content: description.content,
            }}
            className={{ p: "font-gt-america-standard-light text-base" }}
          />
        </TabsContent>
      )}

      {details?.length ? (
        <TabsContent value="details">
          <ProductDetailsTab details={details} columnsPerRow={2} />
        </TabsContent>
      ) : null}

      {care && (
        <TabsContent value="care" className={TAB_CONTENT_CARE_CLASSES}>
          <p>{care}</p>
        </TabsContent>
      )}
    </Tabs>
  );
}
