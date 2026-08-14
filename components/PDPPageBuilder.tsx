import { CTAProvider } from "@/lib/contexts/CTAVisibilityContext";
import PDP from "./PDP";
import { TooltipProvider } from "./ui/tooltip";

const PDPPageBuilder = ({
  productId,
  pdpData,
  lang,
}: {
  productId: string;
  pdpData: any;
  lang: Language;
}) => {
  return (
    <>
      <TooltipProvider>
        <CTAProvider>
          <PDP productId={productId} pdpData={pdpData} lang={lang} />
        </CTAProvider>
      </TooltipProvider>
    </>
  )
};

export default PDPPageBuilder;
