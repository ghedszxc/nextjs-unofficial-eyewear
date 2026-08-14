import PLP from "./PLP";

const CategoryPageBuilder = async ({
  plpData,
}: {
  plpData: {
    lang: Language;
    category: string[];
    data: any;
  };
}) => {
  const { lang, category, data } = plpData;

  return (
    <PLP
      plpData={{
        lang,
        category,
        data,
      }}
    />
  );
};

export default CategoryPageBuilder;
