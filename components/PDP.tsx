import CampaignBanners from "./pdp/CampaignBanners";
import ProductDetail from "./pdp/ProductDetail";
import StickyBottom from "./pdp/StickyBottom";
import { useProductData } from "./pdp/useProductData";
import YouMayAlsoLike from "./pdp/YouMayAlsoLike";
import { api } from "@/lib/api";

const PDP = async ({
  productId,
  pdpData,
  lang,
}: {
  productId: string;
  pdpData: any;
  lang: Language;
}) => {
  const productData = useProductData(pdpData, productId);
  
  // Fetch editorial banners separately in the server component
  const productPlacementsUuids = pdpData?.find((p: any) => p?.name === productId?.replace("-", " ").toLocaleUpperCase())?.content?.placements?.[0]?.contents ?? [];
  let campaign = null;
  
  if (productPlacementsUuids.length) {
    const { success, data } = await api.cms.stories({
      by_uuids_ordered: productPlacementsUuids.join(","),
      language: lang,
    });
    campaign = success && Array.isArray(data) && data.length ? data[0] : null;
  }

  return (
    <>
      <ProductDetail productData={productData} />
      {campaign && <CampaignBanners campaign={campaign} lang={lang} /> }
      <YouMayAlsoLike productId={productId} pdpData={pdpData} lang={lang} isEditorial={campaign ? true : false} />
      <StickyBottom productId={productId} pdpData={pdpData} />
    </>
  );
};

export default PDP;
