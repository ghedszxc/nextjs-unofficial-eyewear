import { FetchStatus, TransformedProducts } from "@/types/plp";
import { CampaignBanner } from "@/adapter/PLP/adapter";
import ProductSlot from "./ProductSlot";
import CampaignBannerCard from "./CampaignBanner";
import TileBanner from "./TileBanner";

type LayoutBlock =
  | { type: "products"; items: TransformedProducts }
  | { type: "fullRow"; banner: CampaignBanner }
  | { type: "halfWidthTile"; banner: CampaignBanner; products: TransformedProducts };

const BlocksGrid = ({
  blocks,
  status,
  slotCount,
  className,
}: {
  blocks: LayoutBlock[];
  status: FetchStatus;
  slotCount: number;
  className?: string;
}) => {
  // Loading state: products haven't arrived yet, so buildPLPLayout produced no product rows.
  // Render skeleton slots like ProductsGrid does; banners take over once data is ready.
  if (status === "loading") {
    return (
      <div className={`grid grid-cols-2 lg:grid-cols-4 ${className ?? ""}`}>
        {Array.from({ length: slotCount }).map((_, i) => (
          <div key={`skel-${i}`} className="col-span-1 h-[327px] lg:h-[474px]">
            <ProductSlot index={i} transformedProducts={[]} status={status} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 ${className ?? ""}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "products":
            return block.items.map((p, i) => (
              <div key={`${idx}-p-${i}`} className="col-span-1">
                <ProductSlot index={i} transformedProducts={block.items} status={status} />
              </div>
            ));

          case "fullRow":
            return (
              <div key={`${idx}-full`} className="col-span-2 lg:col-span-4">
                <CampaignBannerCard banner={block.banner} />
              </div>
            );

          case "halfWidthTile": {
            // Banner occupies 2 of the 4 desktop columns (full row on mobile, where the
            // grid is only 2 columns). `side === "right"` renders the products first and
            // the tile last; otherwise the tile leads the row.
            const tileFirst = block.banner.side !== "right";
            const tile = (
              <div className="col-span-2">
                <TileBanner banner={block.banner} variant="half-width" />
              </div>
            );

            return (
              <div key={`${idx}-ht`} className="contents">
                {tileFirst && tile}
                {block.products?.map((_, i) => (
                  <div key={`${idx}-ht-p-${i}`} className="col-span-1">
                    <ProductSlot index={i} transformedProducts={block.products} status={status} />
                  </div>
                ))}
                {!tileFirst && tile}
              </div>
            );
          }
        }
      })}
    </div>
  );
};

export default BlocksGrid;
