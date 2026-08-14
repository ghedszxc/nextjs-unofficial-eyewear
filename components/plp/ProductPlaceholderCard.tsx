/** ---- Placeholder only when truly not enough products ---- */
const ProductPlaceholderCard = ({
  title = "Not enough products",
  subtitle = "Try removing filters or check back later.",
}: {
  title?: string;
  subtitle?: string;
}) => {
  return (
    <div className="border-border bg-background flex h-full w-full flex-col overflow-hidden border">
      <div className="relative flex-1">
        <div className="bg-secondary-light absolute inset-0 grid place-items-center">
          <div className="px-4 text-center">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className="text-muted-foreground/80 mt-1 text-xs">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="border-border border-t p-4">
        <div className="bg-secondary-light h-3 w-28 rounded" />
        <div className="bg-secondary-light mt-2 h-3 w-20 rounded" />
      </div>
    </div>
  );
};

export default ProductPlaceholderCard;
