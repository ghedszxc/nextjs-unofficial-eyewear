type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

const LABEL_DISPLAY_MAP: Record<string, string> = {
  Male: "Men",
  Female: "Women",
  New: "New in",
};

const getDisplayLabel = (label: string): string => {
  return LABEL_DISPLAY_MAP[label] || label;
};

export default function Breadcrumbs({ items }: BreadcrumbProps) {
  const normalizedItems = items.filter((item) => item.label && item.label.trim() !== "Products");
  return (
    <nav aria-label="Breadcrumb pt-28 ">
      <ol className="flex items-center gap-2">
        {normalizedItems.map((item, index) => {
          const isLast = index === normalizedItems.length - 1;
          const displayLabel = getDisplayLabel(item.label);

          return (
            <li key={item.label} className={`font-gt-america-standard-light flex items-center gap-2`}>
              {!isLast ? (
                <>
                  <a href={item.href} className="transition-colors hover:text-white hover:underline">
                    {displayLabel}
                  </a>
                  <span className="text-white">/</span>
                </>
              ) : (
                <span className="font-gt-america-standard-light text-white">{displayLabel}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
